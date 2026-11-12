import { useMemo } from 'react';
import { motion } from 'framer-motion';

const EMOJIS = ['♻️', '🪙', '🌿', '🔋', '📱', '🔁'];
const TINTS = ['#5eead4', '#22d3ee', '#a3e635', '#fbbf24'];

export default function Particles({ count = 14, className = '' }) {
  const parts = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const orb = Math.random() < 0.55;
        return {
          id: i,
          left: Math.random() * 100,
          top: Math.random() * 100,
          size: orb ? 3 + Math.random() * 5 : 14 + Math.random() * 20,
          duration: 10 + Math.random() * 14,
          delay: Math.random() * 8,
          emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
          tint: TINTS[Math.floor(Math.random() * TINTS.length)],
          orb,
        };
      }),
    [count]
  );

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      {parts.map((p) =>
        p.orb ? (
          <motion.span
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: p.size,
              height: p.size,
              background: p.tint,
              boxShadow: `0 0 ${p.size * 3}px ${p.tint}`,
            }}
            animate={{ y: [0, -40, 0], opacity: [0.15, 0.7, 0.15] }}
            transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
            initial={{ opacity: 0 }}
          />
        ) : (
          <motion.span
            key={p.id}
            className="absolute select-none opacity-[0.12]"
            style={{ left: `${p.left}%`, top: `${p.top}%`, fontSize: p.size }}
            animate={{ y: [0, -40, 0], rotate: [0, 12, -8, 0], opacity: [0.08, 0.2, 0.08] }}
            transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
            initial={{ opacity: 0 }}
          >
            {p.emoji}
          </motion.span>
        )
      )}
    </div>
  );
}
