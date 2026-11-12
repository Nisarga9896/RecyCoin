import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package } from 'lucide-react';
import { api } from '../api';
import { EmptyState, FullLoader, ItemThumb, primaryBtn } from '../components/Ui';
import Particles from '../components/Particles';
import { orderImage } from '../utils/image';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders')
      .then((d) => setOrders(d.orders))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="relative min-h-screen px-4 pb-24 pt-28 sm:px-6">
      <Particles count={6} />
      <div className="relative mx-auto max-w-5xl">
        <div className="mb-8 text-center">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/5 px-4 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-emerald-300">
            <Package className="h-3.5 w-3.5" /> order log
          </p>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            My <span className="text-gradient">orders</span>
          </h1>
          <p className="mt-2 text-emerald-100/50">Track every purchase from placed to delivered.</p>
        </div>

        {loading ? (
          <FullLoader label="Loading orders…" />
        ) : orders.length ? (
          <div className="space-y-4">
            {orders.map((o, i) => (
              <motion.div
                key={o._id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <Link
                  to={`/orders/${o._id}`}
                  className="card-hover flex flex-col gap-4 rounded-3xl border border-emerald-300/12 bg-[#050e15]/80 p-6 sm:flex-row sm:items-center"
                >
                  <ItemThumb image={orderImage(o)} emoji={o.itemEmoji || '📦'} size={64} />
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display text-lg font-bold text-white">{o.itemName}</h3>
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold ${statusColor(o.status)}`}>
                        {o.status}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-emerald-100/45">
                      {o.itemCategory} · Seller: {o.seller?.name || 'RecyCoin'} · Placed {new Date(o.createdAt).toLocaleDateString()}
                    </p>
                    {o.discountPoints > 0 && (
                      <p className="mt-1 text-xs font-bold text-amber-300">You saved {o.discountPoints} RecyPoints 🪙</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-[8px] font-bold uppercase tracking-[0.2em] text-emerald-200/40">Final price</p>
                    <p className="font-display text-xl font-extrabold text-white">₹{o.finalPrice.toLocaleString('en-IN')}</p>
                    <span className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-emerald-300">
                      {o.status === 'delivered' ? 'Track complete ✓' : 'Track order →'}
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <EmptyState emoji="📦" title="No orders yet" subtitle="When you purchase from the marketplace, your orders and live tracking will appear here.">
            <Link to="/marketplace" className={`${primaryBtn} mt-3`}>
              Browse marketplace
            </Link>
          </EmptyState>
        )}
      </div>
    </section>
  );
}

export function statusColor(s) {
  const map = {
    placed: 'bg-amber-400/15 text-amber-200',
    packed: 'bg-sky-400/15 text-sky-200',
    shipped: 'bg-violet-400/15 text-violet-200',
    delivered: 'bg-emerald-400/15 text-emerald-200',
    cancelled: 'bg-rose-400/15 text-rose-200',
  };
  return map[s] || map.placed;
}
