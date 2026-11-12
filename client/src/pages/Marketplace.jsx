import { useEffect, useMemo, useState } from 'react';
import { Search, SlidersHorizontal, RotateCcw, Store, Sparkles } from 'lucide-react';
import { api } from '../api';
import ItemCard from '../components/ItemCard';
import { EmptyState, FullLoader, inputClass, primaryBtn } from '../components/Ui';
import Particles from '../components/Particles';

const CATEGORIES = ['all', 'Mobile Phones', 'Laptops & Tablets', 'Televisions', 'Batteries', 'Cables & Peripherals', 'Home Appliances', 'Audio & Wearables', 'Console & Parts'];
const CONDITIONS = ['all', 'Good', 'Refurbished', 'Fair', 'Spare Parts'];
const SORTS = [
  { value: 'newest', label: 'Newest' },
  { value: 'priceLow', label: 'Price: low → high' },
  { value: 'priceHigh', label: 'Price: high → low' },
  { value: 'name', label: 'Name A–Z' },
];

export default function Marketplace() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ q: '', category: 'all', condition: 'all', sort: 'newest' });
  const [showFilters, setShowFilters] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.q) params.set('q', filters.q);
      if (filters.category !== 'all') params.set('category', filters.category);
      if (filters.condition !== 'all') params.set('condition', filters.condition);
      if (filters.sort) params.set('sort', filters.sort);
      const { items } = await api.get(`/items?${params.toString()}`, { auth: false });
      setItems(items);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const t = setTimeout(load, filters.q ? 300 : 0);
    return () => clearTimeout(t);
  }, [filters.q, filters.category, filters.condition, filters.sort]);

  const resultLabel = useMemo(() => `${items.length} item${items.length === 1 ? '' : 's'}`, [items.length]);

  return (
    <section className="relative min-h-screen px-4 pb-24 pt-28 sm:px-6">
      <Particles count={8} />
      <div className="relative mx-auto max-w-7xl">
        <div className="mb-8 text-center">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/5 px-4 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-emerald-300">
            <Store className="h-3.5 w-3.5" /> exchange hub
          </p>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Second life <span className="text-gradient">marketplace</span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-emerald-100/50">
            Buy pre-owned electronics or sell your own e-waste. Use your RecyPoints as discounts — up to 50% off.
          </p>
        </div>

        {/* Search + filter bar */}
        <div className="sticky top-16 z-30 mb-8 py-2">
          <div className="panel rounded-3xl p-3 shadow-[0_30px_80px_-40px_rgba(34,211,238,0.6)]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-emerald-300/40" />
                <input
                  className={`${inputClass} pl-12`}
                  placeholder="Search phones, laptops, cables…"
                  value={filters.q}
                  onChange={(e) => setFilters({ ...filters, q: e.target.value })}
                />
              </div>
              <div className="flex gap-3">
                <select
                  className={`${inputClass} sm:w-52`}
                  value={filters.sort}
                  onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                >
                  {SORTS.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
                <button
                  onClick={() => setShowFilters((v) => !v)}
                  className={`inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold transition ${
                    showFilters
                      ? 'bg-emerald-400 text-emerald-950 shadow-[0_0_24px_-6px_rgba(94,234,212,0.9)]'
                      : 'border border-emerald-300/20 bg-emerald-400/5 text-emerald-100 hover:bg-emerald-400/10'
                  }`}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                </button>
              </div>
            </div>

            {showFilters && (
              <div className="mt-3 grid gap-3 border-t border-emerald-300/10 pt-3 sm:grid-cols-2 lg:grid-cols-3">
                <label className="block">
                  <span className="mb-1.5 block font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-emerald-200/40">Category</span>
                  <select
                    className={inputClass}
                    value={filters.category}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c === 'all' ? 'All categories' : c}</option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1.5 block font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-emerald-200/40">Condition</span>
                  <select
                    className={inputClass}
                    value={filters.condition}
                    onChange={(e) => setFilters({ ...filters, condition: e.target.value })}
                  >
                    {CONDITIONS.map((c) => (
                      <option key={c} value={c}>{c === 'all' ? 'Any condition' : c}</option>
                    ))}
                  </select>
                </label>
                <div className="flex items-end">
                  <button
                    onClick={() => setFilters({ q: '', category: 'all', condition: 'all', sort: 'newest' })}
                    className={`${primaryBtn} w-full`}
                  >
                    <RotateCcw className="h-4 w-4" />
                    Reset filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <p className="mb-6 flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-emerald-200/40">
          <Sparkles className="h-3.5 w-3.5 text-emerald-300/60" />
          {resultLabel} in the exchange
        </p>

        {loading ? (
          <FullLoader label="Loading the exchange hub…" />
        ) : items.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((item) => (
              <ItemCard key={item._id} item={item} />
            ))}
          </div>
        ) : (
          <EmptyState
            emoji="🔍"
            title="No items match your filters"
            subtitle="Try clearing the search or filters — or list your own e-waste for sale and earn when it sells."
          >
            <button onClick={() => setFilters({ q: '', category: 'all', condition: 'all', sort: 'newest' })} className={`${primaryBtn} mt-2`}>
              Clear filters
            </button>
          </EmptyState>
        )}
      </div>
    </section>
  );
}
