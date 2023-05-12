import produce from "immer";
import { assignIn, isEqual } from "lodash-es";
import { KeyCombo } from "types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Settings {
  colors: {
    background: string;
    backgroundAlt: string;
    foreground: string;
    primary: string;
    secondary: string;
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
  setColor: (color: Color, value: string) => void;
  setKeys: (action: keyof Settings["keys"], keys: KeyCombo[]) => void;
  matchKeys: (keys: KeyCombo) => keyof Settings["keys"] | null;
}
export type Color = keyof Settings["colors"];

export const useSettings = create(
  persist<Settings>(
    (set, get) => ({
      colors: {
        background: "255 255 255",
        backgroundAlt: "224 224 224",
        foreground: "0 0 0",
        primary: "147 51 234",
        secondary: "37 99 235",
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
      setKeys: (action, keys) =>
        set(
          produce(get(), (draft) => {
            draft.keys[action] = keys;
          })
        ),
      setColor: (color, value) => {
        return set(
          produce(get(), (draft) => {
            draft.colors[color] = value;
          })
        );
      },
      matchKeys: (keys) => {
        const state = get();
        let action: keyof Settings["keys"];
        for (action in state.keys) {
          if (state.keys[action].some((k) => isEqual(k, keys))) {
            return action;
          }
        }
        return null;
      },
    }),
    {
      name: "settings-storage",
      merge: (persisted, current) => assignIn(current, persisted),
    }
  )
);
