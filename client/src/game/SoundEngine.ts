let ctx: AudioContext | null = null;
let muted = localStorage.getItem("rb-match-mute") === "1";

function ac() {
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function envGain(audio: AudioContext, start: number, peak: number, dur: number) {
  const g = audio.createGain();
  g.gain.setValueAtTime(0.0001, start);
  g.gain.exponentialRampToValueAtTime(peak, start + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
  return g;
}

function tone(
  freq: number,
  dur: number,
  type: OscillatorType,
  peak = 0.07,
  slide = 0,
  delay = 0,
) {
  if (muted) return;
  const audio = ac();
  const t = audio.currentTime + delay;
  const osc = audio.createOscillator();
  const filter = audio.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(Math.min(4200, freq * 4), t);
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), t + dur);
  const g = envGain(audio, t, peak, dur);
  osc.connect(filter);
  filter.connect(g);
  g.connect(audio.destination);
  osc.start(t);
  osc.stop(t + dur + 0.04);
}

function noiseBurst(dur: number, peak = 0.05, hp = 400) {
  if (muted) return;
  const audio = ac();
  const t = audio.currentTime;
  const len = Math.floor(audio.sampleRate * dur);
  const buffer = audio.createBuffer(1, len, audio.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  const src = audio.createBufferSource();
  src.buffer = buffer;
  const hpFilter = audio.createBiquadFilter();
  hpFilter.type = "highpass";
  hpFilter.frequency.value = hp;
  const g = envGain(audio, t, peak, dur);
  src.connect(hpFilter);
  hpFilter.connect(g);
  g.connect(audio.destination);
  src.start(t);
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
    tone(880, 0.07, "triangle", 0.05, -120);
    tone(1320, 0.06, "sine", 0.03, 0, 0.03);
  },
  invalid() {
    tone(180, 0.16, "sawtooth", 0.05, -70);
    noiseBurst(0.08, 0.03, 200);
  },
  match(combo: number) {
    const base = 520 + combo * 70;
    tone(base, 0.11, "triangle", 0.07, 180);
    tone(base * 1.5, 0.09, "sine", 0.04, 0, 0.04);
    noiseBurst(0.07, 0.035 + combo * 0.008, 900);
  },
  combo(n: number) {
    tone(320 + n * 90, 0.18, "square", 0.05, 260);
    tone(640 + n * 90, 0.14, "triangle", 0.04, 200, 0.05);
    noiseBurst(0.12, 0.06, 300);
  },
  bomb() {
    noiseBurst(0.22, 0.09, 120);
    tone(90, 0.28, "sawtooth", 0.08, -30);
    tone(220, 0.16, "triangle", 0.05, 80, 0.04);
  },
  win() {
    [523, 659, 784, 1046, 1318].forEach((f, i) => {
      tone(f, 0.18, "triangle", 0.06, 40, i * 0.09);
      tone(f * 2, 0.1, "sine", 0.025, 0, i * 0.09 + 0.03);
    });
  },
  lose() {
    [392, 311, 247].forEach((f, i) => tone(f, 0.22, "triangle", 0.06, -50, i * 0.12));
  },
};
