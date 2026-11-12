import { Link } from 'react-router-dom';
import {
  ArrowUpRight, Github, Instagram, Linkedin, Mail, MapPin, Orbit, Phone, Twitter, Youtube,
} from 'lucide-react';

const contacts = [
  { icon: Mail, label: 'Email', value: 'hello@recycoin.com', href: 'mailto:hello@recycoin.com' },
  { icon: Phone, label: 'Phone', value: '+91 98765 43210', href: 'tel:+919876543210' },
  { icon: MapPin, label: 'Location', value: 'Bengaluru, India', href: null },
];

const socials = [
  { icon: Instagram, label: 'Instagram' },
  { icon: Twitter, label: 'X / Twitter' },
  { icon: Linkedin, label: 'LinkedIn' },
  { icon: Youtube, label: 'YouTube' },
  { icon: Github, label: 'GitHub' },
];

const quickLinks = [
  ['/game', 'Play the game'],
  ['/marketplace', 'Marketplace'],
  ['/about', 'Our mission'],
  ['/register', 'Create account'],
];

export default function Footer() {
  return (
    <footer id="contact" className="relative overflow-hidden border-t border-emerald-300/10 bg-[#020509]/85 backdrop-blur-xl">
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/40 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.25fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl border border-emerald-300/30 bg-gradient-to-br from-emerald-400/20 to-cyan-400/10">
                <Orbit className="h-5 w-5 text-emerald-300" />
              </span>
              <span className="font-display text-xl font-extrabold tracking-[0.12em] text-white">
                RECY<span className="text-gradient">COIN</span>
              </span>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-emerald-100/50">
              The circular marketplace for electronics. Play the sorting protocol, earn RecyPoints,
              and route old devices back into the economy.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-300/15 bg-emerald-400/5 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.25em] text-emerald-300/70">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300" />
              All systems operational
            </div>
          </div>

          <div>
            <h4 className="mb-5 font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-emerald-300/70">
              Contact us
            </h4>
            <ul className="space-y-4">
              {contacts.map((contact) => {
                const content = (
                  <>
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-emerald-300/15 bg-white/[0.02] text-emerald-300/70">
                      <contact.icon className="h-4 w-4" />
                    </span>
                    <span>
                      <span className="block font-mono text-[9px] uppercase tracking-[0.2em] text-emerald-100/30">
                        {contact.label}
                      </span>
                      <span className="mt-0.5 block text-sm font-semibold text-emerald-100/75 transition group-hover:text-emerald-200">
                        {contact.value}
                      </span>
                    </span>
                  </>
                );
                return (
                  <li key={contact.label}>
                    {contact.href ? (
                      <a href={contact.href} className="group flex items-center gap-3">
                        {content}
                      </a>
                    ) : (
                      <div className="group flex items-center gap-3">{content}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h4 className="mb-5 font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-emerald-300/70">
              Follow the loop
            </h4>
            <p className="text-sm leading-relaxed text-emerald-100/45">
              Recycling drives, product drops and community updates.
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              {socials.map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  title={label}
                  className="grid h-10 w-10 place-items-center rounded-xl border border-emerald-300/15 bg-white/[0.02] text-emerald-100/60 transition hover:border-emerald-300/40 hover:bg-emerald-400/10 hover:text-emerald-200"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>

            <h4 className="mb-4 mt-8 font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-emerald-300/70">
              Explore
            </h4>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm text-emerald-100/50">
              {quickLinks.map(([to, label]) => (
                <li key={to}>
                  <Link className="group inline-flex items-center gap-1 transition hover:text-emerald-200" to={to}>
                    {label}
                    <ArrowUpRight className="h-3 w-3 opacity-0 transition group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
