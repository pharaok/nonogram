import { gridClues, gridToBase64, markedGridClues } from "helpers";
import { plotLine } from "helpers/line";
import { history, HistorySlice } from "history";
import { clamp, isEqual } from "lodash-es";
import { createContext, useContext } from "react";
import { NonogramGrid, Point } from "types";
import { StoreApi, createStore, useStore } from "zustand";

export interface GridSlice {
  grid: NonogramGrid;
  colors: string[];
  brushes: number[];
  brushColor: number;
  cursor: Point;
  paint: (
    points: Point[],
    options?: { color?: number; brush?: number; toggle?: boolean }
  ) => void;
  clear: () => void;
  setGrid: (grid: NonogramGrid) => void;
  setBrushes: (brushes: number[]) => void;
  moveCursorTo: (x: number, y: number) => void;
  moveCursorRelative: (x: number, y: number) => void;
}
export interface NonogramSlice extends GridSlice {
  solution: NonogramGrid;
}

export const createGridSlice = (grid: number[][], colors?: string[]) =>
  history<GridSlice>((set) => ({
    grid: grid,
    colors: colors ?? [
      "rgb(var(--color-background))",
      "rgb(var(--color-foreground))",
    ],
    brushes: [1, 2],
    brushColor: 0,
    cursor: [0, 0],
    paint: (points, options) => {
      let { color, brush, toggle = true } = options ?? {};
      const [sx, sy] = points[0];
      return set((draft) => {
        if (color !== undefined) draft.brushColor = color;
        else if (brush !== undefined) draft.brushColor = draft.brushes[brush];

        if (toggle && draft.grid[sy][sx] === draft.brushColor)
          draft.brushColor = 0;

        draft.grid[sy][sx] = draft.brushColor;
        for (let i = 0; i + 1 < points.length; i++) {
          plotLine(points[i], points[i + 1], ([x, y]) => {
            draft.grid[y][x] = draft.brushColor;
          });
        }
      }, true);
    },
    clear: () =>
      set((draft) => {
        draft.grid = Array.from(draft.grid, (row) => Array.from(row, () => 0));
      }, true),
    setGrid: (grid) =>
      set((draft) => {
        draft.grid = grid;
      }, true),
    setBrushes: (brushes) =>
      set((draft) => {
        draft.brushes = brushes;
      }),
    moveCursorTo: (x, y) =>
      set((draft) => {
        draft.cursor = [x, y];
      }),
    moveCursorRelative: (x, y) =>
      set((draft) => {
        const dimensions = selectDimensions(draft);
        draft.cursor = draft.cursor.map((a, i) =>
          clamp(a + [x, y][i], 0, dimensions[i] - 1)
        ) as Point;
      }),
  }));

export const createNonogramStore = (
  solution: NonogramGrid,
  grid?: NonogramGrid,
  colors?: string[]
) =>
  createStore<NonogramSlice & HistorySlice>((set, get, store) => ({
    solution: solution,
    ...createGridSlice(
      grid ?? Array.from(solution, (row) => Array.from(row).fill(0)),
      colors
    )(set, get, store),
  }));

export const selectDimensions = (state: GridSlice): [number, number] => [
  state.grid[0].length,
  state.grid.length,
];
export type Clue = { length: number; isMarked: boolean };
export const selectClues = (state: NonogramSlice) => {
  const clues = gridClues(state.solution);
  const markedClues = markedGridClues(state.grid);

  const newClues: [Clue[][], Clue[][]] = [
    Array(clues[0].length),
    Array(clues[1].length),
  ];
  for (let a = 0; a < 2; a++) {
    for (let i = 0; i < newClues[a].length; i++) {
      newClues[a][i] = Array(clues[a][i].length);
      let mi = 0;
      for (let j = 0; j < newClues[a][i].length; j++) {
        const isMarked = markedClues[a][i][mi] === clues[a][i][j];
        if (isMarked) mi++;
        newClues[a][i][j] = { length: clues[a][i][j], isMarked };
      }
    }
    // TODO:? mark row/col as impossible
    // if markedClues[a][i] isn't a subsequence of clues[a][i]
    // or the number of colored cells is greater than that of the clue
    // or if a line is longer than the longest clue
  }

  return newClues;
};
export const selectIsSolved = (state: NonogramSlice) =>
  isEqual(gridClues(state.grid), gridClues(state.solution));
export const selectSeed = (state: NonogramSlice) =>
  gridToBase64(state.solution);

export const GridContext = createContext<StoreApi<
  GridSlice & HistorySlice
> | null>(null);
export const NonogramContext = createContext(createNonogramStore([[0]]));

const useNonogramStore = <U>(
  selector: (state: NonogramSlice & HistorySlice) => U
): U => {
  const store = useContext(NonogramContext);
  return useStore(store, selector);
};
export default useNonogramStore;
