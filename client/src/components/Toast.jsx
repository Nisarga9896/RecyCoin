import { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const push = useCallback((message, type = 'info', duration = 3400) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), duration);
  }, []);

  const styles = {
    success: 'border-emerald-300/40 bg-[#04140f]/95 text-emerald-100 shadow-[0_20px_60px_-20px_rgba(16,185,129,0.8)]',
    error: 'border-rose-400/40 bg-[#180709]/95 text-rose-100 shadow-[0_20px_60px_-20px_rgba(244,63,94,0.8)]',
    info: 'border-cyan-300/30 bg-[#04121a]/95 text-cyan-50 shadow-[0_20px_60px_-20px_rgba(34,211,238,0.7)]',
    coin: 'border-amber-300/40 bg-[#1a1204]/95 text-amber-100 shadow-[0_20px_60px_-20px_rgba(251,191,36,0.8)]',
  };

  return (
    <ToastContext.Provider value={{ toast: push }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-5 z-[100] flex flex-col items-center gap-2 px-4">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: -24, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.95 }}
              className={`pointer-events-auto rounded-2xl border px-5 py-3 font-mono text-xs font-semibold tracking-wide backdrop-blur-xl ${styles[t.type]}`}
            >
              {t.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
