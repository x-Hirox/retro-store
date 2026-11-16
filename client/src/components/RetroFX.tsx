import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { arcadeBeep } from "../utils/arcadeBeep";

type Spark = { x: number; y: number; life: number; max: number };

export default function RetroFX() {
  const { pathname } = useLocation();
  const admin = pathname.startsWith("/admin");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (admin) return;
    const onClick = (e: Event) => {
      const t = e.target as HTMLElement | null;
      if (t?.closest?.(".neon-btn, .product-card, .arcade-tab, .sell-btn, .sell-brand-bar")) {
        arcadeBeep();
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [admin]);

  useEffect(() => {
    if (admin) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let mx = -100;
    let my = -100;
    let overField = false;
    let visible = false;
    let raf = 0;
    const sparks: Spark[] = [];
    let lastSpawn = 0;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const isField = (t: EventTarget | null) => {
      const el = t as HTMLElement | null;
      if (!el?.closest) return false;
      return !!el.closest("input, textarea, select, [contenteditable='true']");
    };

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      overField = isField(e.target);
      if (overField) {
        visible = false;
        document.documentElement.classList.remove("fx-cursor");
      } else {
        visible = true;
        document.documentElement.classList.add("fx-cursor");
      }
      const now = performance.now();
      if (!overField && now - lastSpawn > 32 && sparks.length < 16) {
        lastSpawn = now;
        sparks.push({ x: mx, y: my, life: 1, max: 1 });
      }
    };

    const onLeave = () => {
      visible = false;
      overField = true;
      document.documentElement.classList.remove("fx-cursor");
      ctx.clearRect(0, 0, w, h);
    };

    const draw = () => {
      raf = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, w, h);
      if (!visible || overField) return;

      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.life -= 0.045;
        if (s.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }
        const a = s.life;
        ctx.fillStyle = `rgba(0, 243, 255, ${a})`;
        ctx.shadowColor = "#ffe600";
        ctx.shadowBlur = 6;
        ctx.fillRect(s.x - 1.5, s.y - 1.5, 3, 3);
      }

      ctx.shadowBlur = 8;
      ctx.shadowColor = "#00f3ff";
      ctx.strokeStyle = "#00f3ff";
      ctx.lineWidth = 1.25;
      ctx.beginPath();
      ctx.moveTo(mx - 10, my);
      ctx.lineTo(mx + 10, my);
      ctx.moveTo(mx, my - 10);
      ctx.lineTo(mx, my + 10);
      ctx.stroke();
      ctx.strokeRect(mx - 5, my - 5, 10, 10);
    };

    resize();
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.documentElement.classList.remove("fx-cursor");
    };
  }, [admin]);

  if (admin) return null;

  return (
    <>
      <div className="fx-glow" aria-hidden />
      <div className="fx-scan" aria-hidden />
      <canvas ref={canvasRef} className="fx-cursor-layer" aria-hidden />
    </>
  );
}
