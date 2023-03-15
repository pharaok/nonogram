import { transpose } from "helpers";

export const clueFromRow = (row: number[]) => {
  const clue: number[] = [];
  let consecutive = 0;
  let prevCell: number | null = null;
  row.slice(0).forEach((cell) => {
    if (cell !== prevCell && consecutive) {
      clue.push(consecutive);
      consecutive = 0;
    }
    if (cell) consecutive++;
    prevCell = cell;
  });
  if (consecutive) {
    clue.push(consecutive);
  }
  return clue;
};

export const rowClues = (grid: number[][]) =>
  grid.map((row) => clueFromRow(row));

export const gridClues = (grid: number[][]): [number[][], number[][]] => [
  grid.map((row) => clueFromRow(row)),
  transpose(grid).map((col) => clueFromRow(col)),
];
