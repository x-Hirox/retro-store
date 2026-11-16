const KEY = "rb-mute";

function read(): boolean {
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return false;
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
