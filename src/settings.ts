"use client";

import produce from "immer";
import { WritableDraft } from "immer/dist/internal";
import { isEqual, merge } from "lodash-es";
import { createContext, useContext } from "react";
import { KeyCombo } from "types";
import { StateCreator, StoreApi, createStore, useStore } from "zustand";
import { persist } from "zustand/middleware";

export interface SettingsSlice {
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
      undo: KeyCombo[];
      redo: KeyCombo[];
    };
  };
  set: (recipe: (initalState: WritableDraft<SettingsSlice>) => void) => void;
  matchKeys: (keys: KeyCombo) => Key | null;
}
export type Key = keyof SettingsSlice["settings"]["keys"];
export type Color = keyof SettingsSlice["settings"]["colors"];

export const settingsSlice: StateCreator<SettingsSlice> = (set, get) => ({
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
      undo: [[["Control"], "Z"]],
      redo: [
        [["Control", "Shift"], "Z"],
        [["Control"], "Y"],
      ],
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

export const useSettings = <U>(selector: (settings: SettingsSlice) => U) => {
  const settings = useContext(SettingsContext);
  if (!settings) throw new Error("SettingsContext not found");
  return useStore(settings, selector);
};

export const SettingsContext = createContext<StoreApi<SettingsSlice> | null>(
  null
);

const settings = createStore(
  persist(settingsSlice, {
    name: "settings-storage",
    merge: (persisted, current) => merge(current, persisted),
  })
);

export default settings;
