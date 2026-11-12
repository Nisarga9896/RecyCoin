import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import AuthShell from '../components/AuthShell';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { inputClass, primaryBtn, Spinner } from '../components/Ui';

export default function Login() {
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      const user = await login(form.email, form.password);
      toast(`Welcome back, ${user.name.split(' ')[0]}!`, 'success');
      navigate(location.state?.from || (user.isSeller ? '/seller' : '/dashboard'), { replace: true });
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell emoji="🔐" title="Welcome back" subtitle="Log in to keep earning RecyPoints">
      <form onSubmit={onSubmit} className="space-y-4">
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
              placeholder="••••••••"
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

        <button disabled={busy} className={`${primaryBtn} w-full py-3.5`}>
          {busy ? <Spinner /> : <LogIn className="h-5 w-5" />}
          {busy ? 'Signing in…' : 'Log in'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-emerald-100/50">
        New to RecyCoin?{' '}
        <Link to="/register" className="font-bold text-emerald-300 hover:underline">
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
}