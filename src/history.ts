import produce, { Draft } from "immer";
import {
  Mutate,
  StateCreator,
  StoreApi,
  StoreMutatorIdentifier,
} from "zustand";

type SetState<T> = (updater: (draft: Draft<T>) => void) => void;

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
    store.setState = (updater) => {
      set(produce(updater) as (state: T) => T);
    };

    return f(_store.setState, get, _store);
  };

export const history = historyImpl as History;

type Write<T extends object, U extends object> = Omit<T, keyof U> & U;

type Cast<T, U> = T extends U ? T : U;
