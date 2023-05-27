import produce, {
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
  T extends object,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = []
>(
  config: StateCreator<T, [...Mps, ["history", never]], Mcs>
) => StateCreator<T & HistorySlice, Mps, Mcs>;

export interface HistorySlice {
  history: [Patch[], Patch[]][];
}

const historyImpl =
  <T extends HistorySlice>(f: StateCreator<T>): StateCreator<T> =>
  (set, get, _store) => {
    const store = _store as Mutate<StoreApi<T>, [["history", never]]>;
    store.setState = (updater, track = false) => {
      console.log("we minor");
      let [nextState, patches, inversePatches] = produceWithPatches(
        get(),
        updater
      );
      if (track) {
        nextState = produce(nextState, (draft) => {
          draft.history.push([patches, inversePatches]);
        });
      }
      set(nextState);
    };

    return { ...f(_store.setState, _store.getState, _store), history: [] };
  };

export const history = historyImpl as History;
