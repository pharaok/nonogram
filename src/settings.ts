import produce from "immer";
import { WritableDraft } from "immer/dist/internal";
import { assignIn, isEqual } from "lodash-es";
import { createContext } from "react";
import { KeyCombo } from "types";
import { create, createStore, StateCreator, StoreApi } from "zustand";
import { persist } from "zustand/middleware";

interface Settings {
  settings: {
    colors: {
      background: string;
      backgroundAlt: string;
      foreground: string;
      primary: string;
      secondary: string;
      error: string;
    };
    keys: {
      cursorUp: KeyCombo[];
      cursorRight: KeyCombo[];
      cursorDown: KeyCombo[];
      cursorLeft: KeyCombo[];
      erase: KeyCombo[];
      brush1: KeyCombo[];
      brush2: KeyCombo[];
    };
  };
  set: (recipe: (initalState: WritableDraft<Settings>) => void) => void;
  matchKeys: (keys: KeyCombo) => Key | null;
}
export type Key = keyof Settings["settings"]["keys"];
export type Color = keyof Settings["settings"]["colors"];

const settingsReducer: StateCreator<Settings> = (set, get) => ({
  settings: {
    colors: {
      background: "255 255 255",
      backgroundAlt: "224 224 224",
      foreground: "0 0 0",
      primary: "147 51 234",
      secondary: "37 99 235",
      error: "248 113 113",
    },
    keys: {
      cursorLeft: [
        [[], "ArrowLeft"],
        [[], "H"],
      ],
      cursorDown: [
        [[], "ArrowDown"],
        [[], "J"],
      ],
      cursorUp: [
        [[], "ArrowUp"],
        [[], "K"],
      ],
      cursorRight: [
        [[], "ArrowRight"],
        [[], "L"],
      ],
      erase: [
        [[], "Z"],
        [[], "Backspace"],
      ],
      brush1: [
        [[], "X"],
        [[], " "],
        [[], "Enter"],
      ],
      brush2: [[[], "C"]],
    },
  },
  set: (recipe) => set(produce(get(), recipe)),
  matchKeys: (kc) => {
    const keys = get().settings.keys;
    let action: Key;
    for (action in keys) {
      if (keys[action].some((k) => isEqual(k, kc))) {
        return action;
      }
    }
    return null;
  },
});

export const useSettings = create(
  persist<Settings>(settingsReducer, {
    name: "settings-storage",
    merge: (persisted, current) => assignIn(current, persisted),
  })
);

export const SettingsContext = createContext<StoreApi<Settings> | null>(null);

export const createSettingsStore = () => createStore(settingsReducer);
