import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Recycle, Leaf, Target, Users, ArrowRight, HeartHandshake, Orbit } from 'lucide-react';
import { SectionHeading } from '../components/Ui';
import Particles from '../components/Particles';

const values = [
  {
    icon: Recycle,
    title: 'Circular economy',
    text: 'Electronics shouldn’t die in landfills. We give e-waste a second life through responsible reuse and recycling.',
  },
  {
    icon: Leaf,
    title: 'Education first',
    text: 'Correct sorting is a skill. Our game turns it into a habit — with instant feedback for every decision.',
  },
  {
    icon: Target,
    title: 'Rewards drive action',
    text: 'Behaviour changes when it pays off. RecyPoints turn eco-friendly choices into real, tangible benefits.',
  },
  {
    icon: Users,
    title: 'Community powered',
    text: 'Buyers, sellers and recyclers on one platform — a marketplace where sustainability meets technology.',
  },
];

const facts = [
  ['62 million tonnes', 'of e-waste generated globally in 2022'],
  ['Only 22.3%', 'of global e-waste is formally collected and recycled'],
  ['$91 billion', 'in metals embedded in 2022 e-waste'],
  ['82 million tonnes', 'projected e-waste generation by 2030'],
];

export default function About() {
  return (
    <section className="relative overflow-hidden px-4 pb-24 pt-28 sm:px-6">
      <Particles count={10} />
      <div className="relative mx-auto max-w-7xl">
        {/* Hero */}
        <div className="mx-auto max-w-3xl text-center">
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/5 px-4 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-emerald-300">
            <Leaf className="h-3.5 w-3.5" /> our mission
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 }}
            className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl"
          >
            Cleaning the planet, <span className="text-gradient">one soft drop at a time</span>.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="mt-5 text-lg leading-relaxed text-emerald-100/55"
          >
            RecyCoin is a full-stack MERN platform built to close the loop between awareness and action. We make
            e-waste sorting fun, reward eco-friendly behaviour, and connect people who want to trade responsibly.
          </motion.p>
        </div>

        {/* Facts */}
        <div className="mt-14 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {facts.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="panel rounded-3xl p-6 text-center"
            >
              <p className="font-display text-2xl font-extrabold text-emerald-300">{f[0]}</p>
              <p className="mt-1 text-sm text-emerald-100/45">{f[1]}</p>
            </motion.div>
          ))}
        </div>

        {/* Values */}
        <div className="mt-20">
          <SectionHeading
            eyebrow="What we stand for"
            title="Built on values that recycle"
            subtitle="Every feature exists to make responsible e-waste handling simpler, smarter and more rewarding."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="panel panel-hover flex gap-5 rounded-3xl p-7"
              >
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-emerald-300/20 bg-emerald-400/10 text-emerald-300">
                  <v.icon className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="font-display text-lg font-bold text-white">{v.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-emerald-100/45">{v.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Tech + CTA */}
        <div className="relative mt-20 grid items-center gap-10 overflow-hidden rounded-[2.5rem] border border-emerald-300/20 bg-[#04121a] p-10 text-white sm:p-14 lg:grid-cols-2">
          <img src="/media/cosmos_1713448504.webp" alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-15" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#03110c]/85 to-[#020509]/60" />
          <div className="relative">
            <h2 className="font-display text-2xl font-extrabold sm:text-3xl">The tech behind the green</h2>
            <p className="mt-4 leading-relaxed text-emerald-100/60">
              RecyCoin is engineered with the modern MERN stack — MongoDB for scalable data, Express and Node.js
              for a clean REST API, and React for a fast, responsive single-page experience. Secure JWT
              authentication, live order tracking and real-time scoring keep every user in control.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {['MongoDB', 'Express', 'React', 'Node.js', 'JWT', 'REST API'].map((t) => (
                <span key={t} className="rounded-full border border-emerald-300/20 bg-emerald-400/10 px-4 py-1.5 text-sm font-bold text-emerald-200">
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div className="relative flex flex-col items-center gap-4 rounded-3xl border border-emerald-300/20 bg-[#03110c]/60 p-8 text-center backdrop-blur">
            <HeartHandshake className="h-10 w-10 text-emerald-300" />
            <p className="font-display text-xl font-extrabold">Join the movement</p>
            <p className="text-sm text-emerald-100/60">Start with 50 free RecyPoints, learn to sort, and make your electronics circular.</p>
            <Link to="/register" className="btn-primary px-7 py-3.5 text-sm">
              <Orbit className="h-4 w-4" />
              Get started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
