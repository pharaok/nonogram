import produce from "immer";
import { isEqual } from "lodash-es";
import { RefObject, useEffect, useState } from "react";
import { KeyCombo } from "types";

export const useParentDimensions = (ref: RefObject<HTMLElement>) => {
  const [dimensions, setDimensions] = useState([0, 0]);
  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setDimensions([width, height].map(Math.floor));
    });
    resizeObserver.observe(ref.current!.parentElement!);
    return () => {
      resizeObserver.disconnect();
    };
  }, [ref]);
  return dimensions;
};

const modKeys = {
  Alt: ["Alt"],
  Control: ["Control"],
  Meta: ["Meta", "OS"],
  Shift: ["Shift"],
};

type Mod = keyof typeof modKeys;

export const isMod = (key: string) =>
  ([] as string[]).concat(...Object.values(modKeys)).includes(key);

export const useMods = (element: HTMLElement | null): Mod[] => {
  const [mods, setMods] = useState<Mod[]>([]);

  useEffect(() => {
    if (element === null) return;
    const down = (e: KeyboardEvent) => {
      const key = e.key[0].toUpperCase() + e.key.slice(1);

      setMods(
        produce((draft) => {
          (Object.keys(modKeys) as (keyof typeof modKeys)[]).forEach((m) => {
            if (modKeys[m].includes(key) && !draft.includes(m)) draft.push(m);
          });
        })
      );
    };
    const up = (e: KeyboardEvent) => {
      const key = e.key[0].toUpperCase() + e.key.slice(1);

      setMods(
        produce((draft) => {
          (Object.keys(modKeys) as (keyof typeof modKeys)[]).forEach((m) => {
            if (modKeys[m].includes(key)) draft.splice(draft.indexOf(m), 1);
          });
        })
      );
    };
    const blur = () => setMods([]);

    element.addEventListener("keydown", down);
    element.addEventListener("keyup", up);
    element.addEventListener("blur", blur);
    return () => {
      element.removeEventListener("keydown", down);
      element.removeEventListener("keyup", up);
      element.removeEventListener("blur", blur);
    };
  }, [mods, setMods, element]);
  return mods;
};
