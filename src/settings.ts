import produce from "immer";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Settings {
  colors: {
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
  setColor: (color: keyof Settings["colors"], value: string) => void;
  setKeys: (action: keyof Settings["keys"], keys: string[]) => void;
}

export const useSettings = create(
  persist<Settings>(
    (set, get) => ({
      colors: {
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
    { name: "settings-storage" }
  )
);
