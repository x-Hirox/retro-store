import {
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

type Props = {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  style?: CSSProperties;
};

const SPRING = { stiffness: 320, damping: 24, mass: 0.45 };

function canTilt() {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(pointer: coarse)").matches) return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    return false;
  return true;
}

export default function HoloCard({
  children,
  className = "",
  disabled,
  onClick,
  style,
}: Props) {
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rotateX = useSpring(rx, SPRING);
  const rotateY = useSpring(ry, SPRING);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    if (disabled || !canTilt()) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    rx.set((0.5 - y) * 7);
    ry.set((x - 0.5) * 9);
    e.currentTarget.style.setProperty("--hx", `${x * 100}%`);
    e.currentTarget.style.setProperty("--hy", `${y * 100}%`);
  };

  const reset = () => {
    rx.set(0);
    ry.set(0);
  };

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!onClick || disabled) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <motion.div
      className={`holo-card ${className}`.trim()}
      style={{
        ...style,
        rotateX,
        rotateY,
        transformPerspective: 920,
      }}
      whileHover={
        disabled || !canTilt()
          ? undefined
          : {
              y: -5,
              scale: 1.03,
              transition: { type: "spring", stiffness: 420, damping: 22 },
            }
      }
      role={onClick ? "button" : undefined}
      tabIndex={onClick && !disabled ? 0 : undefined}
      onClick={disabled ? undefined : onClick}
      onKeyDown={onKey}
      onMouseMove={onMove}
      onMouseLeave={reset}
    >
      <span className="holo-shine" aria-hidden />
      {children}
    </motion.div>
  );
}
