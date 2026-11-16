import { useEffect, useState } from "react";
import { playArcadeTune } from "../utils/arcadeBeep";
import { isMuted, toggleMuted } from "../utils/soundMute";

export default function SoundToggle() {
  const [muted, setMutedState] = useState(false);

  useEffect(() => {
    setMutedState(isMuted());
  }, []);

  return (
    <button
      type="button"
      className={`walkman-btn${muted ? " is-muted" : ""}`}
      title={muted ? "Walkman ჩართე" : "Walkman გამორთე"}
      aria-pressed={!muted}
      onClick={() => {
        const next = toggleMuted();
        setMutedState(next);
        if (!next) playArcadeTune();
      }}
    >
      <span className="walkman-body">
        <span className="walkman-window" />
        <span className="walkman-wheels" aria-hidden>
          <i />
          <i />
        </span>
      </span>
      <span className="walkman-label">{muted ? "MUTE" : "PLAY"}</span>
    </button>
  );
}
