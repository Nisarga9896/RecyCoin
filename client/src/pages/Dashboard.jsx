import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Gamepad2, ShoppingBag, Coins, TrendingUp, ChevronRight, Trophy, LayoutDashboard, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import { Avatar, AnimatedCounter, CoinBadge, FullLoader, ItemThumb } from '../components/Ui';
import Leaderboard from '../components/Leaderboard';
import Particles from '../components/Particles';
import { orderImage } from '../utils/image';

const LEVELS = [
  { min: 0, name: 'Eco Seedling', emoji: '🌱', color: 'from-emerald-400 to-teal-500', next: 250 },
  { min: 250, name: 'Green Sprout', emoji: '🌿', color: 'from-teal-400 to-emerald-600', next: 700 },
  { min: 700, name: 'Waste Warrior', emoji: '♻️', color: 'from-emerald-500 to-green-600', next: 1400 },
  { min: 1400, name: 'Circular Champion', emoji: '🏆', color: 'from-amber-400 to-yellow-500', next: Infinity },
];

function levelFor(points) {
  return LEVELS.filter((l) => points >= l.min).pop();
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { orders } = await api.get('/orders');
        setOrders(orders.slice(0, 4));
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (!user) return <FullLoader label="Loading…" />;

  const level = levelFor(user.totalEarned);
  const nextLevel = level.next === Infinity ? null : { min: level.next, gap: level.next - level.min, pct: Math.min(100, Math.round(((user.totalEarned - level.min) / (level.next - level.min)) * 100)) };

  const stats = [
    { label: 'RecyPoints', value: user.points, emoji: '🪙', tint: 'text-amber-300', glow: 'rgba(251,191,36,0.35)' },
    { label: 'Total earned', value: user.totalEarned, emoji: '📈', tint: 'text-emerald-300', glow: 'rgba(94,234,212,0.35)' },
    { label: 'Rounds played', value: user.roundsPlayed, emoji: '🎮', tint: 'text-cyan-300', glow: 'rgba(34,211,238,0.35)' },
    { label: 'Best round score', value: user.bestScore, emoji: '🎯', tint: 'text-violet-300', glow: 'rgba(167,139,250,0.35)' },
  ];

  const quick = [
    { to: '/game', label: 'Play game', emoji: '🎮', desc: 'Earn +10 per sort' },
    { to: '/marketplace', label: 'Marketplace', emoji: '🛍️', desc: 'Spend your points' },
    { to: '/orders', label: 'My orders', emoji: '📦', desc: 'Track deliveries' },
    { to: '/wishlist', label: 'Wishlist', emoji: '❤️', desc: 'Saved items' },
  ];

  return (
    <section className="relative min-h-screen px-4 pb-24 pt-28 sm:px-6">
      <Particles count={8} />
      <div className="relative mx-auto max-w-7xl">
        {/* Header card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-[2rem] border border-emerald-300/20 bg-[#04121a] p-8 text-white shadow-[0_40px_120px_-60px_rgba(34,211,238,0.9)]"
        >
          <video
            src="/media/cosmos_1146673608.mp4"
            className="absolute inset-0 h-full w-full object-cover opacity-15"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#03110c] via-[#03110c]/80 to-transparent" />
          <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl" />
          <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <Avatar name={user.name} color={user.avatarColor} size={72} className="ring-4 ring-emerald-300/20" />
            <div className="flex-1">
              <p className="flex items-center gap-2 font-mono text-[9px] font-bold uppercase tracking-[0.28em] text-emerald-300">
                <LayoutDashboard className="h-3.5 w-3.5" /> buyer dashboard
              </p>
              <h1 className="mt-1 font-display text-2xl font-extrabold sm:text-3xl">Hello, {user.name.split(' ')[0]} 👋</h1>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r ${level.color} px-3 py-1 text-xs font-bold text-emerald-950`}>
                  {level.emoji} {level.name}
                </span>
                <CoinBadge points={user.points} />
              </div>
            </div>
            <Link to="/game" className="btn-primary px-6 py-3.5 text-sm">
              <Gamepad2 className="h-5 w-5" />
              Play now
            </Link>
          </div>

          {nextLevel && (
            <div className="relative mt-7">
              <div className="mb-2 flex justify-between font-mono text-[9px] font-bold uppercase tracking-widest text-emerald-100/60">
                <span>{user.totalEarned.toLocaleString()} pts earned</span>
                <span>{Math.max(0, nextLevel.min - user.totalEarned)} pts to {nextLevel.min}</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full border border-emerald-300/10 bg-white/5">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-amber-400 shadow-[0_0_18px_rgba(94,234,212,0.8)]"
                  initial={{ width: 0 }}
                  animate={{ width: `${nextLevel.pct}%` }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </div>
          )}
        </motion.div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="panel panel-hover rounded-3xl p-6"
              style={{ boxShadow: `0 24px 60px -40px ${s.glow}` }}
            >
              <p className="text-2xl">{s.emoji}</p>
              <p className={`mt-2 font-display text-3xl font-extrabold ${s.tint}`}>
                <AnimatedCounter value={s.value} />
              </p>
              <p className="mt-1 text-sm font-bold text-emerald-100/40">{s.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          {/* Quick actions */}
          <div className="lg:col-span-1">
            <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-bold text-white">
              <Sparkles className="h-4 w-4 text-emerald-300" /> Quick actions
            </h2>
            <div className="space-y-3">
              {quick.map((q, i) => (
                <motion.div
                  key={q.label}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Link
                    to={q.to}
                    className="group flex items-center gap-4 rounded-2xl border border-emerald-300/12 bg-[#050e15]/70 p-4 transition hover:border-emerald-300/30 hover:bg-emerald-400/5"
                  >
                    <span className="grid h-11 w-11 place-items-center rounded-xl border border-emerald-300/10 bg-emerald-400/10 text-xl transition group-hover:scale-110">{q.emoji}</span>
                    <div className="flex-1">
                      <p className="font-display font-bold text-white">{q.label}</p>
                      <p className="text-xs text-emerald-100/40">{q.desc}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-emerald-300/30" />
                  </Link>
                </motion.div>
              ))}
            </div>

            {!loading && orders.length === 0 && (
              <div className="mt-6 rounded-3xl border-2 border-dashed border-emerald-300/15 bg-emerald-400/[0.03] p-5 text-center">
                <TrendingUp className="mx-auto h-6 w-6 text-emerald-300/60" />
                <p className="mt-2 text-sm font-bold text-emerald-100/80">No orders yet</p>
                <button onClick={() => navigate('/marketplace')} className="mt-2 text-xs font-bold text-emerald-300 hover:underline">
                  Explore the marketplace →
                </button>
              </div>
            )}

            <div className="mt-8">
              <div className="mb-3 flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-300" />
                <h2 className="font-display text-lg font-bold text-white">Top recyclers</h2>
              </div>
              <div className="panel overflow-hidden rounded-3xl p-3">
                <Leaderboard limit={5} />
              </div>
            </div>
          </div>

          {/* Recent orders */}
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-white">Recent orders</h2>
              <Link to="/orders" className="text-sm font-bold text-emerald-300 hover:underline">View all</Link>
            </div>
            {loading ? (
              <FullLoader label="Loading orders…" />
            ) : orders.length ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {orders.map((o, i) => (
                  <motion.div
                    key={o._id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <Link to={`/orders/${o._id}`} className="card-hover flex items-center gap-4 rounded-3xl border border-emerald-300/12 bg-[#050e15]/80 p-5">
                      <ItemThumb image={orderImage(o)} emoji={o.itemEmoji || '📦'} size={56} />
                      <div className="flex-1">
                        <p className="font-display font-bold text-white">{o.itemName}</p>
                        <p className="text-xs text-emerald-100/40">{o.itemCategory} · ₹{o.finalPrice.toLocaleString('en-IN')}</p>
                        <span className={`mt-1.5 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold ${statusColor(o.status)}`}>
                          {o.status}
                        </span>
                      </div>
                      {o.discountPoints > 0 && (
                        <span className="flex items-center gap-1 text-xs font-bold text-amber-300">
                          <Coins className="h-3.5 w-3.5" /> −{o.discountPoints}
                        </span>
                      )}
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="grid place-items-center rounded-3xl border-2 border-dashed border-emerald-300/15 bg-emerald-400/[0.03] p-12 text-center">
                <ShoppingBag className="h-8 w-8 text-emerald-300/30" />
                <p className="mt-3 font-display font-bold text-emerald-100/60">Nothing here yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function statusColor(s) {
  const map = {
    placed: 'bg-amber-400/15 text-amber-200',
    packed: 'bg-sky-400/15 text-sky-200',
    shipped: 'bg-violet-400/15 text-violet-200',
    delivered: 'bg-emerald-400/15 text-emerald-200',
    cancelled: 'bg-rose-400/15 text-rose-200',
  };
  return map[s] || map.placed;
}
