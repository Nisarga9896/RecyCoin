import { createContext, useContext, useCallback, useEffect, useState } from 'react';
import { api } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('recycoin_user') || 'null');
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  const persist = useCallback((token, u) => {
    localStorage.setItem('recycoin_token', token);
    localStorage.setItem('recycoin_user', JSON.stringify(u));
    setUser(u);
  }, []);

  useEffect(() => {
    async function hydrate() {
      if (!localStorage.getItem('recycoin_token')) {
        setLoading(false);
        return;
      }
      try {
        const { user: u } = await api.get('/auth/me');
        setUser(u);
        localStorage.setItem('recycoin_user', JSON.stringify(u));
      } catch {
        localStorage.removeItem('recycoin_token');
        localStorage.removeItem('recycoin_user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    hydrate();
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await api.post('/auth/login', { email, password }, { auth: false });
    persist(data.token, data.user);
    return data.user;
  }, [persist]);

  const register = useCallback(async (name, email, password, role = 'buyer') => {
    const data = await api.post('/auth/register', { name, email, password, role }, { auth: false });
    persist(data.token, data.user);
    return data.user;
  }, [persist]);

  const logout = useCallback(() => {
    localStorage.removeItem('recycoin_token');
    localStorage.removeItem('recycoin_user');
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const { user: u } = await api.get('/auth/me');
    setUser(u);
    localStorage.setItem('recycoin_user', JSON.stringify(u));
    return u;
  }, []);

  const patchUser = useCallback((patch) => {
    setUser((prev) => {
      const next = { ...prev, ...patch };
      localStorage.setItem('recycoin_user', JSON.stringify(next));
      return next;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, refreshUser, patchUser, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}