import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  asLink?: boolean;
};

export default function NeonButton({
  className = "",
  children,
  type = "button",
  ...props
}: Props) {
  return (
    <button type={type} className={`neon-btn ${className}`.trim()} {...props}>
      <span className="neon-btn-glow" aria-hidden />
      {children}
    </button>
  );
}
