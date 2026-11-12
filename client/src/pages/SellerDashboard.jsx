import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Package, ShoppingBag, Clock, ChevronRight, Boxes, Wallet, Store } from 'lucide-react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import { Avatar, AnimatedCounter, FullLoader, ItemThumb } from '../components/Ui';
import Particles from '../components/Particles';
import { statusColor } from './Orders';
import { orderImage } from '../utils/image';

export default function SellerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const [{ stats }, { orders }] = await Promise.all([api.get('/seller/stats'), api.get('/seller/orders')]);
        setStats(stats);
        setRecent(orders.slice(0, 4));
      } catch {
        setStats(null);
      }
    })();
  }, []);

  if (!stats) return <div className="pt-28"><FullLoader label="Loading seller hub…" /></div>;

  const cards = [
    { label: 'Listed items', value: stats.listed, emoji: '📦', tint: 'text-emerald-300', glow: 'rgba(94,234,212,0.35)' },
    { label: 'Available', value: stats.available, emoji: '🟢', tint: 'text-teal-300', glow: 'rgba(45,212,191,0.35)' },
    { label: 'Sold', value: stats.sold, emoji: '💸', tint: 'text-amber-300', glow: 'rgba(251,191,36,0.35)' },
    { label: 'Revenue', value: `₹${stats.revenue.toLocaleString('en-IN')}`, emoji: '💰', tint: 'text-violet-300', glow: 'rgba(167,139,250,0.35)' },
  ];

  return (
    <section className="relative min-h-screen px-4 pb-24 pt-28 sm:px-6">
      <Particles count={8} />
      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-[2rem] border border-emerald-300/20 bg-[#04121a] p-8 text-white shadow-[0_40px_120px_-60px_rgba(34,211,238,0.9)]"
        >
          <video
            src="/media/cosmos_1564114196.mp4"
            className="absolute inset-0 h-full w-full object-cover opacity-15"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#03110c] via-[#03110c]/80 to-transparent" />
          <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl" />
          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
            <Avatar name={user.name} color={user.avatarColor} size={72} className="ring-4 ring-emerald-300/20" />
            <div className="flex-1">
              <p className="flex items-center gap-2 font-mono text-[9px] font-bold uppercase tracking-[0.28em] text-emerald-300">
                <Store className="h-3.5 w-3.5" /> seller hub
              </p>
              <h1 className="mt-1 font-display text-2xl font-extrabold sm:text-3xl">Welcome, {user.name.split(' ')[0]} 🛍️</h1>
              <p className="mt-1 text-sm text-emerald-100/50">You earn 5% bonus RecyPoints on every sale.</p>
            </div>
            <Link to="/seller/products" className="btn-primary px-6 py-3.5 text-sm">
              <Plus className="h-5 w-5" />
              Manage products
            </Link>
          </div>

          <div className="relative mt-7 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <MiniStat icon={Package} label="Listed" value={stats.listed} />
            <MiniStat icon={Clock} label="Pending orders" value={stats.pending} />
            <MiniStat icon={ShoppingBag} label="Total orders" value={stats.orders} />
            <MiniStat icon={Wallet} label="Revenue" value={`₹${stats.revenue.toLocaleString('en-IN')}`} />
          </div>
        </motion.div>

        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {cards.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="panel panel-hover rounded-3xl p-6"
              style={{ boxShadow: `0 24px 60px -40px ${s.glow}` }}
            >
              <p className="text-2xl">{s.emoji}</p>
              <p className={`mt-2 font-display text-2xl font-extrabold ${s.tint}`}>
                {typeof s.value === 'number' ? <AnimatedCounter value={s.value} /> : s.value}
              </p>
              <p className="mt-1 text-sm font-bold text-emerald-100/40">{s.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          <div className="space-y-3 lg:col-span-1">
            <h2 className="mb-4 font-display text-lg font-bold text-white">Seller tools</h2>
            {[
              { to: '/seller/products', label: 'Manage products', emoji: '📦', desc: `Add, edit or hide ${stats.listed} listings` },
              { to: '/seller/sales', label: 'Sales & orders', emoji: '📋', desc: `${stats.pending} pending orders need attention` },
              { to: '/marketplace', label: 'View marketplace', emoji: '🛍️', desc: 'See all items live' },
            ].map((t, i) => (
              <motion.div key={t.to} initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
                <Link to={t.to} className="group flex items-center gap-4 rounded-2xl border border-emerald-300/12 bg-[#050e15]/70 p-4 transition hover:border-emerald-300/30 hover:bg-emerald-400/5">
                  <span className="grid h-11 w-11 place-items-center rounded-xl border border-emerald-300/10 bg-emerald-400/10 text-xl transition group-hover:scale-110">{t.emoji}</span>
                  <div className="flex-1">
                    <p className="font-display font-bold text-white">{t.label}</p>
                    <p className="text-xs text-emerald-100/40">{t.desc}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-emerald-300/30" />
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-white">Latest sales</h2>
              <Link to="/seller/sales" className="text-sm font-bold text-emerald-300 hover:underline">View all</Link>
            </div>
            {recent.length ? (
              <div className="space-y-3">
                {recent.map((o) => (
                  <Link
                    key={o._id}
                    to={`/orders/${o._id}`}
                    className="card-hover flex items-center gap-4 rounded-3xl border border-emerald-300/12 bg-[#050e15]/80 p-5"
                  >
                    <ItemThumb image={orderImage(o)} emoji={o.itemEmoji || '📦'} size={56} />
                    <div className="flex-1">
                      <p className="font-display font-bold text-white">{o.itemName}</p>
                      <p className="text-xs text-emerald-100/40">Buyer: {o.buyer?.name || '—'} · {new Date(o.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold ${statusColor(o.status)}`}>
                      {o.status}
                    </span>
                    <p className="font-display text-lg font-extrabold text-white">₹{o.finalPrice.toLocaleString('en-IN')}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="grid place-items-center rounded-3xl border-2 border-dashed border-emerald-300/15 bg-emerald-400/[0.03] p-12 text-center">
                <Boxes className="h-8 w-8 text-emerald-300/30" />
                <p className="mt-3 text-sm font-bold text-emerald-100/60">No sales yet — your orders will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function MiniStat({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-emerald-300/15 bg-emerald-400/5 p-4">
      <Icon className="h-4 w-4 text-emerald-300" />
      <p className="mt-1.5 font-display text-xl font-extrabold">{value}</p>
      <p className="font-mono text-[8px] font-semibold uppercase tracking-widest text-emerald-100/40">{label}</p>
    </div>
  );
}
