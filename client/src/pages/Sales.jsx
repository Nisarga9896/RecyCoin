import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, ChevronRight, Truck, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { useToast } from '../components/Toast';
import { EmptyState, FullLoader, ItemThumb, Spinner, primaryBtn } from '../components/Ui';
import Particles from '../components/Particles';
import { statusColor } from './Orders';
import { orderImage } from '../utils/image';

const NEXT = {
  placed: { label: 'Mark as packed', to: 'packed', cls: 'bg-sky-500/90 hover:bg-sky-500' },
  packed: { label: 'Mark as shipped', to: 'shipped', cls: 'bg-violet-500/90 hover:bg-violet-500' },
  shipped: { label: 'Mark as delivered', to: 'delivered', cls: 'bg-emerald-500/90 hover:bg-emerald-500' },
};

export default function Sales() {
  const { toast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(null);

  async function load() {
    try {
      const { orders } = await api.get('/seller/orders');
      setOrders(orders);
    } catch (e) {
      toast(e.message, 'error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function advance(o, status, cancel) {
    setBusy(o._id + status);
    try {
      await api.patch(`/orders/${o._id}/status`, { status });
      toast(cancel ? 'Order cancelled — points refunded' : `Order → ${status}`, 'success');
      await load();
    } catch (e) {
      toast(e.message, 'error');
    } finally {
      setBusy(null);
    }
  }

  const active = orders.filter((o) => !['delivered', 'cancelled'].includes(o.status));
  const done = orders.filter((o) => ['delivered', 'cancelled'].includes(o.status));

  return (
    <section className="relative min-h-screen px-4 pb-24 pt-28 sm:px-6">
      <Particles count={6} />
      <div className="relative mx-auto max-w-5xl">
        <div className="mb-8 text-center">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/5 px-4 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-emerald-300">
            <Truck className="h-3.5 w-3.5" /> fulfillment
          </p>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Sales <span className="text-gradient">center</span>
          </h1>
          <p className="mt-2 text-emerald-100/50">Move orders through packed → shipped → delivered.</p>
        </div>

        {loading ? (
          <FullLoader label="Loading your sales…" />
        ) : !orders.length ? (
          <EmptyState emoji="📋" title="No sales yet" subtitle="When buyers purchase your items, you can manage and track them here.">
            <Link to="/seller/products" className={`${primaryBtn} mt-3`}>
              List products
              <ChevronRight className="h-4 w-4" />
            </Link>
          </EmptyState>
        ) : (
          <>
            {active.length > 0 && (
              <div className="space-y-4">
                <h2 className="font-mono text-[9px] font-bold uppercase tracking-[0.25em] text-emerald-200/40">Active orders ({active.length})</h2>
                {active.map((o, i) => {
                  const step = NEXT[o.status];
                  return (
                    <motion.div
                      key={o._id}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="rounded-3xl border border-emerald-300/12 bg-[#050e15]/80 p-6"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <ItemThumb image={orderImage(o)} emoji={o.itemEmoji || '📦'} size={56} />
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-display text-lg font-bold text-white">{o.itemName}</h3>
                            <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold ${statusColor(o.status)}`}>{o.status}</span>
                          </div>
                          <p className="mt-1 text-sm text-emerald-100/45">
                            Buyer: <span className="font-semibold text-emerald-100/70">{o.buyer?.name || '—'}</span> · {new Date(o.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-xs font-bold text-emerald-100/35">
                            Price ₹{o.price.toLocaleString('en-IN')}
                            {o.discountPoints > 0 && <span className="text-amber-300"> · buyer used {o.discountPoints} pts</span>} · you earn{' '}
                            <span className="text-emerald-300">₹{Math.floor(o.price * 0.05)} pts</span>
                          </p>
                        </div>
                        <div className="flex flex-wrap justify-end gap-2">
                          {o.status !== 'cancelled' && (
                            <button
                              onClick={() => advance(o, step.to)}
                              disabled={busy}
                              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white transition ${step.cls} disabled:opacity-50`}
                            >
                              {busy ? <Spinner className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                              {step.label}
                            </button>
                          )}
                          {!['delivered', 'shipped', 'cancelled'].includes(o.status) && (
                            <button
                              onClick={() => advance(o, 'cancelled', true)}
                              disabled={busy}
                              className="inline-flex items-center gap-2 rounded-xl border border-rose-300/20 bg-rose-500/10 px-4 py-2.5 text-sm font-bold text-rose-300 transition hover:bg-rose-500/20 disabled:opacity-50"
                            >
                              <X className="h-4 w-4" />
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {done.length > 0 && (
              <div className="mt-10 space-y-3">
                <h2 className="font-mono text-[9px] font-bold uppercase tracking-[0.25em] text-emerald-200/40">Completed ({done.length})</h2>
                {done.map((o) => (
                  <div key={o._id} className="flex items-center gap-4 rounded-2xl border border-emerald-300/10 bg-[#050e15]/50 px-5 py-4">
                    <ItemThumb image={orderImage(o)} emoji={o.itemEmoji || '📦'} size={44} radius="rounded-xl" />
                    <div className="flex-1">
                      <p className="font-display font-bold text-white">{o.itemName}</p>
                      <p className="text-xs text-emerald-100/40">Buyer {o.buyer?.name || '—'} · {new Date(o.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="font-display font-extrabold text-white">₹{o.finalPrice.toLocaleString('en-IN')}</p>
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold ${statusColor(o.status)}`}>
                        {o.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <p className="mt-6 flex items-center gap-2 text-sm font-semibold text-emerald-200/50">
              <Truck className="h-4 w-4" />
              Tip: mark orders as delivered promptly to unlock seller bonuses.
            </p>
          </>
        )}
      </div>
    </section>
  );
}
