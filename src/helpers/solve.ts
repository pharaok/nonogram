import { transpose } from "helpers";
import produce from "immer";
import { clueFromRow } from "./clue";

// the minimum space required is the sum of the clue
// + the gaps between lines
//     1234 123
// eg: #### ### = (4 + 3) + 2 - 1 = 8
const minLength = (clue: number[]) =>
  clue.reduce((r, c) => r + c, 0) + clue.length - 1;

// O(2^(n*m))
export const solveNonogram = (rowClues: number[][], colClues: number[][]) => {
  const [height, width] = [rowClues.length, colClues.length];
  let solutions: number[][][] = [];
  const backtrack = (grid: number[][], i: number) => {
    if (i == width * height) {
      solutions.push(grid);
      return;
    }
    const [y, x] = [Math.floor(i / width), i % width];

    let [rc, cc] = [clueFromRow(grid[y]), clueFromRow(transpose(grid)[x])];
    // we can leave the current cell empty if the last line's length is correct
    // and there is enough space left to finish the rest of the clue
    if (
      rc[rc.length - 1] === rowClues[y][rc.length - 1] &&
      cc[cc.length - 1] === colClues[x][cc.length - 1] &&
      minLength(rowClues[y].slice(rc.length)) <= width - x - 1 &&
      minLength(colClues[x].slice(cc.length)) <= height - y - 1
    ) {
      backtrack(grid, i + 1);
    }

    grid = produce(grid, (draft) => {
      draft[y][x] = 1;
    });
    [rc, cc] = [clueFromRow(grid[y]), clueFromRow(transpose(grid)[x])];
    // we can fill the cell if the current line length will be
    // less than or equal to that of the clue's
    if (
      rc[rc.length - 1] <= rowClues[y][rc.length - 1] &&
      cc[cc.length - 1] <= colClues[x][cc.length - 1]
    ) {
      backtrack(grid, i + 1);
    }
  };
  backtrack(
    Array.from(Array(height), () => Array.from(Array(width), () => 0)),
    0
  );
  return solutions;
};
