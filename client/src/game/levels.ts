import type { Kind, LevelConfig } from "./types";

const BIT = "8-Bit Era";
const GOLD = "PS1 & PSP Golden Age";
const NEXT = "Next-Gen Retro";

function L(
  id: number,
  chapter: string,
  chapterId: LevelConfig["chapterId"],
  name: string,
  moves: number,
  targetScore: number,
  extra: Partial<LevelConfig> = {},
): LevelConfig {
  return {
    id,
    chapter,
    chapterId,
    name,
    moves,
    targetScore,
    ice: 0,
    blockers: 0,
    ...extra,
  };
}

export const CAMPAIGN: LevelConfig[] = [
  L(1, BIT, "bit", "Boot Screen", 25, 1800),
  L(2, BIT, "bit", "Cartridge Click", 24, 2400, { collect: { 2: 10 } }),
  L(3, BIT, "bit", "Ice Age 8-bit", 22, 2800, { ice: 8 }),
  L(4, BIT, "bit", "PSP Hunt", 22, 3200, { collect: { 0: 12 } }),
  L(5, BIT, "bit", "Frozen Arcade", 20, 3600, { ice: 12, collect: { 5: 8 } }),
  L(6, BIT, "bit", "Damaged Tapes", 20, 4000, { blockers: 4, ice: 6 }),
  L(7, BIT, "bit", "Combo Lab", 18, 4800, { ice: 10 }),
  L(8, BIT, "bit", "8-Bit Boss", 16, 5600, { ice: 14, blockers: 4, collect: { 2: 8, 4: 8 } }),

  L(9, GOLD, "golden", "PS1 Startup", 24, 5000),
  L(10, GOLD, "golden", "DualShock Dash", 22, 5600, { collect: { 1: 15 } }),
  L(11, GOLD, "golden", "PSP Golden", 20, 6200, { collect: { 0: 15 }, ice: 8 }),
  L(12, GOLD, "golden", "Memory Card", 20, 6800, { ice: 12, blockers: 5 }),
  L(13, GOLD, "golden", "Umd Shuffle", 18, 7400, { collect: { 0: 10, 1: 10 } }),
  L(14, GOLD, "golden", "Crash Combo", 18, 8000, { ice: 16 }),
  L(15, GOLD, "golden", "Frozen City", 16, 8600, { ice: 18, blockers: 6 }),
  L(16, GOLD, "golden", "Golden Boss", 15, 9800, { ice: 16, blockers: 6, collect: { 1: 12, 5: 10 } }),

  L(17, NEXT, "next", "HDMI Glow", 22, 9000),
  L(18, NEXT, "next", "Xbox Pulse", 20, 9800, { collect: { 3: 16 } }),
  L(19, NEXT, "next", "Ice Grid", 18, 10800, { ice: 20 }),
  L(20, NEXT, "next", "Brick Wall", 18, 11800, { blockers: 8, ice: 10 }),
  L(21, NEXT, "next", "Mixed Hunt", 16, 12800, { collect: { 3: 10, 4: 10, 0: 8 } }),
  L(22, NEXT, "next", "Deep Freeze", 15, 13800, { ice: 22, blockers: 6 }),
  L(23, NEXT, "next", "Overclock", 14, 15000, { ice: 18, blockers: 8 }),
  L(24, NEXT, "next", "Next-Gen Boss", 12, 17000, { ice: 20, blockers: 8, collect: { 3: 12, 1: 10 } }),
];

export function hashString(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function proceduralLevel(id: number, seed = id): LevelConfig {
  const rng = hashString(`lvl-${seed}`);
  const wave = id - CAMPAIGN.length;
  const moves = Math.max(10, 22 - Math.floor(wave / 3));
  const targetScore = 1800 + id * 720 + (rng % 400);
  const ice = Math.min(24, 4 + Math.floor(id * 0.7) + (rng % 5));
  const blockers = Math.min(10, Math.floor(id / 5) + (rng % 3));
  const collect: Partial<Record<Kind, number>> = {};
  if (id % 2 === 0) collect[(rng % 6) as Kind] = 8 + (id % 10);
  if (id % 3 === 0) collect[(((rng >> 3) % 6) as Kind)] = 6 + (id % 8);
  return {
    id,
    chapter: "Endless Arcade",
    chapterId: "endless",
    name: `Wave ${id}`,
    moves,
    targetScore,
    collect: Object.keys(collect).length ? collect : undefined,
    ice,
    blockers,
  };
}

export function getLevel(id: number): LevelConfig {
  const preset = CAMPAIGN.find((l) => l.id === id);
  if (preset) return preset;
  return proceduralLevel(id);
}

export function dailyLevel(): LevelConfig {
  const d = new Date();
  const key = `${d.getUTCFullYear()}-${d.getUTCMonth() + 1}-${d.getUTCDate()}`;
  const seed = hashString(key);
  const base = proceduralLevel(12 + (seed % 16), seed);
  return {
    ...base,
    id: 0,
    chapter: "Daily Challenge",
    chapterId: "daily",
    name: `Daily ${key}`,
    moves: 18,
    targetScore: 7000 + (seed % 4000),
    ice: 10 + (seed % 10),
    blockers: 3 + (seed % 5),
    collect: { [(seed % 6) as Kind]: 12, [((seed >> 4) % 6) as Kind]: 10 },
  };
}

export function nextLevelId(current: number) {
  return current <= 0 ? 1 : current + 1;
}
