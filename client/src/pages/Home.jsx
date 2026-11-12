import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AlertTriangle, ArrowRight, ArrowUpRight, BadgeCheck, BatteryCharging, ChevronDown,
  Coins, Cpu, Gamepad2, Globe2, HandHeart, Leaf, LogIn, Recycle, RefreshCw, ScanLine,
  ShieldCheck, Store, TrendingUp, Wrench,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AnimatedCounter, SectionHeading } from '../components/Ui';

const HERO_VIDEO = '/media/cosmos_1965030384.mp4';
const HERO_POSTER = '/media/cosmos_1672090456.webp';

const lifecycle = [
  {
    icon: ScanLine,
    code: '01',
    title: 'Collect',
    text: 'Create an account and bring unused phones, laptops, cables or appliances into the RecyCoin network.',
  },
  {
    icon: Cpu,
    code: '02',
    title: 'Sort',
    text: 'Run the sorting protocol to learn what can be reused, recycled or needs hazardous handling.',
  },
  {
    icon: Coins,
    code: '03',
    title: 'Earn',
    text: 'Every correct decision earns RecyPoints — real value you can spend across the marketplace.',
  },
  {
    icon: Store,
    code: '04',
    title: 'Trade',
    text: 'Buy and sell tested second-hand electronics, or list your own gear for a second life.',
  },
  {
    icon: RefreshCw,
    code: '05',
    title: 'Recycle',
    text: 'Route what cannot be reused to responsible recyclers and track the impact you create.',
  },
];

const eWasteStats = [
  { icon: Globe2, value: 62, suffix: 'M t', label: 'E-waste generated in 2022', tint: 'text-emerald-300' },
  { icon: Recycle, value: 22, suffix: '.3%', label: 'Formally collected & recycled', tint: 'text-cyan-300' },
  { icon: TrendingUp, value: 82, suffix: 'M t', label: 'Projected generation by 2030', tint: 'text-amber-300' },
  { icon: Coins, value: 91, suffix: 'B USD', label: 'Metals embedded in 2022 e-waste', tint: 'text-lime-300' },
];

const reduceActions = [
  {
    icon: Wrench,
    title: 'Repair before replacing',
    text: 'A battery or screen swap can extend a device life by years and keep valuable materials in use.',
  },
  {
    icon: Store,
    title: 'Sell, donate or refurbish',
    text: 'Working devices should find a second owner — not a landfill. List them on RecyCoin in minutes.',
  },
  {
    icon: BadgeCheck,
    title: 'Use certified recyclers',
    text: 'Choose formal e-waste recyclers who document collection and recover materials safely.',
  },
  {
    icon: BatteryCharging,
    title: 'Never bin batteries',
    text: 'Batteries and cables are hazardous. Keep them out of household waste and use take-back points.',
  },
  {
    icon: ShieldCheck,
    title: 'Wipe your data first',
    text: 'Factory-reset devices and remove accounts before resale, donation or recycling.',
  },
  {
    icon: HandHeart,
    title: 'Buy refurbished',
    text: 'Refurbished electronics cut demand for new mining and keep perfectly good devices alive.',
  },
];

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="relative overflow-hidden">
      {/* HERO */}
      <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-4 pb-24 pt-24 sm:px-6">
        <video
          src={HERO_VIDEO}
          poster={HERO_POSTER}
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#03060a]/85 via-[#03060a]/55 to-[#03060a]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(3,6,10,0.6)_72%)]" />
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-20" />
        <div className="pointer-events-none absolute inset-0 scanlines opacity-20" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 mx-auto max-w-4xl text-center"
        >
          <p className="inline-flex items-center gap-2 rounded-full border border-emerald-300/25 bg-emerald-400/5 px-4 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-emerald-300 backdrop-blur">
            <Leaf className="h-3.5 w-3.5" />
            Circular electronics network
          </p>

          <h1 className="mt-6 font-display text-6xl font-extrabold tracking-tight text-white sm:text-8xl lg:text-9xl">
            RECY<span className="text-gradient text-glow">COIN</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-emerald-100/60 sm:text-lg">
            The circular marketplace for electronics. Play, sort, earn and trade — every action keeps
            e-waste out of landfill and valuable materials in use.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/game" className="btn-primary group w-full px-8 py-4 text-sm sm:w-auto">
              <Gamepad2 className="h-5 w-5" />
              Play the game
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>

            {user ? (
              <Link
                to={user.isSeller ? '/seller' : '/dashboard'}
                className="btn-ghost w-full px-8 py-4 text-sm sm:w-auto"
              >
                <ArrowUpRight className="h-5 w-5" />
                Open dashboard
              </Link>
            ) : (
              <Link to="/login" className="btn-ghost w-full px-8 py-4 text-sm sm:w-auto">
                <LogIn className="h-5 w-5" />
                Sign in
              </Link>
            )}
          </div>

          {!user && (
            <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.24em] text-emerald-100/40">
              New here?{' '}
              <Link to="/register" className="font-bold text-emerald-300 transition hover:text-emerald-200">
                Create a free account
              </Link>
            </p>
          )}
        </motion.div>

        <a
          href="#lifecycle"
          className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-emerald-200/45 transition hover:text-emerald-200"
        >
          <span className="font-mono text-[9px] uppercase tracking-[0.3em]">Scroll</span>
          <ChevronDown className="h-5 w-5 animate-bounce" />
        </a>
      </section>

      {/* LIFECYCLE */}
      <section id="lifecycle" className="relative px-4 py-24 sm:px-6 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="The RecyCoin lifecycle"
            title="One loop. From unused device to new value."
            subtitle="Every account, every sort and every trade feeds a single circular system designed to keep electronics in use and out of landfill."
          />

          <div className="relative mt-16">
            <div className="pointer-events-none absolute left-[8%] right-[8%] top-[3.4rem] hidden h-px bg-gradient-to-r from-transparent via-emerald-300/40 to-transparent lg:block" />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
              {lifecycle.map((step, i) => (
                <motion.div
                  key={step.code}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="panel panel-hover group relative rounded-3xl p-6"
                >
                  <div className="flex items-center justify-between">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl border border-emerald-300/25 bg-emerald-400/10 text-emerald-300">
                      <step.icon className="h-6 w-6" />
                    </span>
                    <span className="font-mono text-[10px] font-bold tracking-[0.25em] text-emerald-300/40">
                      {step.code}
                    </span>
                  </div>
                  <h3 className="mt-5 font-display text-lg font-bold text-white">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-emerald-100/45">{step.text}</p>
                  {i < lifecycle.length - 1 && (
                    <ArrowRight className="absolute -right-3 top-1/2 hidden h-5 w-5 -translate-y-1/2 text-emerald-300/30 lg:block" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mx-auto mt-10 flex max-w-2xl items-center justify-center gap-2 rounded-full border border-emerald-300/15 bg-emerald-400/5 px-5 py-2.5 text-center font-mono text-[9px] uppercase tracking-[0.24em] text-emerald-200/55">
            <RefreshCw className="h-3.5 w-3.5 animate-spin-slow" />
            The loop repeats with every device
          </div>
        </div>
      </section>

      {/* E-WASTE REALITY */}
      <section className="relative overflow-hidden border-y border-emerald-300/10 bg-[#030a10]/70 px-4 py-24 sm:px-6">
        <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="The e-waste reality"
            title="62 million tonnes. Less than a quarter recycled."
            subtitle="Electronic waste is the fastest-growing waste stream on the planet. The numbers are huge — but every device you repair, resell or recycle changes the outcome."
          />

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {eWasteStats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="panel panel-hover rounded-3xl p-7"
              >
                <span className="grid h-12 w-12 place-items-center rounded-2xl border border-emerald-300/20 bg-emerald-400/5 text-emerald-300">
                  <stat.icon className="h-6 w-6" />
                </span>
                <p className={`mt-6 font-display text-4xl font-extrabold tracking-tight ${stat.tint}`}>
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-2 text-sm leading-snug text-emerald-100/45">{stat.label}</p>
              </motion.div>
            ))}
          </div>
          <p className="mt-6 text-center font-mono text-[9px] uppercase tracking-[0.22em] text-emerald-200/30">
            Source: The Global E-waste Monitor 2024 · UNITAR / ITU
          </p>

          <div className="mt-14 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="panel rounded-3xl p-8"
            >
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-emerald-300/60">
                Documented recycling rate
              </p>
              <p className="mt-3 font-display text-6xl font-extrabold text-emerald-200">
                22.3<span className="text-3xl text-emerald-300/60">%</span>
              </p>
              <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: '22.3%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400"
                />
              </div>
              <p className="mt-5 text-sm leading-relaxed text-emerald-100/45">
                77.7% of e-waste is not documented as formally collected and recycled. Much of it is
                landfilled, burned or handled informally.
              </p>
              <div className="mt-6 flex items-start gap-2.5 rounded-2xl border border-amber-300/20 bg-amber-400/5 px-4 py-3 text-sm leading-relaxed text-amber-100/70">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
                Generation is rising by 2.6 million tonnes every year.
              </div>
            </motion.div>

            <div>
              <h3 className="font-display text-2xl font-extrabold text-white">How to stop and reduce it</h3>
              <p className="mt-2 text-sm text-emerald-100/45">
                Small decisions, repeated by millions of people, are what close the gap.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {reduceActions.map((action, i) => (
                  <motion.div
                    key={action.title}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: (i % 2) * 0.08 }}
                    className="group flex gap-4 rounded-2xl border border-emerald-300/10 bg-[#050e15]/60 p-4 transition hover:border-emerald-300/30 hover:bg-emerald-400/[0.04]"
                  >
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-emerald-300/20 bg-emerald-400/10 text-emerald-300 transition group-hover:scale-105">
                      <action.icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm font-bold text-white">{action.title}</p>
                      <p className="mt-1 text-xs leading-relaxed text-emerald-100/40">{action.text}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
