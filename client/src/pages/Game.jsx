import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, Zap, Trophy, RotateCcw, Play, LogIn, Flame, Orbit } from 'lucide-react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import Particles from '../components/Particles';
import Leaderboard from '../components/Leaderboard';
import { primaryBtn, ghostBtn } from '../components/Ui';
import { playCorrect, playWrong, playWin, playTick, playCoin } from '../sounds';

const FALLBACK_BINS = [
  { key: 'recycle', label: 'Recycle', emoji: '♻️', color: '#10b981', desc: 'Materials that can be made into new products.' },
  { key: 'reuse', label: 'Reuse', emoji: '🔁', color: '#0ea5e9', desc: 'Working items that can be used again.' },
  { key: 'hazardous', label: 'Hazardous', emoji: '⚠️', color: '#f43f5e', desc: 'Dangerous materials needing special disposal.' },
];

const FALLBACK_ITEMS = [
  { name: 'Smartphone', emoji: '📱', desc: 'Still powers on and functions normally.', bin: 'reuse', hint: 'Works fine — don\'t waste it!' },
  { name: 'Laptop', emoji: '💻', desc: 'Boots up and runs applications.', bin: 'reuse', hint: 'Still functional — resell or donate.' },
  { name: 'Lithium battery', emoji: '🪫', desc: 'Swollen, old cell phone battery.', bin: 'hazardous', hint: 'Batteries contain toxic chemicals.' },
  { name: 'Copper wire', emoji: '🧲', desc: 'Bare copper wiring from electronics.', bin: 'recycle', hint: 'Copper is highly recyclable.' },
  { name: 'CFL bulb', emoji: '💡', desc: 'Compact fluorescent lamp, broken.', bin: 'hazardous', hint: 'Contains small amounts of mercury!' },
  { name: 'Circuit board', emoji: '🔧', desc: 'Motherboard with a burnt chip.', bin: 'recycle', hint: 'Recyclers recover gold and copper.' },
  { name: 'Keyboard', emoji: '⌨️', desc: 'Mechanical keyboard, all keys work.', bin: 'reuse', hint: 'Works — someone will use it!' },
  { name: 'Printer toner', emoji: '🖨️', desc: 'Empty laser printer toner cartridge.', bin: 'hazardous', hint: 'Toner dust is a respiratory hazard.' },
  { name: 'Aluminium heatsink', emoji: '🌀', desc: 'Old CPU heatsink with fan.', bin: 'recycle', hint: 'Aluminium can be melted and reused.' },
  { name: 'Game console', emoji: '🎮', desc: 'Old console that overheats fast.', bin: 'hazardous', hint: 'Internal power board is failing.' },
];

const ROUND_SIZE = 10;

export default function Game() {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [config, setConfig] = useState({ bins: FALLBACK_BINS, items: FALLBACK_ITEMS });
  const [bins, setBins] = useState(FALLBACK_BINS);
  const [items, setItems] = useState(FALLBACK_ITEMS);
  const [phase, setPhase] = useState('intro');
  const [roundItems, setRoundItems] = useState([]);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [saving, setSaving] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [tick, setTick] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    api.get('/game/config', { auth: false }).then((d) => {
      if (d?.bins?.length) {
        setConfig(d);
        setBins(d.bins);
        setItems(d.items);
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (phase !== 'playing') return;
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, [phase]);

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function startRound() {
    setRoundItems(shuffle(items).slice(0, ROUND_SIZE));
    setIdx(0);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setCorrect(0);
    setFeedback(null);
    setElapsed(0);
    setPhase('playing');
    playTick();
  }

  const current = roundItems[idx];

  function advance(inputBin) {
    if (!current || feedback) return;
    const ok = inputBin === current.bin;
    const delta = ok ? 10 : -5;

    setFeedback({ ok, delta });
    if (ok) {
      setScore((s) => s + delta);
      setCorrect((c) => c + 1);
      const ns = streak + 1;
      setStreak(ns);
      setBestStreak((b) => Math.max(b, ns));
    } else {
      setStreak(0);
      setScore((s) => Math.max(0, s + delta));
    }
    setTick((t) => t + 1);

    const isLast = idx === roundItems.length - 1;
    if (ok) playCorrect(); else playWrong();
    setTimeout(() => {
      setFeedback(null);
      setTick(0);
      if (isLast) {
        playWin();
        setPhase('result');
      } else {
        setIdx((i) => i + 1);
      }
    }, ok ? 750 : 1100);
  }

  function handleDrop(binKey) {
    advance(binKey);
  }

  async function saveAndRestart() {
    if (!user) return;
    setSaving(true);
    try {
      await api.post('/game/result', { score });
      await refreshUser();
      playCoin();
      toast(`Round saved! +${score} RecyPoints 🪙`, 'coin');
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setSaving(false);
      startRound();
    }
  }

  function restartNow() {
    startRound();
  }

  const accuracy = roundItems.length ? Math.round((correct / roundItems.length) * 100) : 0;

  return (
    <section className="relative min-h-screen overflow-hidden px-4 pb-24 pt-28 sm:px-6">
      <Particles count={10} />
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 text-center">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/5 px-4 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-emerald-300">
            <Orbit className="h-3.5 w-3.5" /> sorting protocol
          </p>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Cosmic <span className="text-gradient">Sorting</span> game
          </h1>
          <p className="mt-2 text-emerald-100/50">
            Drag each item into the correct bin or tap a bin to sort. +10 for correct, −5 for a fumble.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {phase === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="mx-auto max-w-2xl"
            >
              <div className="panel relative overflow-hidden rounded-[2rem] p-8">
                <div className="pointer-events-none absolute inset-0 scanlines opacity-20" />
                <div className="relative flex items-center gap-3 rounded-2xl border border-emerald-300/15 bg-emerald-400/5 p-4 text-sm font-semibold text-emerald-100/80">
                  <Info className="h-5 w-5 shrink-0 text-emerald-300" />
                  {user
                    ? `Hey ${user.name.split(' ')[0]}! You have ${user.points.toLocaleString()} RecyPoints. Every round earns more.`
                    : 'Log in to save your points — or play a practice round now!'}
                </div>

                <div className="relative mt-6 grid gap-3">
                  {bins.map((b) => (
                    <div key={b.key} className="flex items-center gap-4 rounded-2xl border border-emerald-300/10 bg-[#03110c]/50 p-4">
                      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-white/5 text-2xl" style={{ background: `${b.color}22` }}>
                        {b.emoji}
                      </span>
                      <div>
                        <p className="font-display font-bold" style={{ color: b.color }}>{b.label} bin</p>
                        <p className="text-sm text-emerald-100/45">{b.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="relative mt-8 flex flex-col gap-3 sm:flex-row">
                  <button onClick={startRound} className={`${primaryBtn} flex-1 py-4 text-base`}>
                    <Play className="h-5 w-5" />
                    Start round
                  </button>
                  {!user && (
                    <button onClick={() => navigate('/register')} className={`${ghostBtn} flex-1 py-4`}>
                      <LogIn className="h-5 w-5" />
                      Create account
                    </button>
                  )}
                </div>
              </div>

              <div className="panel mt-6 overflow-hidden rounded-[2rem] p-6">
                <div className="mb-4 flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-amber-300" />
                  <h3 className="font-display text-base font-extrabold text-white">Top recyclers this week</h3>
                </div>
                <Leaderboard limit={5} />
              </div>
            </motion.div>
          )}

          {phase === 'playing' && (
            <motion.div
              key="play"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Hud label="Points" value={score} emoji="🪙" className="text-amber-300" />
                <Hud label="Streak" value={`${streak}×`} emoji={<Flame className="h-4 w-4 text-orange-400" />} className="text-orange-300" />
                <Hud label="Item" value={`${idx + 1} / ${roundItems.length}`} emoji="📦" className="text-emerald-300" />
                <Hud label="Time" value={fmt(elapsed)} emoji="⏱️" className="text-cyan-300" />
              </div>

              <div className="mb-8 h-2.5 overflow-hidden rounded-full border border-emerald-300/10 bg-emerald-400/10">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 shadow-[0_0_18px_rgba(34,211,238,0.8)]"
                  animate={{ width: `${((idx + (feedback ? 1 : 0)) / roundItems.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>

              <div className="relative mb-8 grid min-h-[15rem] place-items-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current.name + tick}
                    initial={{ opacity: 0, y: -30, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.6, y: 14 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                    draggable
                    onDragStart={() => setDragging(true)}
                    onDragEnd={() => setDragging(false)}
                    className={`panel relative select-none rounded-[2rem] p-8 text-center transition ${
                      dragging ? 'border-emerald-300/60 ring-8 ring-emerald-400/10' : ''
                    }`}
                  >
                    <span className={`inline-block text-7xl drop-shadow-[0_0_30px_rgba(94,234,212,0.55)] ${feedback && !feedback.ok ? 'grayscale' : ''}`}>
                      {current.emoji}
                    </span>
                    <h2 className="mt-4 font-display text-xl font-extrabold text-white">{current.name}</h2>
                    <p className="mt-1 text-sm text-emerald-100/50">{current.desc}</p>
                    <p className="mt-3 font-mono text-[9px] font-bold uppercase tracking-[0.25em] text-emerald-300/40">
                      {dragging ? 'Drop it into the right bin!' : 'Drag it… or tap a bin below'}
                    </p>
                  </motion.div>
                </AnimatePresence>

                <AnimatePresence>
                  {feedback && (
                    <motion.div
                      key={`fb-${tick}`}
                      initial={{ opacity: 0, scale: 0.4, y: 8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, y: -24, scale: 1.1 }}
                      className="pointer-events-none absolute left-1/2 top-0 z-10 -translate-x-1/2"
                    >
                      <span
                        className={`inline-flex items-center gap-2 rounded-2xl px-6 py-3 font-display text-2xl font-extrabold text-white shadow-2xl ${
                          feedback.ok ? 'bg-emerald-500' : 'bg-rose-500'
                        }`}
                      >
                        {feedback.ok ? '✅' : '❌'} {feedback.delta > 0 ? `+${feedback.delta}` : feedback.delta} 🪙
                      </span>
                      {!feedback.ok && (
                        <p className="mt-2 text-center text-sm font-bold text-rose-300">
                          Correct bin: <span className="uppercase">{bins.find((b) => b.key === current.bin)?.label}</span>
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {feedback?.ok && <Burst color="#34d399" />}
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {bins.map((b) => (
                  <Bin
                    key={b.key}
                    bin={b}
                    onDrop={() => handleDrop(b.key)}
                    onClick={() => handleDrop(b.key)}
                    feedback={feedback}
                    activeColor={current?.bin === b.key ? b.color : null}
                  />
                ))}
              </div>

              <p className="mt-6 text-center font-mono text-[10px] font-semibold uppercase tracking-widest text-emerald-200/40">
                Hint: {current.hint}
              </p>
            </motion.div>
          )}

          {phase === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="mx-auto max-w-2xl"
            >
              <div className="relative overflow-hidden rounded-[2rem] border border-emerald-300/25 bg-gradient-to-br from-[#04121a] via-[#03110c] to-[#04121a] p-8 text-white shadow-[0_40px_120px_-50px_rgba(34,211,238,0.9)]">
                <Particles count={12} />
                <div className="pointer-events-none absolute inset-0 grid-bg opacity-20" />
                <div className="relative text-center">
                  <motion.span
                    className="inline-block text-6xl drop-shadow-[0_0_30px_rgba(94,234,212,0.6)]"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 220 }}
                  >
                    {accuracy >= 90 ? '🏆' : accuracy >= 60 ? '🌟' : '🌱'}
                  </motion.span>
                  <h2 className="mt-3 font-display text-3xl font-extrabold">
                    Round {Math.round(accuracy)}% sorted correctly!
                  </h2>
                  <p className="mt-1 text-emerald-100/50">
                    {score > 0 ? 'The planet thanks you for this round.' : 'Every mistake is a lesson for next time.'}
                  </p>

                  <div className="mt-8 grid grid-cols-3 gap-4">
                    <ResultStat label="Points earned" value={`+${score}`} emoji="🪙" />
                    <ResultStat label="Best streak" value={`${bestStreak}×`} emoji="🔥" />
                    <ResultStat label="Correct" value={`${correct}/${roundItems.length}`} emoji="✅" />
                  </div>

                  {user ? (
                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                      <button onClick={saveAndRestart} disabled={saving} className={`${primaryBtn} flex-1 py-4`}>
                        <Zap className="h-5 w-5" />
                        {saving ? 'Saving…' : 'Save points & play again'}
                      </button>
                      <button onClick={restartNow} className="rounded-2xl border border-emerald-300/20 px-6 py-4 text-sm font-bold text-emerald-100 transition hover:bg-emerald-400/10">
                        Play again (no save)
                      </button>
                    </div>
                  ) : (
                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                      <Link to="/register" className={`${primaryBtn} flex-1 py-4`}>
                        <Trophy className="h-5 w-5" />
                        Save points — create account
                      </Link>
                      <button onClick={restartNow} className="rounded-2xl border border-emerald-300/20 px-6 py-4 text-sm font-bold text-emerald-100 transition hover:bg-emerald-400/10">
                        Practice again
                      </button>
                    </div>
                  )}

                  <p className="mt-6 font-mono text-[9px] uppercase tracking-widest text-emerald-100/35">
                    Round completed in {fmt(elapsed)} · saves update your dashboard instantly
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function Hud({ label, value, emoji, className }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-emerald-300/12 bg-[#050e15]/70 px-4 py-3 backdrop-blur">
      <div className="flex items-center gap-1.5 font-mono text-[9px] font-bold uppercase tracking-widest text-emerald-200/40">
        {emoji}
        {label}
      </div>
      <span className={`font-display text-lg font-extrabold ${className}`}>{value}</span>
    </div>
  );
}

function Bin({ bin, onDrop, onClick, feedback, activeColor }) {
  const [over, setOver] = useState(false);

  const isActive = feedback ? activeColor === bin.color && feedback.ok : over || activeColor === bin.color;

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => { e.preventDefault(); setOver(false); onDrop(); }}
      onClick={onClick}
      className={`group cursor-pointer select-none rounded-3xl border-2 p-5 text-center backdrop-blur transition-all duration-200 ${
        isActive ? 'scale-[1.03]' : 'hover:scale-[1.01]'
      }`}
      style={{
        background: isActive ? `${bin.color}20` : 'rgba(5,14,21,0.7)',
        borderColor: isActive ? bin.color : 'rgba(94,234,212,0.14)',
        boxShadow: isActive ? `0 18px 44px -16px ${bin.color}99` : undefined,
      }}
    >
      <span className={`inline-grid h-16 w-16 place-items-center rounded-2xl text-3xl transition group-hover:scale-110 ${over ? 'scale-110' : ''}`} style={{ background: `${bin.color}18` }}>
        {bin.emoji}
      </span>
      <p className="mt-3 font-display text-lg font-extrabold" style={{ color: bin.color }}>
        {bin.label}
      </p>
      <p className="mt-1 text-xs font-semibold text-emerald-100/40">{bin.desc}</p>
      <p className="mt-2 font-mono text-[8px] font-bold uppercase tracking-[0.25em] text-emerald-200/30">
        {over ? 'Release to drop!' : 'Drag or tap here'}
      </p>
    </div>
  );
}

function ResultStat({ label, value, emoji }) {
  return (
    <div className="rounded-2xl border border-emerald-300/15 bg-emerald-400/5 p-4">
      <p className="text-2xl">{emoji}</p>
      <p className="mt-1 font-display text-xl font-extrabold text-emerald-200">{value}</p>
      <p className="font-mono text-[8px] font-semibold uppercase tracking-widest text-emerald-100/40">{label}</p>
    </div>
  );
}

function Burst({ color }) {
  const particles = useMemo(() =>
    Array.from({ length: 14 }, (_, i) => ({
      id: i,
      angle: (i / 14) * Math.PI * 2 + Math.random() * 0.4,
      dist: 70 + Math.random() * 70,
      size: 6 + Math.random() * 8,
    })), []);
  return (
    <div className="pointer-events-none absolute left-1/2 top-16 z-10">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full"
          style={{ width: p.size, height: p.size, background: color, left: 0, top: 0, boxShadow: `0 0 12px ${color}` }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{ x: Math.cos(p.angle) * p.dist, y: Math.sin(p.angle) * p.dist, opacity: 0, scale: 0.2 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
}

function fmt(s) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${String(sec).padStart(2, '0')}`;
}
