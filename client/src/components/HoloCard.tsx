import {
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from "react";

type Props = {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  style?: CSSProperties;
};

export default function HoloCard({
  children,
  className = "",
  disabled,
  onClick,
  style,
}: Props) {
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
    >
      <span className="holo-shine" aria-hidden />
      {children}
    </div>
  );
}
