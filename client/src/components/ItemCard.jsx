import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import { ConditionBadge } from './Ui';
import { useToast } from './Toast';
import { itemImage } from '../utils/image';

export default function ItemCard({ item, onToggleWishlist }) {
  const { user, patchUser } = useAuth();
  const { toast } = useToast();
  const cover = itemImage(item);
  const wished = !!user?.wishlist?.some((w) => (typeof w === 'string' ? w === item._id : w._id === item._id));

  async function toggleWishlist(e) {
    e.preventDefault();
    if (!user) {
      toast('Log in to save items to your wishlist', 'info');
      return;
    }
    try {
      const { wishlist } = await api.post(`/auth/wishlist/${item._id}`);
      patchUser({ wishlist });
      toast(wished ? 'Removed from wishlist' : 'Saved to wishlist', 'success');
      onToggleWishlist?.();
    } catch (err) {
      toast(err.message, 'error');
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.45 }}
      className="h-full"
    >
      <Link
        to={`/items/${item._id}`}
        className="panel panel-hover group relative flex h-full flex-col overflow-hidden rounded-3xl"
      >
        <div className="relative flex h-44 items-center justify-center overflow-hidden">
          <img
            src={cover}
            alt={item.name}
            className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020509] via-[#020509]/25 to-transparent" />
          <div className="absolute inset-0 grid-bg opacity-20" />
          <button
            onClick={toggleWishlist}
            className={`absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full border backdrop-blur-md transition active:scale-90 ${
              wished
                ? 'border-rose-400/40 bg-rose-500/90 text-white'
                : 'border-emerald-300/20 bg-[#03110c]/60 text-emerald-100/60 hover:border-rose-400/40 hover:text-rose-300'
            }`}
          >
            <Heart className={`h-4 w-4 ${wished ? 'fill-current' : ''}`} />
          </button>
          <span className="absolute left-3 top-3 rounded-full border border-emerald-300/20 bg-[#03110c]/70 px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-widest text-emerald-200/80 backdrop-blur">
            {item.category}
          </span>
        </div>

        <div className="relative flex flex-1 flex-col gap-2 p-4">
          <h3 className="line-clamp-1 font-display text-sm font-bold tracking-wide text-white">{item.name}</h3>
          <p className="line-clamp-2 flex-1 text-sm text-emerald-100/45">{item.description}</p>
          <div className="mt-1 flex items-center justify-between border-t border-emerald-300/10 pt-3">
            <ConditionBadge condition={item.condition} />
            <span className="font-display text-lg font-extrabold text-emerald-200">
              ₹{item.price.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
