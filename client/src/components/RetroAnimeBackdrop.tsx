import { useEffect, useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useLocation } from "react-router-dom";

function reducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function isCoarse() {
  return window.matchMedia("(pointer: coarse)").matches;
}

export default function RetroAnimeBackdrop() {
  const { pathname } = useLocation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { scrollY } = useScroll();
  const nebulaY = useSpring(useTransform(scrollY, [0, 1200], [0, 48]), {
    stiffness: 80,
    damping: 28,
  });
  const hazeY = useSpring(useTransform(scrollY, [0, 1200], [0, -36]), {
    stiffness: 70,
    damping: 30,
  });

  const hidden =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/category");

  useEffect(() => {
    if (hidden) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const coarse = isCoarse();
    const reduce = reducedMotion();
    const mobile = window.innerWidth < 800;
    const count = reduce ? 0 : mobile || coarse ? 16 : 36;
    const particles = Array.from({ length: count }, () => ({
      x: Math.random(),
      y: Math.random(),
      z: 0.35 + Math.random() * 0.65,
      s: 0.6 + Math.random() * 1.4,
      hue: Math.random() > 0.5 ? 0 : 1,
    }));

    let mx = 0.5;
    let my = 0.5;
    let tx = 0.5;
    let ty = 0.5;
    let raf = 0;
    let running = true;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1 : 1.4);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onMove = (e: PointerEvent) => {
      if (coarse || reduce) return;
      tx = e.clientX / window.innerWidth;
      ty = e.clientY / window.innerHeight;
    };

    const draw = (t: number) => {
      if (!running) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const dark = document.body.classList.contains("dark");
      mx += (tx - mx) * 0.045;
      my += (ty - my) * 0.045;
      const sy = window.scrollY || 0;
      ctx.clearRect(0, 0, w, h);

      ctx.globalAlpha = dark ? 0.42 : 0.14;
      const sky = ctx.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0, dark ? "#12101f" : "#f3e8ff");
      sky.addColorStop(0.42, dark ? "#0b1020" : "#e0f2fe");
      sky.addColorStop(0.62, dark ? "#080814" : "#f1f5f9");
      sky.addColorStop(1, dark ? "#05060d" : "#f8f7f9");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);

      const tick = t * 0.00012;
      ctx.globalAlpha = dark ? 0.7 : 0.35;
      for (const p of particles) {
        const px = ((p.x + (mx - 0.5) * 0.04 * p.z) % 1) * w;
        const py =
          ((p.y + tick * p.z + sy * 0.00008 * p.z) % 1) * h;
        ctx.fillStyle = p.hue ? "#00f3ff" : "#ff4ecd";
        const size = p.s * (dark ? 1.6 : 1.2);
        ctx.fillRect(px, py, size, size);
      }

      ctx.globalAlpha = 1;
      if (!reduce) raf = requestAnimationFrame(draw);
    };

    resize();
    if (reduce) draw(0);
    else raf = requestAnimationFrame(draw);

    const onVis = () => {
      running = !document.hidden;
      if (running && !reduce) raf = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("visibilitychange", onVis);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [hidden]);

  if (hidden) return null;

  return (
    <div className="retro-anime-backdrop" aria-hidden>
      <motion.div className="rab-nebula rab-a" style={{ y: nebulaY }} />
      <motion.div className="rab-nebula rab-b" style={{ y: hazeY }} />
      <canvas ref={canvasRef} />
    </div>
  );
}
