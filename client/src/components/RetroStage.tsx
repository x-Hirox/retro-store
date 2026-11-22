import type { ReactNode } from "react";
import RetroBackground from "./RetroBackground";

export default function RetroStage({ children }: { children?: ReactNode }) {
  return (
    <section className="retro-stage">
      <RetroBackground />
      <div className="retro-stage-banner">{children}</div>
    </section>
  );
}
