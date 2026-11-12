import { useEffect, useRef } from 'react';

const EMOJIS = ['📱', '💻', '🪫', '🧲', '🔌', '💿', '⌨️', '🖱️', '🔋', '🎮', '📷', '📺'];
const COIN = '🪙';

export default function HeroCanvas({ density = 26 }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const parts = [];
    function spawn(reuse = null) {
      const base = reuse;
      return {
        emoji: Math.random() < 0.22 ? COIN : EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
        x: base?.x ?? Math.random() * w,
        y: base?.y ?? h + (Math.random() * 80 + 20),
        r: base?.r ?? (14 + Math.random() * 26) * (w / 1100),
        sy: base?.sy ?? (0.18 + Math.random() * 0.5),
        sx: base?.sx ?? (Math.random() - 0.5) * 0.35,
        rot: base?.rot ?? (Math.random() - 0.5) * 0.6,
        vr: base?.vr ?? (Math.random() - 0.5) * 0.02,
        sway: base?.sway ?? (0.5 + Math.random() * 1.4),
        phase: base?.phase ?? Math.random() * Math.PI * 2,
        alpha: base?.alpha ?? (0.5 + Math.random() * 0.5),
      };
    }

    function resize() {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function seed() {
      parts.length = 0;
      for (let i = 0; i < density; i++) {
        const p = spawn();
        p.y = Math.random() * h;
        parts.push(p);
      }
    }

    const onMouse = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.tx = (e.clientX - rect.left) / rect.width;
      mouse.ty = (e.clientY - rect.top) / rect.height;
    };

    const onScroll = () => {
      mouse.tx += (Math.random() - 0.5) * 0.05;
      mouse.ty += (Math.random() - 0.5) * 0.05;
    };

    function step() {
      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;
      const mx = (mouse.x - 0.5) * 2;
      const my = (mouse.y - 0.5) * 2;

      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        p.phase += 0.016;
        p.x += p.sx + mx * 0.25;
        p.y -= p.sy;
        p.rot += p.vr;

        const delicate = 1 + Math.sin(p.phase) * p.sway * 0.06;

        if (p.y < -60) Object.assign(p, spawn(p));
        if (p.x < -60) p.x = w + 30;
        if (p.x > w + 60) p.x = -30;

        ctx.save();
        ctx.translate(p.x + Math.sin(p.phase * 0.8) * p.sway, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = p.alpha * delicate;
        ctx.shadowBlur = p.emoji === COIN ? 24 : 14;
        ctx.shadowColor = p.emoji === COIN ? 'rgba(251, 191, 36, 0.55)' : 'rgba(94, 234, 212, 0.35)';
        ctx.font = `${p.r.toFixed(1)}px "Segoe UI Emoji", "Apple Color Emoji", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.emoji, 0, 0);
        if (p.emoji === COIN) {
          ctx.globalAlpha = p.alpha * 0.5 * delicate;
          ctx.beginPath();
          ctx.arc(0, 0, p.r * 0.62, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(251, 191, 36, 0.16)';
          ctx.fill();
        }
        ctx.restore();
      }
      raf = requestAnimationFrame(step);
    }

    resize();
    seed();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouse);
    window.addEventListener('scroll', onScroll, { passive: true });
    raf = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('scroll', onScroll);
    };
  }, [density]);

  return <canvas ref={ref} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden />;
}