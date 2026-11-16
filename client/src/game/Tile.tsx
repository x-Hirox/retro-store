import type { PointerEvent } from "react";
import { SpecialMark, TileIcon } from "./TileIcons";
import type { Cell } from "./types";

interface Props {
  cell: Cell | null;
  selected: boolean;
  popping: boolean;
  onPointerDown: (e: PointerEvent<HTMLButtonElement>) => void;
}

export default function Tile({ cell, selected, popping, onPointerDown }: Props) {
  if (!cell) return <div className="mg-slot" />;
  if (cell.blocker) {
    return (
      <button type="button" className="mg-slot" onPointerDown={onPointerDown}>
        <span className="mg-candy blocker">
          <span className="mg-cart">▤</span>
        </span>
      </button>
    );
  }
  return (
    <button type="button" className="mg-slot" onPointerDown={onPointerDown}>
      <span
        className={`mg-candy k${cell.kind}${selected ? " selected" : ""}${popping ? " pop" : ""}${cell.ice ? " ice" : ""}`}
      >
        <TileIcon kind={cell.kind} special={cell.special} />
        <SpecialMark special={cell.special} />
        {cell.ice > 0 && <span className="mg-ice">{cell.ice === 2 ? "❄❄" : "❄"}</span>}
      </span>
    </button>
  );
}
