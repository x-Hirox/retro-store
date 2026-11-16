import { useRef, type PointerEvent } from "react";
import Tile from "./Tile";
import { SIZE, type Board } from "./types";

interface Props {
  board: Board;
  selected: { r: number; c: number } | null;
  popping: Set<string>;
  locked: boolean;
  onSwap: (a: { r: number; c: number }, b: { r: number; c: number }) => void;
  onSelect: (pos: { r: number; c: number } | null) => void;
}

export default function GameBoard({ board, selected, popping, locked, onSwap, onSelect }: Props) {
  const start = useRef<{ r: number; c: number; x: number; y: number } | null>(null);

  const at = (r: number, c: number) => ({ r, c });

  const handleDown = (r: number, c: number, e: PointerEvent<HTMLButtonElement>) => {
    if (locked) return;
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    start.current = { r, c, x: e.clientX, y: e.clientY };
    if (selected && (selected.r !== r || selected.c !== c)) {
      onSwap(selected, at(r, c));
      onSelect(null);
    } else {
      onSelect(at(r, c));
    }
  };

  const handleUp = (e: PointerEvent<HTMLDivElement>) => {
    const s = start.current;
    start.current = null;
    if (!s || locked) return;
    const dx = e.clientX - s.x;
    const dy = e.clientY - s.y;
    if (Math.abs(dx) < 22 && Math.abs(dy) < 22) return;
    const dir =
      Math.abs(dx) > Math.abs(dy)
        ? { r: s.r, c: s.c + (dx > 0 ? 1 : -1) }
        : { r: s.r + (dy > 0 ? 1 : -1), c: s.c };
    onSwap(at(s.r, s.c), dir);
    onSelect(null);
  };

  return (
    <div
      className="mg-board"
      onPointerUp={handleUp}
      onPointerCancel={() => {
        start.current = null;
      }}
    >
      {Array.from({ length: SIZE }, (_, r) =>
        Array.from({ length: SIZE }, (_, c) => (
          <Tile
            key={board[r][c]?.id || `${r}-${c}`}
            cell={board[r][c]}
            selected={selected?.r === r && selected?.c === c}
            popping={popping.has(`${r},${c}`)}
            onPointerDown={(e) => handleDown(r, c, e)}
          />
        )),
      )}
    </div>
  );
}
