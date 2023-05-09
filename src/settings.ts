import produce from "immer";
import { assignIn } from "lodash-es";
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
    cursorUp: string[];
    cursorRight: string[];
    cursorDown: string[];
    cursorLeft: string[];
    erase: string[];
    brush1: string[];
    brush2: string[];
  };
  setColor: (color: Color, value: string) => void;
  setKeys: (action: keyof Settings["keys"], keys: string[]) => void;
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
        cursorLeft: ["ArrowLeft", "h"],
        cursorDown: ["ArrowDown", "j"],
        cursorUp: ["ArrowUp", "k"],
        cursorRight: ["ArrowRight", "l"],
        erase: ["z", "Z", "Backspace"],
        brush1: ["x", "X", " ", "Enter"],
        brush2: ["c", "C"],
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
    }),
    {
      name: "settings-storage",
      merge: (persisted, current) => assignIn(current, persisted),
    }
  )
);
