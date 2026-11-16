import { CAMPAIGN, dailyLevel } from "./levels";
import type { LevelConfig } from "./types";

const CHAPTERS = [
  { id: "bit", title: "8-Bit Era" },
  { id: "golden", title: "PS1 & PSP Golden Age" },
  { id: "next", title: "Next-Gen Retro" },
] as const;

export default function LevelSelector({
  unlocked,
  onPick,
}: {
  unlocked: number;
  onPick: (level: LevelConfig) => void;
}) {
  const daily = dailyLevel();
  return (
    <div className="mg-levels">
      <button type="button" className="mg-daily" onClick={() => onPick(daily)}>
        <strong>დღის გამოწვევა</strong>
        <span>
          {daily.moves} სვლა · {daily.targetScore.toLocaleString()} ქულა
        </span>
      </button>
      {CHAPTERS.map((ch) => (
        <section key={ch.id}>
          <h3>{ch.title}</h3>
          <div className="mg-level-grid">
            {CAMPAIGN.filter((l) => l.chapterId === ch.id).map((lvl) => {
              const open = lvl.id === 1 || lvl.id <= unlocked + 1;
              return (
                <button
                  key={lvl.id}
                  type="button"
                  disabled={!open}
                  className={`mg-lvl${open ? "" : " lock"}`}
                  onClick={() => open && onPick(lvl)}
                >
                  <em>{lvl.id}</em>
                  <span>{lvl.name}</span>
                </button>
              );
            })}
          </div>
        </section>
      ))}
      <button type="button" className="mg-daily alt" onClick={() => onPick({ id: -1 } as LevelConfig)}>
        Endless Arcade →
      </button>
    </div>
  );
}
