import { createStore, useStore } from "zustand";
import produce from "immer";
import { createContext, useContext } from "react";
import { NonogramGrid } from "types";
import { plotLine } from "helpers/line";
import { gridClues, markedGridClues } from "helpers";

export interface NonogramState {
  grid: NonogramGrid;
  solution: NonogramGrid;
  colors: string[];
  brushes: number[];
  brushColor: number;
  paint: (points: [number, number][], brush?: number, toggle?: boolean) => void;
  setBrushes: (brushes: number[]) => void;
}

export const createNonogramStore = (
  solution: NonogramGrid,
  grid?: NonogramGrid,
  colors?: string[]
) => {
  return createStore<NonogramState>((set) => ({
    grid: grid ?? Array.from(solution, (row) => Array.from(row, () => 0)),
    solution,
    colors: colors ?? ["white", "black"],
    brushes: [1, 2],
    brushColor: 0,
    paint: (points: [number, number][], brush?: number, toggle = true) =>
      set((state) => {
        const [sx, sy] = points[0];
        return produce(state, (draft) => {
          if (brush !== undefined) {
            draft.brushColor = draft.brushes[brush];
            if (toggle && state.grid[sy][sx] === draft.brushColor)
              draft.brushColor = 0;
          }
          draft.grid[sy][sx] = draft.brushColor;
          for (let i = 0; i + 1 < points.length; i++) {
            plotLine(points[i], points[i + 1], ([x, y]) => {
              draft.grid[y][x] = draft.brushColor;
            });
          }
        });
      }),
    setBrushes: (brushes: number[]) =>
      set((state) =>
        produce(state, (draft) => {
          draft.brushes = brushes;
        })
      ),
  }));
};

export const selectDimensions = (state: NonogramState) => [
  state.grid[0].length,
  state.grid.length,
];
export type Clue = { length: number; isMarked: boolean };
export const selectClues = (state: NonogramState) => {
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

export const NonogramContext = createContext(createNonogramStore([[0]]));

const useNonogramStore = <U>(selector: (state: NonogramState) => U): U => {
  const store = useContext(NonogramContext);
  return useStore(store, selector);
};
export default useNonogramStore;
