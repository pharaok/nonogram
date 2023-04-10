import { transpose } from "helpers";

export const clueFromRow = (row: number[]) => {
  const clue: number[] = [];
  let consecutive = 0;
  row.forEach((cell) => {
    if (cell === 1) consecutive++;
    else {
      if (consecutive) clue.push(consecutive);
      consecutive = 0;
    }
  });
  if (consecutive) clue.push(consecutive);
  return clue;
};

export const rowClues = (grid: number[][]) =>
  grid.map((row) => clueFromRow(row));

export const gridClues = (grid: number[][]): [number[][], number[][]] => [
  rowClues(grid),
  rowClues(transpose(grid)),
];

// returns array of lengths of lines that are surrounded by marks
export const markedClueFromRow = (row: number[]) => {
  const clue: number[] = [];
  let consecutive = 0;
  row.forEach((cell) => {
    if (cell === 2) {
      if (consecutive > 0) clue.push(consecutive);
      consecutive = 0;
    } else if (cell === 1) {
      if (consecutive !== -1) consecutive++;
    } else consecutive = -1;
  });
  if (consecutive > 0) clue.push(consecutive);
  return clue;
};

export const markedRowClues = (grid: number[][]) =>
  grid.map((row) => markedClueFromRow(row));

export const markedGridClues = (grid: number[][]): [number[][], number[][]] => [
  markedRowClues(grid),
  markedRowClues(transpose(grid)),
];
