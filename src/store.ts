import { createStore, useStore } from "zustand";
import produce from "immer";
import { createContext, useContext } from "react";
import { NonogramGrid } from "types";
import { plotLine } from "helpers/line";

export interface NonogramState {
  grid: NonogramGrid;
  brush: number;
  paint: (...points: [number, number][]) => void;
  setBrush: (brush: number) => void;
}

export const createNonogramStore = (grid: NonogramGrid) => {
  return createStore<NonogramState>((set) => ({
    grid,
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

export const NonogramContext = createContext(createNonogramStore([[0]]));

const useNonogramStore = <U>(selector: (state: NonogramState) => U): U => {
  const store = useContext(NonogramContext);
  return useStore(store, selector);
};
export default useNonogramStore;
