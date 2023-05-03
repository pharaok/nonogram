import produce from "immer";
import { create } from "zustand";

interface Keys {
  cursorUp: string[];
  cursorRight: string[];
  cursorDown: string[];
  cursorLeft: string[];
  erase: string[];
  brush1: string[];
  brush2: string[];
}

interface Settings {
  keys: Keys;
  setKeys: (action: keyof Keys, keys: string[]) => void;
}

export const useSettings = create<Settings>((set) => ({
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
    set((state) =>
      produce(state, (draft) => {
        draft.keys[action] = keys;
      })
    ),
}));
