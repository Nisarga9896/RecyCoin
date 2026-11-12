import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, ShoppingBag, ShieldCheck, Truck, User, Sparkles } from 'lucide-react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { Avatar, ConditionBadge, CoinBadge, FullLoader, ghostBtn, primaryBtn, Spinner } from '../components/Ui';
import Particles from '../components/Particles';
import { itemImage } from '../utils/image';

export default function ItemDetail() {
  const { id } = useParams();
  const { user, patchUser, refreshUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [discount, setDiscount] = useState(0);
  const [buying, setBuying] = useState(false);
  const [authPrompt, setAuthPrompt] = useState(false);

  useEffect(() => {
    api.get(`/items/${id}`, { auth: false })
      .then((d) => setItem(d.item))
      .catch((e) => toast(e.message, 'error'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="pt-28"><FullLoader label="Loading item…" /></div>;
  if (!item) return <div className="pt-28"><Empty /></div>;

  const maxDiscount = item ? Math.min(user?.points || 0, Math.floor(item.price * 0.5)) : 0;
  const finalPrice = item ? Math.max(0, item.price - (discount || 0)) : 0;
  const cover = itemImage(item);
  const own = user?._id === item.seller?._id;
  const wished = !!user?.wishlist?.some((w) => (typeof w === 'string' ? w === item._id : w._id === item._id));

  async function toggleWishlist() {
    if (!user) {
      toast('Log in to save items', 'info');
      navigate('/login');
      return;
    }
    try {
      const { wishlist } = await api.post(`/auth/wishlist/${item._id}`);
      patchUser({ wishlist });
      toast(wished ? 'Removed from wishlist' : 'Saved to wishlist', 'success');
    } catch (e) {
      toast(e.message, 'error');
    }
  }

  async function buy() {
    if (!user) {
      setAuthPrompt(true);
      return;
    }
    setBuying(true);
    try {
      const { order } = await api.post('/orders', { itemId: item._id, discountPoints: discount || 0 });
      await refreshUser();
      toast('Order placed! 🎉 Use your points — done.', 'success');
      navigate(`/orders/${order._id}`);
    } catch (e) {
      toast(e.message, 'error');
    } finally {
      setBuying(false);
    }
  }

  return (
    <section className="relative min-h-screen px-4 pb-24 pt-28 sm:px-6">
      <Particles count={6} />
      <div className="relative mx-auto max-w-6xl">
        <Link to="/marketplace" className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-emerald-200/60 transition hover:text-emerald-100">
          <ArrowLeft className="h-4 w-4" />
          Back to marketplace
        </Link>

        <div className="grid gap-8 lg:grid-cols-5">
          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-3"
          >
            <div className="relative grid min-h-[18rem] place-items-center overflow-hidden rounded-[2rem] border border-emerald-300/20 bg-[#050e15] p-10">
              <img
                src={cover}
                alt={item.name}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#020509] via-[#020509]/20 to-[#03110c]/40" />
              <div className="pointer-events-none absolute inset-0 scanlines opacity-20" />
              {item.status !== 'available' && (
                <span className="absolute bottom-6 rounded-full border border-rose-300/30 bg-rose-500/20 px-5 py-2 text-sm font-bold text-rose-200 backdrop-blur">
                  {item.status === 'sold' ? 'Sold' : 'Hidden'}
                </span>
              )}
              <span className="absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-full border border-emerald-300/25 bg-[#03110c]/70 px-3 py-1 font-mono text-[8px] uppercase tracking-[0.25em] text-emerald-200/70 backdrop-blur">
                <Sparkles className="h-3 w-3" /> verified listing
              </span>
            </div>

            <div className="panel mt-6 rounded-[2rem] p-7">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h1 className="font-display text-2xl font-extrabold text-white">{item.name}</h1>
                  <p className="mt-1 text-sm text-emerald-100/45">{item.category}</p>
                </div>
                <button
                  onClick={toggleWishlist}
                  className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-bold transition active:scale-95 ${
                    wished
                      ? 'bg-rose-500 text-white shadow-[0_0_24px_-6px_rgba(244,63,94,0.9)]'
                      : 'border border-rose-300/25 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20'
                  }`}
                >
                  <Heart className={`h-4 w-4 ${wished ? 'fill-current' : ''}`} />
                  {wished ? 'Saved' : 'Wishlist'}
                </button>
              </div>
              <p className="mt-4 leading-relaxed text-emerald-100/60">{item.description}</p>

              {(item.age || item.defects) && (
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {item.age && (
                    <div className="rounded-2xl border border-emerald-300/10 bg-emerald-400/5 p-4">
                      <p className="font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-emerald-200/40">Age</p>
                      <p className="mt-1 text-sm font-semibold text-emerald-100/70">{item.age}</p>
                    </div>
                  )}
                  {item.defects && (
                    <div className="rounded-2xl border border-emerald-300/10 bg-emerald-400/5 p-4">
                      <p className="font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-emerald-200/40">Defects</p>
                      <p className="mt-1 text-sm font-semibold text-emerald-100/70">{item.defects}</p>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <ConditionBadge condition={item.condition} />
                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/25 bg-amber-400/10 px-3 py-1 text-xs font-bold text-amber-200">
                  🎁 Seller earns 5% bonus when sold
                </span>
              </div>

              <div className="mt-8 flex items-center gap-4 rounded-2xl border border-emerald-300/10 bg-emerald-400/5 p-4">
                <Avatar name={item.seller?.name || 'Seller'} color={item.seller?.avatarColor} size={48} />
                <div className="flex-1">
                  <p className="font-display font-bold text-white">{item.seller?.name || 'Unknown seller'}</p>
                  <p className="text-xs text-emerald-100/40">Verified RecyCoin member · {item.seller?.email}</p>
                </div>
                <User className="h-5 w-5 text-emerald-300/40" />
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3 text-center text-xs font-semibold text-emerald-100/50">
                <div className="rounded-2xl border border-emerald-300/10 bg-emerald-400/5 p-3"><ShieldCheck className="mx-auto mb-1 h-4 w-4 text-emerald-300" /> Seller verified</div>
                <div className="rounded-2xl border border-emerald-300/10 bg-emerald-400/5 p-3"><Truck className="mx-auto mb-1 h-4 w-4 text-emerald-300" /> Tracked delivery</div>
                <div className="rounded-2xl border border-emerald-300/10 bg-emerald-400/5 p-3"><ShoppingBag className="mx-auto mb-1 h-4 w-4 text-emerald-300" /> Responsible reuse</div>
              </div>
            </div>
          </motion.div>

          {/* Buy box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="panel sticky top-24 rounded-[2rem] p-7 shadow-[0_40px_100px_-50px_rgba(34,211,238,0.8)]">
              <p className="font-mono text-[9px] font-bold uppercase tracking-[0.25em] text-emerald-200/40">Price</p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-display text-4xl font-extrabold text-white">
                  ₹{finalPrice.toLocaleString('en-IN')}
                </span>
                {discount > 0 ? (
                  <span className="text-lg font-bold text-emerald-100/30 line-through">₹{item.price.toLocaleString('en-IN')}</span>
                ) : null}
              </div>

              {user && !own && item.status === 'available' && (
                <div className="mt-6 space-y-4">
                  <div className="rounded-2xl border border-emerald-300/15 bg-emerald-400/5 p-4">
                    <label className="mb-2 flex items-center justify-between text-sm font-bold text-emerald-100">
                      <span>Use RecyPoints discount</span>
                      <CoinBadge points={user.points} className="scale-90" />
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        min={0}
                        max={maxDiscount}
                        value={discount}
                        onChange={(e) => setDiscount(Math.max(0, Math.min(maxDiscount, Number(e.target.value) || 0)))}
                        className="w-full rounded-xl border border-emerald-300/20 bg-[#03110c] px-3 py-2.5 text-sm font-bold text-emerald-100 outline-none transition focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-400/20"
                        placeholder="Points to redeem"
                      />
                      <button
                        onClick={() => setDiscount(maxDiscount)}
                        className="shrink-0 rounded-xl border border-amber-300/25 bg-amber-400/10 px-3 py-2 text-xs font-bold text-amber-200 transition hover:bg-amber-400/20"
                      >
                        Max ({maxDiscount})
                      </button>
                    </div>
                    <p className="mt-2 text-xs text-emerald-100/40">Up to 50% of the price can be covered by points.</p>
                  </div>

                  <button
                    onClick={buy}
                    disabled={buying}
                    className={`${primaryBtn} w-full py-4 text-base`}
                  >
                    {buying ? <Spinner /> : <ShoppingBag className="h-5 w-5" />}
                    {buying ? 'Placing order…' : 'Buy now'}
                  </button>
                </div>
              )}

              {!user && item.status === 'available' && (
                <div className="mt-6 space-y-3">
                  <button onClick={buy} className={`${primaryBtn} w-full py-4 text-base`}>
                    <ShoppingBag className="h-5 w-5" />
                    Buy now
                  </button>
                  <p className="text-center text-xs text-emerald-100/40">
                    Log in or sign up to place your order and use RecyPoints discounts.
                  </p>
                </div>
              )}

              {own && (
                <div className="mt-6 rounded-2xl border border-sky-300/20 bg-sky-400/10 p-5 text-center text-sm font-bold text-sky-200">
                  This is your listed item — you can’t buy your own listing.
                </div>
              )}

              {item.status !== 'available' && (
                <div className="mt-6 rounded-2xl border border-rose-300/20 bg-rose-500/10 p-5 text-center text-sm font-bold text-rose-200">
                  This item is no longer available.
                </div>
              )}

              <div className="mt-6 space-y-1.5 border-t border-emerald-300/10 pt-4 text-xs text-emerald-100/40">
                <p>✓ Free pickup within 5 km</p>
                <p>✓ Live order tracking from placed → delivered</p>
                <p>✓ Points refunded if cancelled</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {authPrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[95] grid place-items-center bg-[#020509]/80 p-4 backdrop-blur-sm"
            onClick={() => setAuthPrompt(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              className="w-full max-w-md rounded-3xl border border-emerald-300/20 bg-[#050e15] p-7 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl border border-emerald-300/20 bg-emerald-400/10 text-emerald-300">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <h2 className="font-display text-xl font-extrabold text-white">Log in to buy this item</h2>
              <p className="mt-2 text-sm text-emerald-100/55">
                Log in or create an account to place your order and use your RecyPoints for discounts.
              </p>
              <div className="mt-6 space-y-3">
                <Link to="/login" state={{ from: `/items/${item._id}` }} className={`${primaryBtn} w-full`}>
                  Log in
                </Link>
                <Link to="/register" className={`${ghostBtn} w-full`}>
                  Sign up
                </Link>
                <button onClick={() => setAuthPrompt(false)} className="w-full py-1 text-xs font-bold uppercase tracking-widest text-emerald-100/40 transition hover:text-emerald-100/70">
                  Not now
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function Empty() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <span className="text-5xl">😕</span>
      <p className="font-display text-lg font-bold text-white">Item not found</p>
      <Link to="/marketplace" className={ghostBtn}>Browse marketplace</Link>
    </div>
  );
}
