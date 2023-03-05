export * from "./path";
export * from "./clue";
export * from "./line";

export const transpose = <T>(grid: T[][]): T[][] =>
  grid[0].map((_, x) => grid.map((row) => row[x]));

export const clamp = (n: number, min: number, max: number) =>
  Math.min(Math.max(n, min), max);
