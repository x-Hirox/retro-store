import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import GameBoard from "../game/GameBoard";
import Leaderboard from "../game/Leaderboard";
import LevelSelector from "../game/LevelSelector";
import { SoundEngine } from "../game/SoundEngine";
import {
  createBoard,
  hint,
  shuffleBoard,
  tryMove,
} from "../game/engine";
import { getLevel, nextLevelId } from "../game/levels";
import { KIND_META, SIZE, type Board, type Kind, type LevelConfig } from "../game/types";
import {
  getChallenge,
  getLeaderboard,
  getMyGame,
  postScore,
} from "../services/gameService";
import type { BoardRow } from "../game/Leaderboard";

function storedUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null") as {
      id?: string;
      name?: string;
    } | null;
  } catch {
    return null;
  }
}

export default function MatchGame() {
  const [params] = useSearchParams();
  const user = storedUser();
  const token = localStorage.getItem("token");

  const [screen, setScreen] = useState<"hub" | "play">("hub");
  const [level, setLevel] = useState<LevelConfig | null>(null);
  const [board, setBoard] = useState<Board>(() => createBoard(getLevel(1)));
  const [selected, setSelected] = useState<{ r: number; c: number } | null>(null);
  const [score, setScore] = useState(0);
  const [sessionScore, setSessionScore] = useState(0);
  const [moves, setMoves] = useState(20);
  const [collect, setCollect] = useState<{ kind: Kind; need: number; have: number }[]>([]);
  const [busy, setBusy] = useState(false);
  const [muted, setMuted] = useState(SoundEngine.isMuted());
  const [status, setStatus] = useState<"play" | "win" | "lose">("play");
  const [unlocked, setUnlocked] = useState(Number(localStorage.getItem("rb-match-level") || "1"));
  const [rows, setRows] = useState<BoardRow[]>([]);
  const [challenge, setChallenge] = useState<{ name: string; score: number } | null>(null);
  const [copied, setCopied] = useState("");
  const [meId, setMeId] = useState(user?.id || "");
  const settled = useRef(false);

  const challengeParam = params.get("challenge");
  const challengeScore = Number(params.get("score") || 0);

  useEffect(() => {
    getLeaderboard().then(setRows).catch(() => setRows([]));
    if (token) {
      getMyGame()
        .then((data) => {
          setMeId(data.userId);
          setUnlocked((prev) => Math.max(prev, data.highestLevel || 1));
        })
        .catch(() => {});
    }
    if (challengeParam) {
      getChallenge(challengeParam)
        .then((info) =>
          setChallenge({
            name: info.username,
            score: challengeScore || info.highScore,
          }),
        )
        .catch(() => {
          if (challengeScore) setChallenge({ name: "მეგობარი", score: challengeScore });
        });
    }
  }, [token, challengeParam, challengeScore]);

  const won = useMemo(() => {
    if (!level) return false;
    const scoreOk = score >= level.targetScore;
    const collectOk = collect.every((c) => c.have >= c.need);
    return scoreOk && collectOk;
  }, [level, score, collect]);

  useEffect(() => {
    if (screen !== "play" || status !== "play") return;
    if (won) {
      setStatus("win");
      SoundEngine.win();
      void finish(true);
    } else if (moves <= 0) {
      setStatus("lose");
      SoundEngine.lose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [won, moves, screen, status]);

  const startLevel = (cfg: LevelConfig) => {
    SoundEngine.unlock();
    const resolved = cfg.id === -1 ? getLevel(Math.max(25, unlocked + 1)) : cfg;
    setLevel(resolved);
    setBoard(createBoard(resolved));
    setScore(0);
    setMoves(resolved.moves);
    setCollect(
      Object.entries(resolved.collect || {}).map(([k, need]) => ({
        kind: Number(k) as Kind,
        need: Number(need),
        have: 0,
      })),
    );
    setSelected(null);
    setStatus("play");
    setScreen("play");
    settled.current = false;
  };

  const finish = async (success: boolean) => {
    if (!level || !success || settled.current) return;
    settled.current = true;
    const total = sessionScore + score;
    setSessionScore(total);
    const reached = level.chapterId === "daily" ? unlocked : Math.max(unlocked, level.id);
    setUnlocked(reached);
    localStorage.setItem("rb-match-level", String(reached));
    if (!token) return;
    try {
      await postScore({
        score: total,
        level: level.id || reached,
      });
      const boardRows = await getLeaderboard();
      setRows(boardRows);
    } catch {
      /* guest or offline */
    }
  };

  const playSwap = (a: { r: number; c: number }, b: { r: number; c: number }) => {
    if (busy || status !== "play" || !level) return;
    if (a.r < 0 || a.c < 0 || b.r < 0 || b.c < 0 || a.r >= SIZE || b.r >= SIZE || a.c >= SIZE || b.c >= SIZE) {
      return;
    }
    const result = tryMove(board, a, b);
    if (!result) {
      SoundEngine.invalid();
      return;
    }
    setBusy(true);
    setMoves((m) => m - 1);
    setBoard(result.board);
    setScore((s) => s + result.score);
    setCollect((prev) =>
      prev.map((c) => ({
        ...c,
        have: c.have + (result.collected[c.kind] || 0),
      })),
    );
    if (result.specialsMade) SoundEngine.bomb();
    else if (result.combo > 1) SoundEngine.combo(result.combo);
    else SoundEngine.match(result.combo);
    setTimeout(() => setBusy(false), 220);
  };

  const reshuffle = () => {
    setBoard((b) => shuffleBoard(b));
    SoundEngine.swap();
  };

  const share = async () => {
    const id = meId || user?.id || "guest";
    const url = `${window.location.origin}/game?challenge=${encodeURIComponent(id)}&score=${sessionScore || score}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied("ლინკი დაკოპირდა");
    } catch {
      setCopied(url);
    }
  };

  return (
    <div className="mg-page" onPointerDown={() => SoundEngine.unlock()}>
      <header className="mg-hero">
        <p className="mg-kicker">RETROBIT MATCH</p>
        <h1>Console Crush</h1>
        <p>შეაერთე 3+ ერთნაირი კონსოლი, ააწყვე კომბოები და მოხსენი მეგობრის რეკორდი.</p>
        <div className="mg-hero-actions">
          <button
            type="button"
            className="mg-btn ghost"
            onClick={() => setMuted(SoundEngine.toggle())}
          >
            {muted ? "🔇 ხმა" : "🔊 ხმა"}
          </button>
          {screen === "play" && (
            <button type="button" className="mg-btn ghost" onClick={() => setScreen("hub")}>
              ტურები
            </button>
          )}
        </div>
      </header>

      {challenge && (
        <div className="mg-challenge">
          მეგობარმა <strong>{challenge.name}</strong> გამოგიწვია! მოხსენი მისი რეკორდი:{" "}
          <strong>{challenge.score.toLocaleString()}</strong> ქულა.
        </div>
      )}

      {screen === "hub" ? (
        <div className="mg-hub">
          <LevelSelector unlocked={unlocked} onPick={startLevel} />
          <aside>
            <div className="mg-card">
              <h3>შენი პროგრესი</h3>
              <p>ტური {unlocked} · სესია {sessionScore.toLocaleString()}</p>
              <button type="button" className="mg-btn" onClick={share}>
                Challenge a Friend
              </button>
              {copied && <p className="mg-muted">{copied}</p>}
              {!token && (
                <p className="mg-muted">
                  <Link to="/login">შედი</Link> რომ ქულა ლიდერბორდზე შეინახოს.
                </p>
              )}
            </div>
            <Leaderboard rows={rows} me={meId} />
          </aside>
        </div>
      ) : (
        level && (
          <div className="mg-play">
            <div className="mg-hud">
              <div>
                <small>{level.chapter}</small>
                <strong>{level.name}</strong>
              </div>
              <div>
                <small>ქულა</small>
                <strong>
                  {score.toLocaleString()} / {level.targetScore.toLocaleString()}
                </strong>
              </div>
              <div>
                <small>სვლები</small>
                <strong>{moves}</strong>
              </div>
            </div>
            {!!collect.length && (
              <div className="mg-collect">
                {collect.map((c) => (
                  <span key={c.kind}>
                    {KIND_META[c.kind].label} {Math.min(c.have, c.need)}/{c.need}
                  </span>
                ))}
              </div>
            )}
            <GameBoard
              board={board}
              selected={selected}
              popping={new Set()}
              locked={busy || status !== "play"}
              onSwap={playSwap}
              onSelect={setSelected}
            />
            <div className="mg-tools">
              <button type="button" className="mg-btn ghost" onClick={reshuffle}>
                არევა
              </button>
              <button
                type="button"
                className="mg-btn ghost"
                onClick={() => {
                  const h = hint(board);
                  if (h) setSelected(h[0]);
                }}
              >
                მინიშნება
              </button>
            </div>
          </div>
        )
      )}

      {status !== "play" && screen === "play" && (
        <div className="mg-modal">
          <div className="mg-modal-card">
            <h2>{status === "win" ? "ტური დახურულია!" : "სვლები ამოიწურა"}</h2>
            <p>{score.toLocaleString()} ქულა</p>
            {status === "win" && !token && (
              <p>
                <Link to="/login">შედი</Link> რომ რეკორდი ლიდერბორდზე შეინახო.
              </p>
            )}
            <div className="mg-hero-actions">
              {status === "win" && level && (
                <button
                  type="button"
                  className="mg-btn"
                  onClick={() => startLevel(getLevel(nextLevelId(level.id)))}
                >
                  შემდეგი ტური
                </button>
              )}
              <button type="button" className="mg-btn ghost" onClick={() => startLevel(level!)}>
                თავიდან
              </button>
              <button type="button" className="mg-btn ghost" onClick={() => setScreen("hub")}>
                მენიუ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
