import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, X, Package, Truck, Home, Box } from 'lucide-react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import { FullLoader, ItemThumb } from '../components/Ui';
import Particles from '../components/Particles';
import { statusColor } from './Orders';
import { orderImage } from '../utils/image';

const FLOW = [
  { key: 'placed', label: 'Order placed', icon: Package, desc: 'Order received & reviewed' },
  { key: 'packed', label: 'Packed', icon: Box, desc: 'Item packed, ready to dispatch' },
  { key: 'shipped', label: 'Shipped', icon: Truck, desc: 'On its way to you' },
  { key: 'delivered', label: 'Delivered', icon: Home, desc: 'Arrived safely. Enjoy!' },
];

export default function OrderTracking() {
  const { id } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get(`/orders/${id}`)
      .then((d) => setOrder(d.order))
      .catch((e) => setError(e.message));
  }, [id]);

  if (error)
    return (
      <section className="grid min-h-[70vh] place-items-center px-4 pt-24">
        <div className="text-center">
          <p className="text-4xl">🔒</p>
          <p className="mt-3 font-display text-lg font-bold text-white">{error}</p>
          <Link to="/orders" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-emerald-300 hover:underline">
            <ArrowLeft className="h-4 w-4" /> Back to orders
          </Link>
        </div>
      </section>
    );

  if (!order) return <div className="pt-28"><FullLoader label="Loading tracking…" /></div>;

  const cancelled = order.status === 'cancelled';
  const currentIdx = FLOW.findIndex((f) => f.key === order.status);

  return (
    <section className="relative min-h-screen px-4 pb-24 pt-28 sm:px-6">
      <Particles count={6} />
      <div className="relative mx-auto max-w-4xl">
        <Link to="/orders" className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-emerald-200/60 transition hover:text-emerald-100">
          <ArrowLeft className="h-4 w-4" /> Back to my orders
        </Link>

        <div className="panel overflow-hidden rounded-[2rem]">
          {/* header */}
          <div className="flex flex-col gap-4 border-b border-emerald-300/10 bg-[#04121a] p-7 sm:flex-row sm:items-center">
            <ItemThumb image={orderImage(order)} emoji={order.itemEmoji || '📦'} size={64} />
            <div className="flex-1">
              <h1 className="font-display text-2xl font-extrabold text-white">{order.itemName}</h1>
              <p className="text-sm text-emerald-100/45">
                {order.itemCategory} · Order #{order._id.slice(-6).toUpperCase()} · from {order.seller?.name}
              </p>
            </div>
            <div className="text-right">
              <span className={`inline-block rounded-full px-4 py-1.5 text-xs font-bold uppercase ${statusColor(order.status)}`}>
                {order.status}
              </span>
              <p className="mt-2 text-xs font-semibold text-emerald-100/40">
                Price ₹{order.price.toLocaleString('en-IN')}
                {order.discountPoints > 0 && (
                  <span className="text-amber-300"> − {order.discountPoints} pts</span>
                )}
              </p>
              <p className="font-display text-xl font-extrabold text-white">
                ₹{order.finalPrice.toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          <div className="p-7">
            {cancelled ? (
              <div className="rounded-2xl border border-rose-300/20 bg-rose-500/10 p-6 text-center">
                <X className="mx-auto h-8 w-8 text-rose-400" />
                <p className="mt-2 font-display text-lg font-bold text-rose-200">Order cancelled</p>
                <p className="text-sm text-rose-200/60">Your RecyPoints discount was refunded automatically.</p>
              </div>
            ) : (
              <div className="relative">
                <div className="absolute bottom-6 left-6 top-6 w-1 rounded-full bg-emerald-400/10" />
                <div className="space-y-0">
                  {FLOW.map((f, i) => {
                    const reached = i <= currentIdx;
                    const isCurrent = i === currentIdx;
                    return (
                      <motion.div
                        key={f.key}
                        initial={{ opacity: 0, x: -14 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.12 }}
                        className="relative flex gap-5 pb-8 last:pb-0"
                      >
                        <motion.span
                          animate={isCurrent ? { scale: [1, 1.18, 1] } : {}}
                          transition={{ repeat: isCurrent ? Infinity : 0, duration: 1.6 }}
                          className={`relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-full border-2 ${
                            reached
                              ? 'border-emerald-300/50 bg-gradient-to-br from-emerald-400 to-teal-500 text-emerald-950'
                              : 'border-emerald-300/15 bg-[#050e15] text-emerald-100/25'
                          } ${isCurrent ? 'shadow-[0_0_30px_-6px_rgba(94,234,212,0.9)]' : ''}`}
                        >
                          {reached && !isCurrent ? <Check className="h-5 w-5" /> : <f.icon className="h-5 w-5" />}
                        </motion.span>
                        <div className="flex-1 pt-1.5">
                          <p className={`font-display font-bold ${reached ? 'text-white' : 'text-emerald-100/30'}`}>
                            {f.label}
                            {isCurrent && (
                              <span className="ml-2 inline-block rounded-full bg-emerald-400/15 px-2.5 py-0.5 text-[10px] font-bold uppercase text-emerald-200">
                                In progress
                              </span>
                            )}
                          </p>
                          <p className={`text-sm ${reached ? 'text-emerald-100/50' : 'text-emerald-100/25'}`}>{f.desc}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Events timeline */}
            {order.tracking?.length > 1 && (
              <div className="mt-8 border-t border-emerald-300/10 pt-6">
                <h3 className="mb-4 font-mono text-[9px] font-bold uppercase tracking-[0.25em] text-emerald-200/40">
                  Activity log
                </h3>
                <div className="space-y-3">
                  {[...order.tracking].reverse().map((e, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="flex items-start gap-3 rounded-2xl border border-emerald-300/10 bg-emerald-400/[0.04] p-4"
                    >
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(94,234,212,0.9)]" />
                      <div className="flex-1">
                        <p className="text-sm font-bold text-white">{e.label}</p>
                        <p className="text-xs text-emerald-100/45">{e.detail}</p>
                      </div>
                      <span className="shrink-0 font-mono text-[10px] font-semibold text-emerald-200/30">
                        {new Date(e.at).toLocaleDateString()} · {new Date(e.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {user?.isSeller && order.buyer && (
              <p className="mt-6 rounded-2xl border border-amber-300/20 bg-amber-400/10 p-4 text-sm font-semibold text-amber-200">
                You are the seller for this order — update its status from your Sales page.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
