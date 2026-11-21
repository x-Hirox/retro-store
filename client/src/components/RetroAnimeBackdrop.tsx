import { useEffect, useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useLocation } from "react-router-dom";

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

  const home = pathname === "/" || pathname === "";

  useEffect(() => {
    if (!home) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const paint = () => {
      const mobile = window.innerWidth < 800;
      const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1 : 1.4);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const dark = document.body.classList.contains("dark");
      ctx.globalAlpha = dark ? 0.42 : 0.14;
      const sky = ctx.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0, dark ? "#12101f" : "#f3e8ff");
      sky.addColorStop(0.42, dark ? "#0b1020" : "#e0f2fe");
      sky.addColorStop(0.62, dark ? "#080814" : "#f1f5f9");
      sky.addColorStop(1, dark ? "#05060d" : "#f8f7f9");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);
      ctx.globalAlpha = 1;
    };

    paint();
    window.addEventListener("resize", paint, { passive: true });
    return () => window.removeEventListener("resize", paint);
  }, [home]);

  if (!home) return null;

  return (
    <div className="retro-anime-backdrop" aria-hidden>
      <motion.div className="rab-nebula rab-a" style={{ y: nebulaY }} />
      <motion.div className="rab-nebula rab-b" style={{ y: hazeY }} />
      <canvas ref={canvasRef} />
    </div>
  );
}
