import { transpose } from "helpers";
import produce from "immer";
import { clueFromRow } from "./clue";

// O(2^(n*m))
export const solveNonogram = (rowClues: number[][], colClues: number[][]) => {
  const [width, height] = [colClues.length, rowClues.length];
  let solutions: number[][][] = [];
  const backtrack = (grid: number[][], i: number) => {
    if (i == width * height) {
      solutions.push(grid);
      return;
    }
    const [y, x] = [Math.floor(i / width), i % width];
    let [rc, cc] = [clueFromRow(grid[y]), clueFromRow(transpose(grid)[x])];
    let [h, w] = [rc.length, cc.length];
    // we can leave the current cell empty if the last line's length is correct
    // and there is enough space left to finish the rest of the clue
    // the minimum space required is the sum of the rest of the clue
    // + the number of lines left - 1
    //     1234 123
    // eg: #### ### = (4 + 3) + 2 - 1 = 8
    if (
      rc[h - 1] === rowClues[y][h - 1] &&
      cc[w - 1] === colClues[x][w - 1] &&
      rowClues[y].slice(h).reduce((r, c) => r + c, 0) +
        Math.max(0, rowClues[y].length - h - 1) <=
        width - x - 1 &&
      colClues[x].slice(w).reduce((r, c) => r + c, 0) +
        Math.max(0, colClues[x].length - w - 1) <=
        height - y - 1
    ) {
      backtrack(grid, i + 1);
    }

    const ng = produce(grid, (draft) => {
      draft[y][x] = 1;
    });
    let [nrc, ncc] = [clueFromRow(ng[y]), clueFromRow(transpose(ng)[x])];
    // we can fill the cell if the current line length will be
    // less than or equal to that of the clue's
    if (
      nrc[nrc.length - 1] <= rowClues[y][nrc.length - 1] &&
      ncc[ncc.length - 1] <= colClues[x][ncc.length - 1]
    ) {
      backtrack(ng, i + 1);
    }
  };
  backtrack(
    Array.from(Array(height), () => Array.from(Array(width), () => 0)),
    0
  );
  return solutions;
};
