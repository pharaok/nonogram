import { createStore, useStore } from "zustand";
import produce from "immer";
import { createContext, useContext } from "react";
import { NonogramGrid } from "types";
import { plotLine } from "helpers/line";
import { gridClues } from "helpers";

export interface NonogramState {
  grid: NonogramGrid;
  solution: NonogramGrid;
  brush: number;
  paint: (...points: [number, number][]) => void;
  setBrush: (brush: number) => void;
}

export const createNonogramStore = (
  solution: NonogramGrid,
  grid?: NonogramGrid
) => {
  return createStore<NonogramState>((set) => ({
    grid: grid ?? Array.from(solution, (row) => Array.from(row, () => 0)),
    solution,
    brush: 1,
    paint: (...points: [number, number][]) =>
      set((state) =>
        produce(state, (draft) => {
          const brush = state.brush;
          draft.grid[points[0][1]][points[0][0]] = brush;
          for (let i = 0; i + 1 < points.length; i++) {
            plotLine(points[i], points[i + 1], ([x, y]) => {
              draft.grid[y][x] = brush;
            });
          }
        })
      ),
    setBrush: (brush: number) =>
      set((state) =>
        produce(state, (draft) => {
          draft.brush = brush;
        })
      ),
  }));
};

export const selectDimensions = (state: NonogramState) => [
  state.grid[0].length,
  state.grid.length,
];
export const selectClues = (state: NonogramState) => gridClues(state.solution);

export const NonogramContext = createContext(createNonogramStore([[0]]));

const useNonogramStore = <U>(selector: (state: NonogramState) => U): U => {
  const store = useContext(NonogramContext);
  return useStore(store, selector);
};
export default useNonogramStore;
