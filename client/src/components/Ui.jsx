import { useEffect, useRef, useState } from 'react';
import { motion, useInView, animate } from 'framer-motion';

export function AnimatedCounter({ value, suffix = '', className = '', duration = 1.4 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value, duration]);

  return (
    <span ref={ref} className={className}>
      {display.toLocaleString()}{suffix}
    </span>
  );
}

export function CoinBadge({ points, className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-amber-300/30 bg-amber-400/10 px-3 py-1 text-sm font-bold text-amber-200 shadow-[0_0_24px_-10px_rgba(251,191,36,0.8)] ${className}`}
    >
      <span className="text-base leading-none">🪙</span>
      {typeof points === 'number' ? points.toLocaleString() : points}
      <span className="font-mono text-[10px] uppercase tracking-widest opacity-70">RecyPts</span>
    </span>
  );
}

export function Avatar({ name, color = '#10b981', size = 44, className = '' }) {
  const initials = (name || '?')
    .split(' ')
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
  return (
    <span
      className={`relative inline-flex items-center justify-center rounded-full font-display font-bold text-[#03110c] ${className}`}
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${color}, #22d3ee)`,
        fontSize: size * 0.34,
        boxShadow: `0 0 0 1px rgba(94,234,212,0.4), 0 0 26px -8px ${color}`,
      }}
    >
      {initials}
    </span>
  );
}

export function ConditionBadge({ condition }) {
  const map = {
    'Spare Parts': 'border-zinc-400/30 bg-zinc-400/10 text-zinc-300',
    Fair: 'border-sky-400/30 bg-sky-400/10 text-sky-300',
    Good: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300',
    Refurbished: 'border-violet-400/30 bg-violet-400/10 text-violet-300',
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
        map[condition] || map.Good
      }`}
    >
      {condition}
    </span>
  );
}

export function ItemThumb({ image, emoji = '📦', size = 56, radius = 'rounded-2xl', className = '' }) {
  const style = { width: size, height: size };
  if (image) {
    return (
      <img
        src={image}
        alt=""
        style={style}
        className={`shrink-0 border border-emerald-300/10 bg-emerald-400/10 object-cover ${radius} ${className}`}
      />
    );
  }
  const text = size >= 56 ? 'text-3xl' : size >= 44 ? 'text-2xl' : 'text-xl';
  return (
    <span
      style={style}
      className={`grid shrink-0 place-items-center border border-emerald-300/10 bg-emerald-400/10 ${radius} ${text} ${className}`}
    >
      {emoji}
    </span>
  );
}

export function Spinner({ className = '' }) {
  return (
    <span
      className={`inline-block h-6 w-6 animate-spin rounded-full border-[3px] border-emerald-400/20 border-t-emerald-300 ${className}`}
    />
  );
}

export function FullLoader({ label = 'Loading…' }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-emerald-100">
      <div className="relative grid place-items-center">
        <Spinner className="h-11 w-11" />
        <span className="absolute h-16 w-16 animate-pulse-glow rounded-full bg-emerald-400/10 blur-xl" />
      </div>
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-emerald-200/50">{label}</p>
    </div>
  );
}

export function SectionHeading({ eyebrow, title, subtitle, dark = true }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      {eyebrow && (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/5 px-4 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-emerald-300"
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300" />
          {eyebrow}
        </motion.p>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.05 }}
        className={`font-display text-3xl font-extrabold tracking-tight sm:text-4xl ${
          dark ? 'text-white' : 'text-[#03110c]'
        }`}
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className={`mx-auto mt-4 max-w-xl text-base leading-relaxed ${
            dark ? 'text-emerald-100/55' : 'text-emerald-900/60'
          }`}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}

export function EmptyState({ emoji, title, subtitle, children }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-emerald-300/20 bg-emerald-400/[0.03] px-8 py-16 text-center">
      <span className="animate-float text-5xl drop-shadow-[0_0_20px_rgba(94,234,212,0.4)]">{emoji}</span>
      <h3 className="font-display text-lg font-bold text-white">{title}</h3>
      {subtitle && <p className="max-w-sm text-sm text-emerald-100/50">{subtitle}</p>}
      {children}
    </div>
  );
}

export function Field({ label, children, hint }) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-200/60">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-emerald-200/40">{hint}</span>}
    </label>
  );
}

export const inputClass = 'input-cosmic';

export const primaryBtn =
  'btn-primary px-6 py-3 text-sm disabled:cursor-not-allowed';

export const ghostBtn =
  'btn-ghost px-6 py-3 text-sm';
