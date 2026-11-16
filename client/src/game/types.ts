export const SIZE = 8;
export const KIND_COUNT = 6;

export type Kind = 0 | 1 | 2 | 3 | 4 | 5;
export type Special = "none" | "laser-h" | "laser-v" | "bomb" | "color";

export interface Cell {
  id: string;
  kind: Kind;
  special: Special;
  ice: number;
  blocker: boolean;
}

export type Board = (Cell | null)[][];

export interface LevelConfig {
  id: number;
  chapter: string;
  chapterId: "bit" | "golden" | "next" | "daily" | "endless";
  name: string;
  moves: number;
  targetScore: number;
  collect?: Partial<Record<Kind, number>>;
  ice: number;
  blockers: number;
}

export interface CollectState {
  kind: Kind;
  need: number;
  have: number;
}

export const KIND_META: { id: Kind; key: string; label: string; color: string }[] = [
  { id: 0, key: "psp", label: "PSP", color: "#7c3aed" },
  { id: 1, key: "pad", label: "DualShock", color: "#38bdf8" },
  { id: 2, key: "gb", label: "Game Boy", color: "#34d399" },
  { id: 3, key: "xbox", label: "Xbox", color: "#a3e635" },
  { id: 4, key: "sega", label: "Sega", color: "#f97316" },
  { id: 5, key: "star", label: "Star", color: "#fbbf24" },
];
