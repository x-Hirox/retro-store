import { useMemo, useRef, useState } from "react";
import {
  ARCADE_GAMES,
  ARCADE_SYSTEMS,
  type ArcadeGame,
  type ArcadeSystem,
} from "../data/arcadeGames";

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
  const [system, setSystem] = useState<ArcadeSystem | "all">("all");
  const [playing, setPlaying] = useState<Playing | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploadCore, setUploadCore] = useState<ArcadeSystem>("nes");

  const games = useMemo(
    () =>
      system === "all"
        ? ARCADE_GAMES
        : ARCADE_GAMES.filter((g) => g.system === system),
    [system],
  );

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
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(1200px 500px at 50% -10%, rgba(147,40,230,0.22), transparent 55%), var(--bg)",
        color: "var(--text)",
        padding: "36px 20px 80px",
      }}
    >
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <p
          style={{
            fontFamily: "var(--pixel)",
            fontSize: "0.7rem",
            color: "var(--accent)",
            letterSpacing: "3px",
            margin: "0 0 12px",
          }}
        >
          RETROBIT ARCADE
        </p>
        <h1
          style={{
            fontFamily: "var(--heading)",
            color: "var(--text-h)",
            fontSize: "clamp(1.8rem, 4vw, 3rem)",
            margin: "0 0 12px",
            letterSpacing: "1px",
          }}
        >
          ითამაშე ბრაუზერში
        </h1>
        <p style={{ maxWidth: 720, lineHeight: 1.65, margin: "0 0 28px" }}>
          აქ არის მხოლოდ ლეგალური homebrew — ავტორების მიერ უფასოდ გამოშვებული
          თამაშები NES, Sega Genesis, SNES და GBA-ზე. Nintendo/Sega-ს კომერციული
          ROM-ები საიტზე არ დევს, ამიტომ დომენი ამის გამო არ დაიბლოკება. თუ შენი
          ლეგალური ROM გაქვს, შეგიძლია აქვე ჩართო — ფაილი სერვერზე არ აიტვირთება.
        </p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            marginBottom: 28,
          }}
        >
          {ARCADE_SYSTEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSystem(item.id)}
              style={{
                fontFamily: "var(--heading)",
                border:
                  system === item.id
                    ? "1px solid var(--accent)"
                    : "1px solid var(--border)",
                background:
                  system === item.id ? "var(--accent-bg)" : "var(--code-bg)",
                color: system === item.id ? "var(--text-h)" : "var(--text)",
                padding: "10px 16px",
                borderRadius: 999,
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              {item.name}
            </button>
          ))}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: 20,
          }}
        >
          {games.map((game) => (
            <article
              key={game.id}
              style={{
                background: "var(--code-bg)",
                border: "1px solid var(--border)",
                borderRadius: 18,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                boxShadow: "var(--shadow)",
              }}
            >
              <div
                style={{
                  height: 168,
                  background: "#111218",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                {game.coverUrl ? (
                  <img
                    src={game.coverUrl}
                    alt={game.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 92,
                      height: 128,
                      borderRadius: 8,
                      background:
                        "linear-gradient(160deg, #3b0764, #0f172a 70%)",
                      border: "3px solid #eab308",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                      padding: 8,
                      fontFamily: "var(--pixel)",
                      fontSize: "0.55rem",
                      lineHeight: 1.4,
                    }}
                  >
                    {game.title}
                  </div>
                )}
              </div>
              <div style={{ padding: 16, display: "flex", flexDirection: "column", flex: 1 }}>
                <span
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--accent)",
                    fontWeight: 700,
                    letterSpacing: "0.6px",
                  }}
                >
                  {SYSTEM_LABEL[game.system]}
                </span>
                <h2
                  style={{
                    margin: "6px 0 8px",
                    color: "var(--text-h)",
                    fontSize: "1.15rem",
                    fontFamily: "var(--heading)",
                  }}
                >
                  {game.title}
                </h2>
                <p style={{ margin: "0 0 12px", fontSize: "0.92rem", flex: 1 }}>
                  {game.description}
                </p>
                <p style={{ margin: "0 0 14px", fontSize: "0.8rem", opacity: 0.8 }}>
                  {game.author} · {game.license} · {game.year}
                </p>
                <button
                  type="button"
                  onClick={() => startGame(game)}
                  style={{
                    background: "var(--accent)",
                    color: "#fff",
                    border: "none",
                    borderRadius: 12,
                    padding: "11px 14px",
                    fontWeight: 800,
                    cursor: "pointer",
                    fontFamily: "var(--heading)",
                  }}
                >
                  Play
                </button>
              </div>
            </article>
          ))}

          <article
            style={{
              background: "var(--code-bg)",
              border: "1px dashed var(--accent-border)",
              borderRadius: 18,
              padding: 18,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: 280,
            }}
          >
            <div>
              <span
                style={{
                  fontSize: "0.75rem",
                  color: "var(--accent)",
                  fontWeight: 700,
                }}
              >
                HOMEBREW
              </span>
              <h2
                style={{
                  margin: "8px 0 10px",
                  color: "var(--text-h)",
                  fontFamily: "var(--heading)",
                  fontSize: "1.15rem",
                }}
              >
                შენი ROM
              </h2>
              <p style={{ margin: 0, fontSize: "0.92rem" }}>
                აირჩიე კონსოლი და ჩატვირთე შენი ლეგალური homebrew ფაილი. ფაილი
                მხოლოდ შენს ბრაუზერში რჩება.
              </p>
            </div>
            <div>
              <select
                value={uploadCore}
                onChange={(e) => setUploadCore(e.target.value as ArcadeSystem)}
                style={{
                  width: "100%",
                  margin: "16px 0 10px",
                  padding: "10px 12px",
                  borderRadius: 10,
                  border: "1px solid var(--border)",
                  background: "var(--bg)",
                  color: "var(--text-h)",
                }}
              >
                <option value="nes">NES (.nes)</option>
                <option value="segaMD">Sega Genesis (.md / .bin)</option>
                <option value="snes">SNES (.sfc / .smc)</option>
                <option value="gba">GBA (.gba)</option>
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
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                style={{
                  width: "100%",
                  background: "transparent",
                  color: "var(--text-h)",
                  border: "1px solid var(--accent)",
                  borderRadius: 12,
                  padding: "11px 14px",
                  fontWeight: 800,
                  cursor: "pointer",
                  fontFamily: "var(--heading)",
                }}
              >
                ფაილის არჩევა
              </button>
            </div>
          </article>
        </div>
      </div>

      {playing && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 5000,
            background: "rgba(0,0,0,0.86)",
            display: "flex",
            flexDirection: "column",
            padding: "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
              marginBottom: 12,
              color: "#fff",
            }}
          >
            <strong style={{ fontFamily: "var(--heading)" }}>
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
              style={{
                background: "#fff",
                color: "#111",
                border: "none",
                borderRadius: 10,
                padding: "8px 14px",
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              დახურვა
            </button>
          </div>
          <iframe
            title={playing.title}
            src={`/arcade/embed.html?core=${encodeURIComponent(playing.core)}&rom=${encodeURIComponent(playing.romUrl)}&name=${encodeURIComponent(playing.title)}`}
            style={{
              flex: 1,
              width: "100%",
              border: "none",
              borderRadius: 12,
              background: "#000",
            }}
            allow="autoplay; fullscreen; gamepad"
          />
        </div>
      )}
    </div>
  );
}
