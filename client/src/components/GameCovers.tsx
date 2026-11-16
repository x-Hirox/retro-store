import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ARCADE_GAMES, type ArcadeGame, type ArcadeSystem } from "../data/arcadeGames";
import { useLang } from "../i18n/LanguageContext";

const SYSTEM_LABEL: Record<ArcadeSystem, string> = {
  nes: "NES",
  segaMD: "MD",
  snes: "SNES",
  web: "16-bit",
};

type Props = { mode?: "link" | "play" };

export default function GameCovers({ mode = "play" }: Props) {
  const { t } = useLang();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [playing, setPlaying] = useState<ArcadeGame | null>(null);

  useEffect(() => {
    if (mode !== "play") return;
    const open = params.get("open");
    if (!open) return;
    const game = ARCADE_GAMES.find((g) => g.id === open);
    if (game) setPlaying(game);
  }, [mode, params]);

  useEffect(() => {
    document.body.style.overflow = playing ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [playing]);

  const src = playing
    ? playing.playUrl ||
      `/arcade/embed.html?core=${encodeURIComponent(playing.core || "")}&rom=${encodeURIComponent(playing.romUrl || "")}&name=${encodeURIComponent(playing.title)}`
    : "";

  const onCover = (game: ArcadeGame) => {
    if (mode === "link") navigate(`/play?open=${encodeURIComponent(game.id)}`);
    else setPlaying(game);
  };

  return (
    <section className={`home-games ${mode === "play" ? "home-games-page" : ""}`}>
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
            onClick={() => onCover(game)}
            title={game.title}
          >
            {game.coverUrl ? (
              <img src={game.coverUrl} alt={game.title} />
            ) : (
              <span className="glow-cover-fallback">{game.title}</span>
            )}
            <span className="glow-cover-meta">
              <em>{SYSTEM_LABEL[game.system]}</em>
              <strong>{game.title}</strong>
            </span>
          </button>
        ))}
      </div>

      {playing && (
        <div className="arcade-player">
          <div className="arcade-player-bar">
            <strong>
              {playing.title} · {SYSTEM_LABEL[playing.system]}
            </strong>
            <span className="arcade-hint">{t("arcadeHint")}</span>
            <button type="button" onClick={() => setPlaying(null)}>
              {t("close")}
            </button>
          </div>
          <iframe title={playing.title} src={src} allow="autoplay; fullscreen" />
        </div>
      )}
    </section>
  );
}
