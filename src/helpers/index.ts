export * from "./base64";
export * from "./clue";
export * from "./colors";
export * from "./line";
export * from "./path";
export * from "./solve";

export const transpose = <T>(grid: T[][]): T[][] =>
  grid[0].map((_, x) => grid.map((row) => row[x]));
