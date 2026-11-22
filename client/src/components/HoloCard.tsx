import {
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  useRef,
} from "react";

type Props = {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  style?: CSSProperties;
};

function canFollow() {
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
  const frame = useRef(0);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    if (disabled || !canFollow()) return;
    const el = e.currentTarget;
    const x = e.clientX;
    const y = e.clientY;
    if (frame.current) cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      const r = el.getBoundingClientRect();
      const px = ((x - r.left) / r.width) * 100;
      const py = ((y - r.top) / r.height) * 100;
      el.style.setProperty("--hx", `${px}%`);
      el.style.setProperty("--hy", `${py}%`);
    });
  };

  const reset = (e: MouseEvent<HTMLDivElement>) => {
    if (frame.current) cancelAnimationFrame(frame.current);
    frame.current = 0;
    e.currentTarget.style.removeProperty("--hx");
    e.currentTarget.style.removeProperty("--hy");
  };

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!onClick || disabled) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      className={`holo-card ${className}`.trim()}
      style={style}
      role={onClick ? "button" : undefined}
      tabIndex={onClick && !disabled ? 0 : undefined}
      onClick={disabled ? undefined : onClick}
      onKeyDown={onKey}
      onMouseMove={onMove}
      onMouseLeave={reset}
    >
      <span className="holo-shine" aria-hidden />
      {children}
    </div>
  );
}
