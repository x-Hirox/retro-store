import { SIZE, type Board, type Cell, type Kind, type LevelConfig, type Special } from "./types";

export function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function randKind(): Kind {
  return Math.floor(Math.random() * 6) as Kind;
}

export function cloneBoard(board: Board): Board {
  return board.map((row) => row.map((cell) => (cell ? { ...cell } : null)));
}

function inBounds(r: number, c: number) {
  return r >= 0 && c >= 0 && r < SIZE && c < SIZE;
}

function wouldMatch(board: Board, r: number, c: number, kind: Kind) {
  if (c >= 2) {
    const a = board[r][c - 1];
    const b = board[r][c - 2];
    if (a && b && !a.blocker && !b.blocker && a.kind === kind && b.kind === kind) return true;
  }
  if (r >= 2) {
    const a = board[r - 1][c];
    const b = board[r - 2][c];
    if (a && b && !a.blocker && !b.blocker && a.kind === kind && b.kind === kind) return true;
  }
  return false;
}

function makeTile(kind: Kind, extra: Partial<Cell> = {}): Cell {
  return {
    id: uid(),
    kind,
    special: "none",
    ice: 0,
    blocker: false,
    ...extra,
  };
}

export function createBoard(level: LevelConfig): Board {
  const board: Board = Array.from({ length: SIZE }, () => Array(SIZE).fill(null));
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      let kind = randKind();
      let guard = 0;
      while (wouldMatch(board, r, c, kind) && guard < 12) {
        kind = randKind();
        guard++;
      }
      board[r][c] = makeTile(kind);
    }
  }

  const spots: [number, number][] = [];
  for (let r = 1; r < SIZE - 1; r++) {
    for (let c = 1; c < SIZE - 1; c++) spots.push([r, c]);
  }
  for (let i = spots.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [spots[i], spots[j]] = [spots[j], spots[i]];
  }
  let i = 0;
  for (let n = 0; n < level.blockers && i < spots.length; n++, i++) {
    const [r, c] = spots[i];
    board[r][c] = makeTile(0, { blocker: true });
  }
  for (let n = 0; n < level.ice && i < spots.length; n++, i++) {
    const [r, c] = spots[i];
    const cell = board[r][c];
    if (cell && !cell.blocker) cell.ice = 2;
  }
  return board;
}

export function neighbors(a: { r: number; c: number }, b: { r: number; c: number }) {
  return Math.abs(a.r - b.r) + Math.abs(a.c - b.c) === 1;
}

export function swapCells(board: Board, a: { r: number; c: number }, b: { r: number; c: number }): Board {
  const next = cloneBoard(board);
  const t = next[a.r][a.c];
  next[a.r][a.c] = next[b.r][b.c];
  next[b.r][b.c] = t;
  return next;
}

function canSwapCell(cell: Cell | null) {
  return Boolean(cell && !cell.blocker && cell.ice === 0);
}

export function canSwap(board: Board, a: { r: number; c: number }, b: { r: number; c: number }) {
  if (!inBounds(a.r, a.c) || !inBounds(b.r, b.c) || !neighbors(a, b)) return false;
  return canSwapCell(board[a.r][a.c]) && canSwapCell(board[b.r][b.c]);
}

interface Group {
  cells: { r: number; c: number }[];
  kind: Kind;
  axis: "h" | "v" | "shape";
}

function lineGroups(board: Board): Group[] {
  const groups: Group[] = [];
  for (let r = 0; r < SIZE; r++) {
    let run: { r: number; c: number }[] = [];
    let kind: Kind | null = null;
    const flush = () => {
      if (kind !== null && run.length >= 3) groups.push({ cells: run, kind, axis: "h" });
    };
    for (let c = 0; c < SIZE; c++) {
      const cell = board[r][c];
      if (cell && !cell.blocker && cell.kind === kind) {
        run.push({ r, c });
      } else {
        flush();
        if (cell && !cell.blocker) {
          kind = cell.kind;
          run = [{ r, c }];
        } else {
          kind = null;
          run = [];
        }
      }
    }
    flush();
  }
  for (let c = 0; c < SIZE; c++) {
    let run: { r: number; c: number }[] = [];
    let kind: Kind | null = null;
    const flush = () => {
      if (kind !== null && run.length >= 3) groups.push({ cells: run, kind, axis: "v" });
    };
    for (let r = 0; r < SIZE; r++) {
      const cell = board[r][c];
      if (cell && !cell.blocker && cell.kind === kind) {
        run.push({ r, c });
      } else {
        flush();
        if (cell && !cell.blocker) {
          kind = cell.kind;
          run = [{ r, c }];
        } else {
          kind = null;
          run = [];
        }
      }
    }
    flush();
  }
  return groups;
}

function key(r: number, c: number) {
  return `${r},${c}`;
}

export function hasMatches(board: Board) {
  return lineGroups(board).length > 0;
}

function add(set: Set<string>, r: number, c: number) {
  if (inBounds(r, c)) set.add(key(r, c));
}

function fireSpecial(board: Board, r: number, c: number, set: Set<string>, swappedKind?: Kind) {
  const cell = board[r][c];
  if (!cell) return;
  const k = key(r, c);
  if (set.has(k) && cell.special === "none") return;
  add(set, r, c);
  if (cell.special === "laser-h") {
    for (let x = 0; x < SIZE; x++) add(set, r, x);
  } else if (cell.special === "laser-v") {
    for (let y = 0; y < SIZE; y++) add(set, y, c);
  } else if (cell.special === "bomb") {
    for (let y = r - 1; y <= r + 1; y++) {
      for (let x = c - 1; x <= c + 1; x++) add(set, y, x);
    }
  } else if (cell.special === "color") {
    const target = swappedKind ?? cell.kind;
    for (let y = 0; y < SIZE; y++) {
      for (let x = 0; x < SIZE; x++) {
        const t = board[y][x];
        if (t && !t.blocker && t.kind === target) add(set, y, x);
      }
    }
  }
}

export interface ResolveResult {
  board: Board;
  score: number;
  collected: Partial<Record<Kind, number>>;
  combo: number;
  popped: number;
  specialsMade: number;
}

export function resolveBoard(
  boardIn: Board,
  opts?: { prefer?: { r: number; c: number }; colorSwapKind?: Kind },
): ResolveResult {
  let board = cloneBoard(boardIn);
  let score = 0;
  let combo = 0;
  let popped = 0;
  let specialsMade = 0;
  const collected: Partial<Record<Kind, number>> = {};

  if (opts?.colorSwapKind !== undefined && opts.prefer) {
    const clear = new Set<string>();
    fireSpecial(board, opts.prefer.r, opts.prefer.c, clear, opts.colorSwapKind);
    combo = 1;
    for (const k of clear) {
      const [r, c] = k.split(",").map(Number);
      const cell = board[r]?.[c];
      if (!cell) continue;
      if (cell.blocker) {
        board[r][c] = null;
        score += 80;
        continue;
      }
      collected[cell.kind] = (collected[cell.kind] || 0) + 1;
      board[r][c] = null;
      popped += 1;
      score += 50;
    }
    board = gravity(board);
    board = fill(board);
  }

  while (true) {
    const groups = lineGroups(board);
    if (!groups.length) break;
    combo += 1;
    const clear = new Set<string>();
    const spawn: { r: number; c: number; special: Special; kind: Kind }[] = [];

    for (const g of groups) {
      for (const p of g.cells) {
        const cell = board[p.r][p.c];
        if (cell) fireSpecial(board, p.r, p.c, clear);
        else add(clear, p.r, p.c);
      }
      const len = g.cells.length;
      const isT = groups.some(
        (other) =>
          other !== g &&
          other.kind === g.kind &&
          other.cells.some((p) => g.cells.some((q) => q.r === p.r && q.c === p.c)),
      );
      let special: Special = "none";
      if (len >= 5 || isT) special = len >= 5 && !isT ? "color" : "bomb";
      else if (len === 4) special = g.axis === "h" ? "laser-h" : "laser-v";
      if (special !== "none") {
        const pref = opts?.prefer;
        const at =
          (pref && g.cells.find((p) => p.r === pref.r && p.c === pref.c)) ||
          g.cells[Math.floor(g.cells.length / 2)];
        spawn.push({ ...at, special, kind: g.kind });
      }
    }

    if (opts?.colorSwapKind !== undefined && opts.prefer) {
      const cell = board[opts.prefer.r][opts.prefer.c];
      if (cell?.special === "color") fireSpecial(board, opts.prefer.r, opts.prefer.c, clear, opts.colorSwapKind);
    }

    const chained = [...clear];
    for (const k of chained) {
      const [r, c] = k.split(",").map(Number);
      const cell = board[r][c];
      if (cell && cell.special !== "none") fireSpecial(board, r, c, clear);
    }

    const iceHits = new Set<string>();
    for (const k of clear) {
      const [r, c] = k.split(",").map(Number);
      for (const [dr, dc] of [
        [0, 1],
        [0, -1],
        [1, 0],
        [-1, 0],
      ] as const) {
        iceHits.add(key(r + dr, c + dc));
      }
    }

    for (const k of iceHits) {
      if (clear.has(k)) continue;
      const [r, c] = k.split(",").map(Number);
      const cell = inBounds(r, c) ? board[r][c] : null;
      if (cell?.ice) cell.ice -= 1;
      if (cell?.blocker) {
        board[r][c] = null;
        score += 80 * combo;
      }
    }

    for (const k of clear) {
      const [r, c] = k.split(",").map(Number);
      const cell = board[r][c];
      if (!cell) continue;
      if (cell.ice > 0) {
        cell.ice -= 1;
        continue;
      }
      if (cell.blocker) {
        board[r][c] = null;
        score += 80 * combo;
        continue;
      }
      collected[cell.kind] = (collected[cell.kind] || 0) + 1;
      board[r][c] = null;
      popped += 1;
      score += 60 * combo;
    }

    for (const s of spawn) {
      if (!board[s.r][s.c]) {
        board[s.r][s.c] = makeTile(s.kind, { special: s.special });
        specialsMade += 1;
        score += 200 * combo;
      }
    }

    board = gravity(board);
    board = fill(board);
  }

  return { board, score, collected, combo, popped, specialsMade };
}

function gravity(board: Board): Board {
  const next = cloneBoard(board);
  for (let c = 0; c < SIZE; c++) {
    let write = SIZE - 1;
    for (let r = SIZE - 1; r >= 0; r--) {
      const cell = next[r][c];
      if (cell?.blocker) {
        write = r - 1;
        continue;
      }
      if (cell) {
        if (r !== write) {
          next[write][c] = cell;
          next[r][c] = null;
        }
        write -= 1;
      }
    }
  }
  return next;
}

function fill(board: Board): Board {
  const next = cloneBoard(board);
  for (let c = 0; c < SIZE; c++) {
    for (let r = 0; r < SIZE; r++) {
      if (!next[r][c]) next[r][c] = makeTile(randKind());
    }
  }
  return next;
}

export function applyCascadeStep(
  boardIn: Board,
  combo = 1,
  prefer?: { r: number; c: number },
): {
  board: Board;
  cleared: string[];
  collected: Partial<Record<Kind, number>>;
  score: number;
  specialsMade: number;
} | null {
  let board = cloneBoard(boardIn);
  const groups = lineGroups(board);
  if (!groups.length) return null;
  const clear = new Set<string>();
  const spawn: { r: number; c: number; special: Special; kind: Kind }[] = [];
  const collected: Partial<Record<Kind, number>> = {};
  let score = 0;
  let specialsMade = 0;

  for (const g of groups) {
    for (const p of g.cells) {
      const cell = board[p.r][p.c];
      if (cell) fireSpecial(board, p.r, p.c, clear);
      else add(clear, p.r, p.c);
    }
    const len = g.cells.length;
    const isT = groups.some(
      (other) =>
        other !== g &&
        other.kind === g.kind &&
        other.cells.some((p) => g.cells.some((q) => q.r === p.r && q.c === p.c)),
    );
    let special: Special = "none";
    if (len >= 5 || isT) special = len >= 5 && !isT ? "color" : "bomb";
    else if (len === 4) special = g.axis === "h" ? "laser-h" : "laser-v";
    if (special !== "none") {
      const at =
        (prefer && g.cells.find((p) => p.r === prefer.r && p.c === prefer.c)) ||
        g.cells[Math.floor(g.cells.length / 2)];
      spawn.push({ ...at, special, kind: g.kind });
    }
  }

  const chained = [...clear];
  for (const k of chained) {
    const [r, c] = k.split(",").map(Number);
    const cell = board[r]?.[c];
    if (cell && cell.special !== "none") fireSpecial(board, r, c, clear);
  }

  const iceHits = new Set<string>();
  for (const k of clear) {
    const [r, c] = k.split(",").map(Number);
    for (const [dr, dc] of [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
    ] as const) {
      iceHits.add(key(r + dr, c + dc));
    }
  }

  for (const k of iceHits) {
    if (clear.has(k)) continue;
    const [r, c] = k.split(",").map(Number);
    const cell = inBounds(r, c) ? board[r][c] : null;
    if (cell?.ice) cell.ice -= 1;
    if (cell?.blocker) {
      board[r][c] = null;
      score += 80 * combo;
    }
  }

  const cleared: string[] = [];
  for (const k of clear) {
    const [r, c] = k.split(",").map(Number);
    const cell = board[r]?.[c];
    if (!cell) continue;
    if (cell.ice > 0) {
      cell.ice -= 1;
      continue;
    }
    if (cell.blocker) {
      board[r][c] = null;
      score += 80 * combo;
      cleared.push(k);
      continue;
    }
    collected[cell.kind] = (collected[cell.kind] || 0) + 1;
    board[r][c] = null;
    cleared.push(k);
    score += 60 * combo;
  }

  for (const s of spawn) {
    if (!board[s.r][s.c]) {
      board[s.r][s.c] = makeTile(s.kind, { special: s.special });
      specialsMade += 1;
      score += 200 * combo;
    }
  }

  board = gravity(board);
  board = fill(board);
  return { board, cleared, collected, score, specialsMade };
}

export function tryMove(
  board: Board,
  a: { r: number; c: number },
  b: { r: number; c: number },
): ResolveResult | null {
  if (!canSwap(board, a, b)) return null;
  const ca = board[a.r][a.c];
  const cb = board[b.r][b.c];
  const swapped = swapCells(board, a, b);
  const color =
    ca?.special === "color" ? cb?.kind : cb?.special === "color" ? ca?.kind : undefined;
  if (color !== undefined) {
    const prefer = ca?.special === "color" ? b : a;
    return resolveBoard(swapped, { prefer, colorSwapKind: color });
  }
  if (!hasMatches(swapped)) return null;
  return resolveBoard(swapped, { prefer: b });
}

export function hint(board: Board): [{ r: number; c: number }, { r: number; c: number }] | null {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      for (const [dr, dc] of [
        [0, 1],
        [1, 0],
      ] as const) {
        const b = { r: r + dr, c: c + dc };
        if (!inBounds(b.r, b.c)) continue;
        const moved = tryMove(board, { r, c }, b);
        if (moved) return [{ r, c }, b];
      }
    }
  }
  return null;
}

export function shuffleBoard(board: Board): Board {
  const tiles: Cell[] = [];
  const next = cloneBoard(board);
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const cell = next[r][c];
      if (cell && !cell.blocker) {
        tiles.push({ ...cell, ice: cell.ice });
        next[r][c] = null;
      }
    }
  }
  for (let i = tiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
  }
  let k = 0;
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (!next[r][c]) next[r][c] = tiles[k++];
    }
  }
  return next;
}
