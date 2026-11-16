import { useState } from "react";
import { ARCADE_GAMES, type ArcadeSystem } from "../data/arcadeGames";
import { useLang } from "../i18n/LanguageContext";

const SYSTEM_LABEL: Record<ArcadeSystem, string> = {
  nes: "NES",
  segaMD: "Sega Genesis",
  snes: "SNES",
  gba: "GBA",
};

type Playing = { title: string; core: ArcadeSystem; romUrl: string };

export default function GameCovers() {
  const { t } = useLang();
  const [playing, setPlaying] = useState<Playing | null>(null);

  return (
    <section className="home-games">
      <div className="home-games-head">
        <h2 className="home-games-title">{t("games")}</h2>
        <p className="home-games-note">{t("legalNote")}</p>
      </div>

      <div className="home-games-grid">
        {ARCADE_GAMES.map((game) => (
          <button
            key={game.id}
            type="button"
            className="glow-cover"
            style={{ background: game.poster }}
            onClick={() =>
              setPlaying({
                title: game.title,
                core: game.core,
                romUrl: game.romUrl,
              })
            }
          >
            {game.coverUrl ? (
              <img src={game.coverUrl} alt={game.title} />
            ) : (
              <span className="glow-cover-fallback">{game.title}</span>
            )}
            <span className="glow-cover-meta">
              <span>{SYSTEM_LABEL[game.system]}</span>
              <strong>{game.title}</strong>
            </span>
          </button>
        ))}
      </div>

      {playing && (
        <div className="arcade-player">
          <div className="arcade-player-bar">
            <strong>
              {playing.title} · {SYSTEM_LABEL[playing.core]}
            </strong>
            <button type="button" onClick={() => setPlaying(null)}>
              {t("close")}
            </button>
          </div>
          <iframe
            title={playing.title}
            src={`/arcade/embed.html?core=${encodeURIComponent(playing.core)}&rom=${encodeURIComponent(playing.romUrl)}&name=${encodeURIComponent(playing.title)}`}
            allow="autoplay; fullscreen; gamepad"
          />
        </div>
      )}
    </section>
  );
}
