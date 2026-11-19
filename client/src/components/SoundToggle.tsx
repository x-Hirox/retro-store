import { useEffect, useState } from "react";
import { playArcadeTune } from "../utils/arcadeBeep";
import { isMuted, subscribeMute, toggleMuted } from "../utils/soundMute";

export default function SoundToggle() {
  const [muted, setMutedState] = useState(true);

  useEffect(() => {
    setMutedState(isMuted());
    return subscribeMute(setMutedState);
  }, []);

  return (
    <button
      type="button"
      className={`walkman-btn${muted ? " is-muted" : ""}`}
      title={muted ? "Sound Off — ჩართე არკადული ხმა" : "Sound On — გამორთე ხმა"}
      aria-pressed={!muted}
      aria-label={muted ? "Sound Off" : "Sound On"}
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
      <span className="walkman-label">{muted ? "SOUND OFF" : "SOUND ON"}</span>
    </button>
  );
}
