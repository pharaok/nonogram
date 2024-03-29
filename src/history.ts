import produce, {
  applyPatches,
  Draft,
  enablePatches,
  Patch,
  produceWithPatches,
} from "immer";
import { Write, Cast } from "types";
import {
  Mutate,
  StateCreator,
  StoreApi,
  StoreMutatorIdentifier,
} from "zustand";

// HACK: https://github.com/pmndrs/zustand/discussions/1851#discussioncomment-6130207
import { persist } from "zustand/middleware";

enablePatches();

type SetState<T> = (
  updater: (draft: Draft<T>) => void,
  track?: boolean
) => void;

declare module "zustand" {
  interface StoreMutators<S, A> {
    history: Write<
      Cast<S, object>,
      S extends { getState: () => infer T }
        ? {
            getState: () => T & HistorySlice;
            setState: SetState<T & HistorySlice>;
          }
        : never
    >;
  }
}

type History = <
  T,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = []
>(
  config: StateCreator<T, [...Mps, ["history", never]], Mcs>
) => StateCreator<T & HistorySlice, Mps, Mcs>;

export interface HistorySlice {
  history: [Patch[], Patch[]][];
  historyIndex: number;
  undo: () => void;
  redo: () => void;
}

const historySlice: StateCreator<HistorySlice> = (set, get) => ({
  history: [],
  historyIndex: 0,
  undo: () => {
    const state = get();
    if (!selectCanUndo(state)) return;
    set(
      produce(state, (draft) => {
        applyPatches(draft, draft.history[--draft.historyIndex][1]);
      })
    );
  },
  redo: () => {
    const state = get();
    if (!selectCanRedo(state)) return;
    set(
      produce(state, (draft) => {
        applyPatches(draft, draft.history[draft.historyIndex++][0]);
      })
    );
  },
});

export const selectCanUndo = <T extends HistorySlice>(state: T) =>
  state.historyIndex > 0;
export const selectCanRedo = <T extends HistorySlice>(state: T) =>
  state.historyIndex < state.history.length;

const historyImpl =
  <T extends HistorySlice>(f: StateCreator<T>): StateCreator<T> =>
  (set, get, _store) => {
    const store = _store as Mutate<StoreApi<T>, [["history", never]]>;
    store.setState = (updater, track = false) => {
      let [nextState, patches, inversePatches] = produceWithPatches(
        get(),
        updater
      );
      if (track && patches.length > 0) {
        nextState = produce(nextState, (draft) => {
          draft.history = draft.history.slice(0, draft.historyIndex);
          draft.history.push([patches, inversePatches]);
          draft.historyIndex++;
        });
      }
      set(nextState);
    };

    return {
      ...f(_store.setState, get, _store),
      ...historySlice(set, get, _store),
    };
  };

export const history = historyImpl as History;
