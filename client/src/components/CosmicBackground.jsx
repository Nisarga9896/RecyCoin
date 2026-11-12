import { useEffect, useRef } from 'react';

const STAR_COLORS = ['#eafff8', '#5eead4', '#22d3ee', '#a3e635', '#ffffff'];

export default function CosmicBackground() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    let raf = 0;
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };

    const stars = [];
    const shooters = [];

    function resize() {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    }

    function seed() {
      stars.length = 0;
      const count = Math.min(220, Math.round((w * h) / 11000));
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          z: Math.random() * 0.8 + 0.2,
          r: Math.random() * 1.5 + 0.25,
          tw: Math.random() * Math.PI * 2,
          tws: 0.008 + Math.random() * 0.03,
          color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
        });
      }
    }

    function spawnShooter() {
      shooters.push({
        x: Math.random() * w * 0.8,
        y: Math.random() * h * 0.4,
        vx: 5 + Math.random() * 4,
        vy: 2.2 + Math.random() * 2,
        life: 0,
        max: 60 + Math.random() * 30,
      });
    }

    const onMouse = (e) => {
      mouse.tx = e.clientX / w;
      mouse.ty = e.clientY / h;
    };

    function step() {
      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;
      const px = (mouse.x - 0.5) * 26;
      const py = (mouse.y - 0.5) * 26;

      ctx.clearRect(0, 0, w, h);

      for (const s of stars) {
        s.tw += s.tws;
        const alpha = 0.28 + (Math.sin(s.tw) + 1) * 0.32;
        const x = s.x + px * s.z;
        const y = s.y + py * s.z;
        ctx.globalAlpha = alpha * s.z;
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(x, y, s.r * s.z, 0, Math.PI * 2);
        ctx.fill();
      }

      for (let i = shooters.length - 1; i >= 0; i--) {
        const sh = shooters[i];
        sh.life++;
        sh.x += sh.vx;
        sh.y += sh.vy;
        const t = 1 - sh.life / sh.max;
        if (t <= 0) { shooters.splice(i, 1); continue; }
        const grad = ctx.createLinearGradient(sh.x, sh.y, sh.x - sh.vx * 12, sh.y - sh.vy * 12);
        grad.addColorStop(0, `rgba(234,255,248,${0.9 * t})`);
        grad.addColorStop(0.4, `rgba(94,234,212,${0.5 * t})`);
        grad.addColorStop(1, 'rgba(34,211,238,0)');
        ctx.globalAlpha = 1;
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(sh.x, sh.y);
        ctx.lineTo(sh.x - sh.vx * 12, sh.y - sh.vy * 12);
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(step);
    }

    let shooterTimer;
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouse);
    if (!reduce) {
      raf = requestAnimationFrame(step);
      shooterTimer = setInterval(() => {
        if (Math.random() < 0.7) spawnShooter();
      }, 4200);
    } else {
      step();
      cancelAnimationFrame(raf);
    }

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(shooterTimer);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouse);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#03060a]" aria-hidden>
      <div className="absolute inset-0 aurora opacity-90" />
      <div className="absolute -left-40 top-[-10%] h-[38rem] w-[38rem] animate-blob rounded-full bg-emerald-500/12 blur-[120px]" />
      <div className="absolute -right-40 top-[20%] h-[34rem] w-[34rem] animate-blob rounded-full bg-cyan-400/10 blur-[120px]" style={{ animationDelay: '-7s' }} />
      <div className="absolute bottom-[-15%] left-1/3 h-[32rem] w-[32rem] animate-blob rounded-full bg-lime-400/8 blur-[130px]" style={{ animationDelay: '-12s' }} />
      <canvas ref={ref} className="absolute inset-0 h-full w-full" />
      <div className="absolute inset-0 grid-bg opacity-[0.35]" />
      <div className="absolute inset-0 scanlines opacity-[0.35]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,#03060a_85%)]" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#03060a] to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#03060a] to-transparent" />
    </div>
  );
}
