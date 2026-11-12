import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Play, Orbit } from 'lucide-react';
import { api } from '../api';
import { playCorrect, playWrong, playWin } from '../sounds';

const FALLBACK_BINS = [
  { key: 'recycle', label: 'Recycle', emoji: '♻️', color: '#10b981' },
  { key: 'reuse', label: 'Reuse', emoji: '🔁', color: '#0ea5e9' },
  { key: 'hazardous', label: 'Hazardous', emoji: '⚠️', color: '#f43f5e' },
];

const FALLBACK_ITEMS = [
  { name: 'Smartphone', emoji: '📱', bin: 'reuse' },
  { name: 'Laptop', emoji: '💻', bin: 'reuse' },
  { name: 'Lithium battery', emoji: '🪫', bin: 'hazardous' },
  { name: 'Copper wire', emoji: '🧲', bin: 'recycle' },
  { name: 'CFL bulb', emoji: '💡', bin: 'hazardous' },
  { name: 'Circuit board', emoji: '🔧', bin: 'recycle' },
  { name: 'Keyboard', emoji: '⌨️', bin: 'reuse' },
  { name: 'DVD player', emoji: '💿', bin: 'recycle' },
  { name: 'Expired UPS battery', emoji: '🔋', bin: 'hazardous' },
  { name: 'Game console', emoji: '🎮', bin: 'hazardous' },
];

const MINI_ROUND = 6;

export default function MiniSort() {
  const [bins, setBins] = useState(FALLBACK_BINS);
  const [pool, setPool] = useState(FALLBACK_ITEMS);
  const [queue, setQueue] = useState([]);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [done, setDone] = useState(false);
  const [started, setStarted] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    api.get('/game/config', { auth: false })
      .then((d) => {
        if (d?.bins?.length) { setBins(d.bins); setPool(d.items); }
      })
      .catch(() => {});
  }, []);

  const current = queue[idx];

  function shuffle(a) {
    const arr = [...a];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function start() {
    setQueue(shuffle(pool).slice(0, MINI_ROUND));
    setIdx(0); setScore(0); setCorrect(0); setDone(false); setFeedback(null);
    setStarted(true);
  }

  function sort(binKey) {
    if (!current || feedback) return;
    const ok = binKey === current.bin;
    const delta = ok ? 10 : -5;
    setFeedback({ ok, delta });
    setScore((s) => Math.max(0, s + delta));
    setCorrect((c) => (ok ? c + 1 : c));
    setTick((t) => t + 1);
    if (ok) playCorrect(); else playWrong();

    setTimeout(() => {
      setFeedback(null);
      if (idx === queue.length - 1) {
        playWin();
        setDone(true);
      } else {
        setIdx((i) => i + 1);
      }
    }, ok ? 650 : 900);
  }

  return (
    <div className="holo-ring relative mx-auto max-w-md overflow-hidden rounded-[2rem] border border-emerald-300/20 bg-[#050e15]/85 p-6 shadow-[0_40px_120px_-50px_rgba(34,211,238,0.9)] backdrop-blur-2xl">
      <div className="pointer-events-none absolute -inset-2 -z-10 rounded-[3rem] bg-gradient-to-br from-emerald-400/20 via-cyan-400/10 to-lime-400/20 blur-2xl" />
      <div className="pointer-events-none absolute inset-0 scanlines opacity-30" />

      <div className="relative flex items-center justify-between">
        <span className="flex items-center gap-2 font-display text-sm font-extrabold uppercase tracking-[0.15em] text-white">
          <Orbit className="h-4 w-4 text-emerald-300" />
          {done ? 'Round complete' : started ? 'Sort it right' : 'Live demo'}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full border border-amber-300/30 bg-amber-400/10 px-3 py-1 font-display text-sm font-bold text-amber-200">
          🪙 {score}
        </span>
      </div>

      <AnimatePresence mode="wait">
        {!started && !done && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="relative mt-6"
          >
            <div className="grid place-items-center rounded-2xl border border-emerald-300/10 bg-[#03110c]/60 py-10">
              <motion.span
                className="text-7xl drop-shadow-[0_0_30px_rgba(94,234,212,0.6)]"
                animate={{ y: [0, -10, 0], rotate: [0, 6, -6, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                ♻️
              </motion.span>
              <p className="mt-4 px-6 text-center text-sm font-semibold text-emerald-100/50">
                Try sorting e-waste into the right bin — it's fun, I promise.
              </p>
            </div>
            <button onClick={start} className="btn-primary mt-5 flex w-full items-center justify-center gap-2 py-4 text-sm">
              <Play className="h-5 w-5" />
              Play the demo
            </button>
            <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-300/40">6 items · +10 per correct sort</p>
          </motion.div>
        )}

        {started && !done && (
          <motion.div
            key="playing"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="relative mt-6"
          >
            <div className="mb-4 flex items-center justify-between font-mono text-[9px] font-bold uppercase tracking-[0.25em] text-emerald-300/50">
              <span>{idx + 1} / {queue.length}</span>
              <span>{correct} correct</span>
            </div>
            <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-emerald-400/10">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 shadow-[0_0_16px_rgba(34,211,238,0.8)]"
                animate={{ width: `${((idx + (feedback ? 1 : 0)) / queue.length) * 100}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>

            <div className="relative grid place-items-center rounded-2xl border border-emerald-300/10 bg-[#03110c]/60 py-7">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.name + tick}
                  initial={{ opacity: 0, y: -18, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5, y: 12 }}
                  transition={{ type: 'spring', stiffness: 280, damping: 20 }}
                  className="text-center"
                >
                  <span className={`inline-block text-6xl drop-shadow-[0_0_24px_rgba(94,234,212,0.5)] ${feedback && !feedback.ok ? 'grayscale opacity-50' : ''}`}>
                    {current.emoji}
                  </span>
                  <p className="mt-2 text-sm font-extrabold text-white">{current.name}</p>
                </motion.div>
              </AnimatePresence>

              <AnimatePresence>
                {feedback && (
                  <motion.div
                    key={`fb-${tick}`}
                    initial={{ opacity: 0, scale: 0.5, y: 6 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16, scale: 1.1 }}
                    className="pointer-events-none absolute top-2 z-10"
                  >
                    <span className={`inline-flex items-center gap-1 rounded-2xl px-4 py-2 font-display text-lg font-extrabold text-white shadow-xl ${feedback.ok ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                      {feedback.ok ? '✓' : '✗'} {feedback.delta > 0 ? `+${feedback.delta}` : feedback.delta}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2.5">
              {bins.map((b) => (
                <button
                  key={b.key}
                  onClick={() => sort(b.key)}
                  className={`group cursor-pointer rounded-2xl border-2 p-3 text-center backdrop-blur transition-all duration-200 ${
                    feedback?.ok && current.bin === b.key ? 'scale-[1.04]' : 'hover:scale-[1.03]'
                  }`}
                  style={{
                    background: feedback?.ok && current.bin === b.key ? `${b.color}26` : 'rgba(3,17,12,0.6)',
                    borderColor: feedback?.ok && current.bin === b.key ? b.color : 'rgba(94,234,212,0.15)',
                  }}
                >
                  <span className="inline-block text-2xl transition group-hover:scale-110">{b.emoji}</span>
                  <p className="mt-1 font-mono text-[9px] font-extrabold uppercase tracking-widest" style={{ color: b.color }}>{b.label}</p>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {done && (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative mt-6 text-center"
          >
            <motion.span
              className="inline-block text-6xl drop-shadow-[0_0_30px_rgba(94,234,212,0.6)]"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 220 }}
            >
              {score >= 40 ? '🏆' : score > 0 ? '🌟' : '🌱'}
            </motion.span>
            <p className="mt-3 font-display text-xl font-extrabold text-white">
              You sorted {correct}/{queue.length} right!
            </p>
            <p className="mt-1 text-sm text-emerald-100/45">{score} RecyPoints in 6 items — imagine a full round.</p>
            <Link
              to="/game"
              className="btn-primary mt-5 inline-flex w-full items-center justify-center gap-2 py-4 text-sm"
            >
              Play the full game
              <ArrowRight className="h-4 w-4" />
            </Link>
            <button onClick={start} className="mt-3 font-mono text-[10px] font-bold uppercase tracking-widest text-emerald-300/60 hover:text-emerald-200">
              Sort again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
