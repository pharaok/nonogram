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

// TODO: create clues incrementally instead of generating them from scratch each time
export const solveNonogram = (
  rowClues: number[][],
  colClues: number[][],
  grid?: number[][]
) => {
  const canLeaveBlank = (x: number, y: number, rc: number[], cc: number[]) =>
    // current line is complete
    rc[rc.length - 1] === rowClues[y][rc.length - 1] &&
    cc[cc.length - 1] === colClues[x][cc.length - 1] &&
    // enough space left in row/col to finish the rest of the line
    minLength(rowClues[y].slice(rc.length)) <= width - 1 - x &&
    minLength(colClues[x].slice(cc.length)) <= height - 1 - y;

  const canColor = (x: number, y: number, rc: number[], cc: number[]) =>
    // current line isn't longer than the clue
    rc[rc.length - 1] <= rowClues[y][rc.length - 1] &&
    cc[cc.length - 1] <= colClues[x][cc.length - 1];

  const [height, width] = [rowClues.length, colClues.length];
  let solutions: number[][][] = [];
  const backtrack = (grid: number[][], i: number) => {
    if (i === width * height) {
      solutions.push(grid);
      return;
    }
    const [y, x] = [Math.floor(i / width), i % width];
    if (grid[y][x] !== undefined) {
      let [rc, cc] = [
        clueFromRow(grid[y].slice(0, x + 1)),
        clueFromRow(transpose(grid)[x].slice(0, y + 1)),
      ];
      if (
        (grid[y][x] === 0 && canLeaveBlank(x, y, rc, cc)) ||
        (grid[y][x] === 1 && canColor(x, y, rc, cc))
      ) {
        backtrack(grid, i + 1);
      }
      return;
    }

    grid = produce(grid, (draft) => {
      draft[y][x] = 0;
    });
    let [rc, cc] = [
      clueFromRow(grid[y].slice(0, x + 1)),
      clueFromRow(transpose(grid)[x].slice(0, y + 1)),
    ];
    // we can leave the current cell empty if the last line's length is correct
    // and there is enough space left to finish the rest of the clue
    if (canLeaveBlank(x, y, rc, cc)) {
      backtrack(grid, i + 1);
    }

    grid = produce(grid, (draft) => {
      draft[y][x] = 1;
    });
    [rc, cc] = [
      clueFromRow(grid[y].slice(0, x + 1)),
      clueFromRow(transpose(grid)[x].slice(0, y + 1)),
    ];
    // we can fill the cell if the current line length will be
    // less than or equal to that of the clue's
    if (canColor(x, y, rc, cc)) {
      backtrack(grid, i + 1);
    }
  };
  backtrack(
    grid ?? Array.from(Array(height), () => Array.from(Array(width))),
    0
  );
  return solutions;
};
