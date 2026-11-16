import { useRef, useState } from "react";
import {
  ARCADE_GAMES,
  type ArcadeGame,
  type ArcadeSystem,
} from "../data/arcadeGames";
import { useLang } from "../i18n/LanguageContext";

const SYSTEM_LABEL: Record<ArcadeSystem, string> = {
  nes: "NES",
  segaMD: "Sega Genesis",
  snes: "SNES",
  gba: "GBA",
};

const ACCEPT: Record<ArcadeSystem, string> = {
  nes: ".nes",
  segaMD: ".md,.bin,.gen,.smd",
  snes: ".sfc,.smc",
  gba: ".gba",
};

type Playing = {
  title: string;
  core: ArcadeSystem;
  romUrl: string;
};

export default function Arcade() {
  const { t, lang } = useLang();
  const [playing, setPlaying] = useState<Playing | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploadCore, setUploadCore] = useState<ArcadeSystem>("nes");

  const startGame = (game: ArcadeGame) => {
    setPlaying({
      title: game.title,
      core: game.core,
      romUrl: game.romUrl,
    });
  };

  const onPickFile = (file: File | undefined) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPlaying({
      title: file.name.replace(/\.[^.]+$/, ""),
      core: uploadCore,
      romUrl: url,
    });
  };

  return (
    <div className="arcade-page">
      <div className="arcade-wrap">
        <p className="arcade-kicker">{t("arcadeKicker")}</p>
        <h1 className="arcade-title">{t("arcadeTitle")}</h1>
        <p className="arcade-lead">{t("arcadeLead")}</p>

        <div className="arcade-grid">
          {ARCADE_GAMES.map((game) => (
            <button
              key={game.id}
              type="button"
              className="arcade-cover"
              onClick={() => startGame(game)}
              style={{ background: game.poster }}
            >
              {game.coverUrl ? (
                <img src={game.coverUrl} alt={game.title} />
              ) : (
                <span className="arcade-cover-fallback">{game.title}</span>
              )}
              <span className="arcade-cover-meta">
                <span className="arcade-cover-sys">
                  {SYSTEM_LABEL[game.system]}
                </span>
                <span className="arcade-cover-name">{game.title}</span>
                <span className="arcade-cover-desc">
                  {game.description[lang]}
                </span>
              </span>
            </button>
          ))}
        </div>

        <div className="arcade-rom">
          <div>
            <strong>{t("yourRom")}</strong>
            <p>
              NES · Sega Genesis · SNES · GBA
            </p>
          </div>
          <div className="arcade-rom-actions">
            <select
              value={uploadCore}
              onChange={(e) => setUploadCore(e.target.value as ArcadeSystem)}
            >
              <option value="nes">NES</option>
              <option value="segaMD">Sega Genesis</option>
              <option value="snes">SNES</option>
              <option value="gba">GBA</option>
            </select>
            <input
              ref={fileRef}
              type="file"
              accept={ACCEPT[uploadCore]}
              hidden
              onChange={(e) => {
                onPickFile(e.target.files?.[0]);
                e.target.value = "";
              }}
            />
            <button type="button" onClick={() => fileRef.current?.click()}>
              {t("pickFile")}
            </button>
          </div>
        </div>
      </div>

      {playing && (
        <div className="arcade-player">
          <div className="arcade-player-bar">
            <strong>
              {playing.title} · {SYSTEM_LABEL[playing.core]}
            </strong>
            <button
              type="button"
              onClick={() => {
                if (playing.romUrl.startsWith("blob:")) {
                  URL.revokeObjectURL(playing.romUrl);
                }
                setPlaying(null);
              }}
            >
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
    </div>
  );
}
