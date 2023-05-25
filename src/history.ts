import produce, { Draft, enablePatches, produceWithPatches } from "immer";
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
      S extends { getState: () => infer T } ? { setState: SetState<T> } : never
    >;
  }
}

type History = <
  T,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = []
>(
  config: StateCreator<T, [...Mps, ["history", never]], Mcs>
) => StateCreator<T, Mps, Mcs>;

const historyImpl =
  <T>(f: StateCreator<T>): StateCreator<T> =>
  (set, get, _store) => {
    const store = _store as Mutate<StoreApi<T>, [["history", never]]>;
    store.setState = (updater, track = false) => {
      let [nextState, patches, inversePatches] = produceWithPatches(
        get(),
        updater
      );
      if (track) console.log(patches, inversePatches);
      set(nextState);
    };

    return f(_store.setState, get, _store);
  };

export const history = historyImpl as History;

type Write<T extends object, U extends object> = Omit<T, keyof U> & U;

type Cast<T, U> = T extends U ? T : U;
