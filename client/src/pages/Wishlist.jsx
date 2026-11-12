import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import ItemCard from '../components/ItemCard';
import { EmptyState, FullLoader, primaryBtn } from '../components/Ui';
import Particles from '../components/Particles';

export default function Wishlist() {
  const { setUser } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    api
      .get('/auth/wishlist')
      .then((d) => {
        setItems(d.items);
        setUser((u) => ({ ...u, wishlist: d.items.map((i) => i._id) }));
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [version]);

  return (
    <section className="relative min-h-screen px-4 pb-24 pt-28 sm:px-6">
      <Particles count={6} />
      <div className="relative mx-auto max-w-7xl">
        <div className="mb-8 text-center">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-rose-300/25 bg-rose-500/10 px-4 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-rose-300">
            <Heart className="h-3.5 w-3.5" />
            Saved for later
          </p>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Your <span className="text-gradient">wishlist</span>
          </h1>
          <p className="mt-2 text-emerald-100/50">Items you saved stay here until they sell out.</p>
        </div>

        {loading ? (
          <FullLoader label="Loading your wishlist…" />
        ) : items.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((item) => (
              <ItemCard key={item._id} item={item} onToggleWishlist={() => setVersion((v) => v + 1)} />
            ))}
          </div>
        ) : (
          <EmptyState
            emoji="💚"
            title="Your wishlist is empty"
            subtitle="Tap the heart on any marketplace item to keep an eye on it for later."
          >
            <Link to="/marketplace" className={`${primaryBtn} mt-3`}>
              Browse marketplace
            </Link>
          </EmptyState>
        )}
      </div>
    </section>
  );
}
