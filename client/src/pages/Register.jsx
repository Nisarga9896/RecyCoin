import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ShoppingBag, Store, UserPlus } from 'lucide-react';
import AuthShell from '../components/AuthShell';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { inputClass, primaryBtn, Spinner } from '../components/Ui';

const roles = [
  { id: 'buyer', label: 'Buyer', description: 'Shop, play and earn', icon: ShoppingBag },
  { id: 'seller', label: 'Seller', description: 'List and sell devices', icon: Store },
];

export default function Register() {
  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [role, setRole] = useState('buyer');
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    if (form.password !== form.confirm) {
      toast('Passwords do not match', 'error');
      return;
    }
    setBusy(true);
    try {
      const user = await register(form.name, form.email, form.password, role);
      toast(`Welcome to RecyCoin, ${user.name.split(' ')[0]}! You got 50 free RecyPoints.`, 'coin');
      navigate(role === 'seller' ? '/seller' : '/game', { replace: true });
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell title="Join RecyCoin" subtitle="Create an account and get 50 free RecyPoints">
      <form onSubmit={onSubmit} className="space-y-4">
        <fieldset>
          <legend className="mb-1.5 block font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-emerald-200/50">
            I am signing up as
          </legend>
          <div className="grid grid-cols-2 gap-3">
            {roles.map((option) => {
              const active = role === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setRole(option.id)}
                  className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition ${
                    active
                      ? 'border-emerald-300/60 bg-emerald-400/10 text-emerald-100 shadow-[0_0_30px_-14px_rgba(94,234,212,0.9)]'
                      : 'border-emerald-300/15 bg-[#040c12]/60 text-emerald-100/50 hover:border-emerald-300/35 hover:text-emerald-100/75'
                  }`}
                >
                  <span
                    className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl border ${
                      active
                        ? 'border-emerald-300/30 bg-emerald-400/15 text-emerald-300'
                        : 'border-emerald-300/15 bg-white/[0.02] text-emerald-100/40'
                    }`}
                  >
                    <option.icon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-sm font-bold">{option.label}</span>
                    <span className="block text-[10px] leading-tight opacity-70">{option.description}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </fieldset>

        <label className="block">
          <span className="mb-1.5 block font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-emerald-200/50">Full name</span>
          <input
            required
            className={inputClass}
            placeholder="Alex Green"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-emerald-200/50">Email</span>
          <input
            type="email"
            required
            className={inputClass}
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-emerald-200/50">Password</span>
          <div className="relative">
            <input
              type={show ? 'text' : 'password'}
              required
              minLength={6}
              className={`${inputClass} pr-12`}
              placeholder="At least 6 characters"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-300/50 transition hover:text-emerald-200"
            >
              {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </label>
        <label className="block">
          <span className="mb-1.5 block font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-emerald-200/50">Confirm password</span>
          <input
            type="password"
            required
            className={inputClass}
            placeholder="Repeat your password"
            value={form.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
          />
        </label>

        <button disabled={busy} className={`${primaryBtn} w-full py-3.5`}>
          {busy ? <Spinner /> : <UserPlus className="h-5 w-5" />}
          {busy ? 'Creating account…' : `Create ${role} account`}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-emerald-100/50">
        Already have an account?{' '}
        <Link to="/login" className="font-bold text-emerald-300 hover:underline">
          Log in
        </Link>
      </p>
    </AuthShell>
  );
}
