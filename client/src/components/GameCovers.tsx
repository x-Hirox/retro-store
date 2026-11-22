import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ARCADE_GAMES, type ArcadeGame, type ArcadeSystem } from "../data/arcadeGames";
import { useLang } from "../i18n/LanguageContext";
import HoloCard from "./HoloCard";

const SYSTEM_LABEL: Record<ArcadeSystem, string> = {
  nes: "NES",
  segaMD: "MD",
  snes: "SNES",
  gba: "GBA",
  web: "HTML5",
};

type Props = { mode?: "link" | "play" };

export default function GameCovers({ mode = "play" }: Props) {
  const { t, lang } = useLang();
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
        <p className="arcade-kicker">{t("arcadeKicker")}</p>
        <h2 className="home-games-title">{t("games")}</h2>
        <p className="home-games-note">{t("legalNote")}</p>
      </div>
      <div className="home-games-grid">
        {ARCADE_GAMES.map((game) => (
          <HoloCard
            key={game.id}
            className="glow-cover"
            style={{ background: game.poster }}
            onClick={() => onCover(game)}
          >
            <span className="glow-cover-art">
              {game.coverUrl ? (
                <img src={game.coverUrl} alt={game.title} />
              ) : (
                <span className="glow-cover-fallback">{game.title}</span>
              )}
            </span>
            <span className="glow-cover-meta">
              <em>{SYSTEM_LABEL[game.system]}</em>
              <span className="arcade-badge mini">FREE PLAY</span>
              <strong>{game.title}</strong>
              <span className="glow-cover-credits">{game.author}</span>
              <span className="glow-cover-blurb">{game.desc[lang]}</span>
            </span>
          </HoloCard>
        ))}
      </div>

      {playing && (
        <div className="arcade-player">
          <div className="arcade-player-bar">
            <div className="arcade-player-titles">
              <strong>
                {playing.title} · {SYSTEM_LABEL[playing.system]}
              </strong>
              <span className="arcade-credits">
                {t("arcadeCredits")}: {playing.author}
                {playing.license ? ` · ${playing.license}` : ""}
                {playing.sourceUrl ? (
                  <>
                    {" · "}
                    <a href={playing.sourceUrl} target="_blank" rel="noreferrer">
                      {t("arcadeSource")}
                    </a>
                  </>
                ) : null}
              </span>
              <span className="arcade-player-desc">{playing.desc[lang]}</span>
            </div>
            <span className="arcade-hint">{playing.hint || t("arcadeHint")}</span>
            <button
              type="button"
              className="arcade-fs"
              onClick={() => {
                const box = document.querySelector(".arcade-player");
                if (!box) return;
                if (document.fullscreenElement) void document.exitFullscreen();
                else void (box as HTMLElement).requestFullscreen?.();
              }}
            >
              FULL
            </button>
            <button type="button" onClick={() => setPlaying(null)}>
              {t("close")}
            </button>
          </div>
          <div className="arcade-crt-glass">
            <iframe
              title={playing.title}
              src={src}
              allow="autoplay; fullscreen; gamepad; gyroscope; accelerometer"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </section>
  );
}
