import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Gamepad2, Store, LayoutDashboard, LogOut, Coins, Heart, Package, Orbit } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Avatar } from './Ui';

const links = [
  { to: '/', label: 'Home' },
  { to: '/game', label: 'Game' },
  { to: '/marketplace', label: 'Marketplace' },
  { to: '/about', label: 'About' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setMenu(false);
  }, [location.pathname]);

  const dashboardTo = user?.isSeller ? '/seller' : '/dashboard';

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass shadow-[0_20px_60px_-30px_rgba(34,211,238,0.55)]' : 'bg-transparent'
      }`}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/60 to-transparent" />
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="group flex items-center gap-3">
          <span className="relative grid h-11 w-11 place-items-center rounded-2xl border border-emerald-300/30 bg-gradient-to-br from-emerald-400/20 to-cyan-400/10 text-xl shadow-[0_0_30px_-10px_rgba(94,234,212,0.9)] transition group-hover:shadow-[0_0_40px_-8px_rgba(94,234,212,1)]">
            <span className="absolute inset-0 rounded-2xl bg-emerald-400/10 blur-md" />
            <Orbit className="relative h-5 w-5 text-emerald-300" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-lg font-extrabold tracking-[0.12em] text-white">
              RECY<span className="text-gradient">COIN</span>
            </span>
            <span className="mt-1 font-mono text-[8px] uppercase tracking-[0.35em] text-emerald-300/50">
              circular marketplace
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `group relative rounded-xl px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.18em] transition ${
                  isActive ? 'text-emerald-200' : 'text-emerald-100/45 hover:text-emerald-100'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {l.label}
                  <span
                    className={`absolute inset-x-3 -bottom-0.5 h-px bg-gradient-to-r from-transparent via-emerald-300 to-transparent transition-opacity ${
                      isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-1.5 rounded-xl border border-amber-300/25 bg-amber-400/10 px-3 py-2 text-sm font-bold text-amber-200 shadow-[0_0_24px_-12px_rgba(251,191,36,0.9)] transition hover:bg-amber-400/15"
                title="Your RecyPoints"
              >
                <Coins className="h-4 w-4" />
                {user.points.toLocaleString()}
              </Link>
              <div className="relative">
                <button
                  onClick={() => setMenu((v) => !v)}
                  className="flex items-center gap-2 rounded-2xl border border-emerald-300/10 p-1 pr-3 transition hover:border-emerald-300/30 hover:bg-emerald-400/5"
                >
                  <Avatar name={user.name} color={user.avatarColor} size={38} />
                  <span className="hidden max-w-[120px] truncate text-left text-sm font-bold text-emerald-50 xl:block">
                    {user.name.split(' ')[0]}
                  </span>
                </button>
                <AnimatePresence>
                  {menu && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setMenu(false)} />
                      <motion.div
                        initial={{ opacity: 0, scale: 0.94, y: -6 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -4 }}
                        className="absolute right-0 z-20 mt-3 w-60 overflow-hidden rounded-2xl border border-emerald-300/20 bg-[#050e15]/95 p-1.5 shadow-[0_30px_80px_-30px_rgba(34,211,238,0.7)] backdrop-blur-2xl"
                      >
                        <div className="mb-1 border-b border-emerald-300/10 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.25em] text-emerald-300/50">
                          {user.email}
                        </div>
                        <MenuLink to="/dashboard" icon={<LayoutDashboard className="h-4 w-4" />}>Dashboard</MenuLink>
                        <MenuLink to={dashboardTo} icon={<Coins className="h-4 w-4" />}>
                          {user.isSeller ? 'Seller Portal' : 'Become a seller'}
                        </MenuLink>
                        <MenuLink to="/orders" icon={<Package className="h-4 w-4" />}>My Orders</MenuLink>
                        <MenuLink to="/wishlist" icon={<Heart className="h-4 w-4" />}>Wishlist</MenuLink>
                        <MenuLink to="/marketplace" icon={<Store className="h-4 w-4" />}>Marketplace</MenuLink>
                        <MenuLink to="/game" icon={<Gamepad2 className="h-4 w-4" />}>Play Game</MenuLink>
                        <button
                          onClick={() => {
                            setMenu(false);
                            logout();
                            navigate('/');
                          }}
                          className="mt-1 flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-rose-300 transition hover:bg-rose-500/10"
                        >
                          <LogOut className="h-4 w-4" />
                          Log out
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="rounded-xl px-4 py-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-100/60 transition hover:text-emerald-100">
                Log in
              </Link>
              <Link
                to="/register"
                className="btn-primary px-5 py-2.5 text-sm"
              >
                Join free
              </Link>
            </>
          )}
        </div>

        <button
          className="rounded-xl border border-emerald-300/15 p-2 text-emerald-100 lg:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-emerald-300/10 bg-[#050e15]/95 backdrop-blur-2xl lg:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-4">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  className={({ isActive }) =>
                    `rounded-xl px-4 py-3 font-mono text-xs font-bold uppercase tracking-[0.18em] ${
                      isActive ? 'bg-emerald-400/10 text-emerald-200' : 'text-emerald-100/60'
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
              <div className="mt-2 border-t border-emerald-300/10 pt-3">
                {user ? (
                  <div className="grid grid-cols-2 gap-2">
                    <Link to="/dashboard" className="rounded-xl bg-emerald-400/10 px-4 py-3 text-center text-sm font-bold text-emerald-200">
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        navigate('/');
                      }}
                      className="rounded-xl bg-rose-500/10 px-4 py-3 text-center text-sm font-bold text-rose-300"
                    >
                      Log out
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link to="/login" className="rounded-xl border border-emerald-300/15 px-4 py-3 text-center text-sm font-bold text-emerald-100">
                      Log in
                    </Link>
                    <Link to="/register" className="btn-primary px-4 py-3 text-sm">
                      Join free
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function MenuLink({ to, icon, children }) {
  return (
    <Link to={to} className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-emerald-100/75 transition hover:bg-emerald-400/10 hover:text-emerald-100">
      {icon}
      {children}
    </Link>
  );
}
