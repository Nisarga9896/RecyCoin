import { motion } from 'framer-motion';
import Particles from './Particles';
import { Orbit } from 'lucide-react';

export default function AuthShell({ children, emoji = '♻️', title, subtitle }) {
  return (
    <section className="relative flex min-h-[calc(100vh-64px)] items-center justify-center overflow-hidden px-4 py-28">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" />
      <Particles count={10} />
      <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-emerald-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 26, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md"
      >
        <div className="holo-ring relative rounded-[2rem] border border-emerald-300/15 bg-[#050e15]/80 p-8 shadow-[0_40px_120px_-50px_rgba(34,211,238,0.8)] backdrop-blur-2xl">
          <div className="mb-7 text-center">
            <motion.span
              className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-emerald-300/30 bg-gradient-to-br from-emerald-400/20 to-cyan-400/10 text-3xl shadow-[0_0_40px_-12px_rgba(94,234,212,0.9)]"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              {emoji}
            </motion.span>
            <p className="mt-4 inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.3em] text-emerald-300/60">
              <Orbit className="h-3 w-3" /> secure channel
            </p>
            <h1 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-white">{title}</h1>
            {subtitle && <p className="mt-1.5 text-sm text-emerald-100/50">{subtitle}</p>}
          </div>
          {children}
        </div>
      </motion.div>
    </section>
  );
}
