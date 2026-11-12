let ctx = null;

function audio() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function tone(freq, start, dur, type = 'sine', vol = 0.16, dest = null) {
  const ac = audio();
  if (!ac) return;
  const o = ac.createOscillator();
  const g = ac.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, ac.currentTime + start);
  g.gain.setValueAtTime(0, ac.currentTime + start);
  g.gain.linearRampToValueAtTime(vol, ac.currentTime + start + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + start + dur);
  o.connect(g);
  g.connect(dest || ac.destination);
  o.start(ac.currentTime + start);
  o.stop(ac.currentTime + start + dur + 0.05);
}

export function playCorrect() {
  tone(523.25, 0, 0.18, 'triangle');
  tone(783.99, 0.09, 0.22, 'triangle');
}

export function playWrong() {
  tone(196, 0, 0.28, 'sawtooth', 0.1);
  tone(110, 0.02, 0.32, 'square', 0.08);
}

export function playTick() {
  tone(880, 0, 0.06, 'square', 0.05);
}

export function playWin() {
  [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, i * 0.11, 0.3, 'triangle', 0.14));
  tone(1567.98, 0.45, 0.5, 'triangle', 0.12);
}

export function playCoin() {
  tone(987.77, 0, 0.08, 'sine', 0.14);
  tone(1318.51, 0.07, 0.18, 'sine', 0.14);
}