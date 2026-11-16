import { isMuted } from "./soundMute";

let ctx: AudioContext | null = null;
let last = 0;

function audio() {
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function tone(
  freq: number,
  start: number,
  dur: number,
  type: OscillatorType = "triangle",
  vol = 0.04,
) {
  const a = audio();
  const osc = a.createOscillator();
  const g = a.createGain();
  const f = a.createBiquadFilter();
  f.type = "lowpass";
  f.frequency.value = 2200;
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  g.gain.setValueAtTime(0.0001, start);
  g.gain.exponentialRampToValueAtTime(vol, start + 0.03);
  g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
  osc.connect(f);
  f.connect(g);
  g.connect(a.destination);
  osc.start(start);
  osc.stop(start + dur + 0.04);
}

function gated(ms = 380) {
  if (isMuted()) return false;
  const now = Date.now();
  if (now - last < ms) return false;
  last = now;
  return true;
}

/** Soft UI tone — not a harsh beep */
export function arcadeBeep() {
  if (!gated(160)) return;
  try {
    const t = audio().currentTime;
    tone(523.25, t, 0.09, "sine", 0.03);
  } catch {
    /* ignore */
  }
}

function noiseBurst(start: number, dur: number, vol = 0.05) {
  const a = audio();
  const n = a.createBuffer(1, Math.floor(a.sampleRate * dur), a.sampleRate);
  const data = n.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  const src = a.createBufferSource();
  src.buffer = n;
  const f = a.createBiquadFilter();
  f.type = "bandpass";
  f.frequency.setValueAtTime(2400, start);
  f.frequency.exponentialRampToValueAtTime(180, start + dur);
  const g = a.createGain();
  g.gain.setValueAtTime(vol, start);
  g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
  src.connect(f);
  f.connect(g);
  g.connect(a.destination);
  src.start(start);
  src.stop(start + dur + 0.02);
}

/** Original 90s boot-style chime (not a copyrighted console jingle) */
export function playBootChime() {
  if (!gated(500)) return;
  try {
    const t = audio().currentTime;
    tone(392.0, t, 0.28, "triangle", 0.045);
    tone(523.25, t + 0.2, 0.34, "triangle", 0.04);
    tone(659.25, t + 0.46, 0.62, "sine", 0.038);
  } catch {
    /* ignore */
  }
}

/** CRT power-on: static sweep + original synth intro */
export function playCrtBoot() {
  if (isMuted()) return;
  if (!gated(1400)) return;
  try {
    const t = audio().currentTime;
    noiseBurst(t, 0.18, 0.045);
    tone(293.66, t + 0.16, 0.32, "triangle", 0.05);
    tone(440.0, t + 0.38, 0.36, "triangle", 0.045);
    tone(587.33, t + 0.62, 0.85, "sine", 0.04);
  } catch {
    /* ignore */
  }
}

export function playNesChime() {
  if (!gated(500)) return;
  try {
    const t = audio().currentTime;
    tone(440, t, 0.14, "triangle", 0.035);
    tone(554.37, t + 0.12, 0.22, "triangle", 0.03);
  } catch {
    /* ignore */
  }
}

export function playArcadeTune() {
  if (isMuted()) return;
  try {
    const t = audio().currentTime;
    const notes = [523.25, 659.25, 783.99, 659.25, 880.0, 783.99];
    notes.forEach((freq, i) => {
      tone(freq, t + i * 0.11, 0.13, "triangle", 0.028);
    });
  } catch {
    /* ignore */
  }
}

export function playConsoleCue(label: string) {
  const k = label.toLowerCase();
  if (
    k.includes("play") ||
    k.includes("ps1") ||
    k.includes("ps2") ||
    k.includes("ps3") ||
    k.includes("ps4") ||
    k.includes("ps5") ||
    k.includes("psp") ||
    k.includes("sony")
  ) {
    playBootChime();
    return;
  }
  if (
    k.includes("ninten") ||
    k.includes("game boy") ||
    k.includes("nes") ||
    k.includes("snes")
  ) {
    playNesChime();
    return;
  }
  arcadeBeep();
}
