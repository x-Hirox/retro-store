let ctx: AudioContext | null = null;
let muted = localStorage.getItem("rb-match-mute") === "1";

function ac() {
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function beep(freq: number, dur: number, type: OscillatorType, gain = 0.08, slide = 0) {
  if (muted) return;
  const audio = ac();
  const osc = audio.createOscillator();
  const g = audio.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, audio.currentTime);
  if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), audio.currentTime + dur);
  g.gain.setValueAtTime(gain, audio.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + dur);
  osc.connect(g);
  g.connect(audio.destination);
  osc.start();
  osc.stop(audio.currentTime + dur + 0.02);
}

export const SoundEngine = {
  isMuted() {
    return muted;
  },
  toggle() {
    muted = !muted;
    localStorage.setItem("rb-match-mute", muted ? "1" : "0");
    if (!muted) this.swap();
    return muted;
  },
  unlock() {
    try {
      ac();
    } catch {
      /* ignore */
    }
  },
  swap() {
    beep(420, 0.07, "square", 0.05);
  },
  invalid() {
    beep(140, 0.12, "sawtooth", 0.05, -80);
  },
  match(combo: number) {
    beep(520 + combo * 80, 0.1, "square", 0.07);
    setTimeout(() => beep(680 + combo * 60, 0.08, "square", 0.05), 40);
  },
  combo(n: number) {
    beep(300 + n * 120, 0.16, "triangle", 0.08, 200);
  },
  bomb() {
    beep(90, 0.22, "sawtooth", 0.1, -40);
    setTimeout(() => beep(180, 0.12, "square", 0.06), 50);
  },
  win() {
    [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => beep(f, 0.16, "square", 0.07), i * 110));
  },
  lose() {
    [392, 330, 262].forEach((f, i) => setTimeout(() => beep(f, 0.18, "triangle", 0.07, -30), i * 140));
  },
};
