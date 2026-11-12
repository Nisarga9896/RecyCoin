import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Crown } from 'lucide-react';
import { api } from '../api';
import { Avatar, Spinner } from './Ui';

const MEDALS = ['🥇', '🥈', '🥉'];

export default function Leaderboard({ dark = true, limit = 5, className = '' }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let live = true;
    api.get('/game/leaderboard', { auth: false })
      .then((d) => { if (live) setRows((d.leaderboard || []).slice(0, limit)); })
      .catch(() => {})
      .finally(() => { if (live) setLoading(false); });
    return () => { live = false; };
  }, [limit]);

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-3 py-6 text-emerald-200/60">
        <Spinner className="h-5 w-5" />
        <span className="font-mono text-[10px] uppercase tracking-[0.25em]">Loading leaderboard…</span>
      </div>
    );
  }

  if (!rows.length) return null;

  return (
    <div className={`space-y-2 ${className}`}>
      {rows.map((r, i) => (
        <motion.div
          key={r._id}
          initial={{ opacity: 0, x: -14 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.06 }}
          className={`flex items-center gap-3 rounded-2xl border px-4 py-3 transition ${
            i === 0
              ? 'border-amber-300/30 bg-amber-400/[0.06] hover:bg-amber-400/10'
              : 'border-emerald-300/10 bg-white/[0.02] hover:border-emerald-300/25 hover:bg-emerald-400/[0.05]'
          }`}
        >
          <span className="w-7 text-center text-lg font-extrabold">
            {i < 3 ? MEDALS[i] : <span className="font-display text-sm text-emerald-100/40">{i + 1}</span>}
          </span>
          <Avatar name={r.name} color={r.avatarColor} size={34} />
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1 truncate text-sm font-bold text-emerald-50">
              {r.name}
              {i === 0 && <Crown className="h-3.5 w-3.5 shrink-0 text-amber-300" />}
            </p>
            <p className="font-mono text-[9px] uppercase tracking-widest text-emerald-100/35">
              {r.roundsPlayed} round{r.roundsPlayed === 1 ? '' : 's'} played
            </p>
          </div>
          <div className="text-right">
            <p className="font-display text-sm font-extrabold text-amber-200">🪙 {r.totalEarned.toLocaleString()}</p>
            <p className="font-mono text-[9px] uppercase tracking-widest text-emerald-100/30">earned</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
