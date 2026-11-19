const KEY = "rb-mute";

function read(): boolean {
  try {
    const v = localStorage.getItem(KEY);
    if (v === null) return true;
    return v === "1";
  } catch {
    return true;
  }
}

let muted = read();
const listeners = new Set<(v: boolean) => void>();

export function isMuted() {
  return muted;
}

export function setMuted(next: boolean) {
  muted = next;
  try {
    localStorage.setItem(KEY, next ? "1" : "0");
  } catch {
    /* ignore */
  }
  listeners.forEach((fn) => fn(muted));
}

export function toggleMuted() {
  setMuted(!muted);
  return muted;
}

export function subscribeMute(fn: (v: boolean) => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
