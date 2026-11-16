import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import GameBoard from "../game/GameBoard";
import Leaderboard from "../game/Leaderboard";
import LevelSelector from "../game/LevelSelector";
import { SoundEngine } from "../game/SoundEngine";
import {
  applyCascadeStep,
  canSwap,
  createBoard,
  hasMatches,
  hint,
  shuffleBoard,
  swapCells,
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
  const [popping, setPopping] = useState<Set<string>>(new Set());
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

  const playSwap = async (a: { r: number; c: number }, b: { r: number; c: number }) => {
    if (busy || status !== "play" || !level) return;
    if (a.r < 0 || a.c < 0 || b.r < 0 || b.c < 0 || a.r >= SIZE || b.r >= SIZE || a.c >= SIZE || b.c >= SIZE) {
      return;
    }
    if (!canSwap(board, a, b)) {
      SoundEngine.invalid();
      return;
    }
    const swapped = swapCells(board, a, b);
    const ca = board[a.r][a.c];
    const cb = board[b.r][b.c];
    const colorBomb = ca?.special === "color" || cb?.special === "color";
    if (!colorBomb && !hasMatches(swapped)) {
      SoundEngine.invalid();
      setBoard(swapped);
      await new Promise((r) => setTimeout(r, 140));
      setBoard(board);
      return;
    }
    setBusy(true);
    setMoves((m) => m - 1);
    setBoard(swapped);
    SoundEngine.swap();
    await new Promise((r) => setTimeout(r, 140));
    let working = swapped;
    let combo = 0;
    while (true) {
      const step = applyCascadeStep(working, combo + 1, combo === 0 ? b : undefined);
      if (!step) break;
      combo += 1;
      setPopping(new Set(step.cleared));
      if (step.specialsMade) SoundEngine.bomb();
      else if (combo > 1) SoundEngine.combo(combo);
      else SoundEngine.match(combo);
      await new Promise((r) => setTimeout(r, 260));
      setBoard(step.board);
      setScore((s) => s + step.score);
      setCollect((prev) =>
        prev.map((c) => ({
          ...c,
          have: c.have + (step.collected[c.kind] || 0),
        })),
      );
      setPopping(new Set());
      working = step.board;
      await new Promise((r) => setTimeout(r, 160));
    }
    setBusy(false);
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
    <div className={`mg-page${screen === "play" ? " candy" : ""}`} onPointerDown={() => SoundEngine.unlock()}>
      {screen !== "play" && (
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
        </div>
      </header>
      )}

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
            <aside className="mg-hud-card">
              <button type="button" className="mg-btn ghost" onClick={() => setScreen("hub")}>
                ← ტურები
              </button>
              <p className="mg-chapter">{level.chapter}</p>
              <h2>{level.name}</h2>
              <div className="mg-moves">{moves}</div>
              <small>სვლები</small>
              <div className="mg-stars">
                <span className={score >= level.targetScore * 0.4 ? "on" : ""}>★</span>
                <span className={score >= level.targetScore * 0.7 ? "on" : ""}>★</span>
                <span className={score >= level.targetScore ? "on" : ""}>★</span>
              </div>
              <div className="mg-score-bar">
                <i style={{ width: `${Math.min(100, (score / level.targetScore) * 100)}%` }} />
              </div>
              <strong>{score.toLocaleString()} / {level.targetScore.toLocaleString()}</strong>
              {!!collect.length && (
                <div className="mg-collect">
                  {collect.map((c) => (
                    <span key={c.kind}>
                      {KIND_META[c.kind].label} {Math.min(c.have, c.need)}/{c.need}
                    </span>
                  ))}
                </div>
              )}
              <div className="mg-tools">
                <button type="button" className="mg-btn ghost" onClick={() => setMuted(SoundEngine.toggle())}>
                  {muted ? "🔇" : "🔊"}
                </button>
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
                  ?
                </button>
              </div>
            </aside>
            <GameBoard
              board={board}
              selected={selected}
              popping={popping}
              locked={busy || status !== "play"}
              onSwap={playSwap}
              onSelect={setSelected}
            />
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
