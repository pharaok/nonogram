import { KeyboardEvent, RefObject, useEffect, useState } from "react";

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
type KEH = (e: KeyboardEvent) => boolean;

export const useMods = (): [
  Mod[],
  { down: KEH; up: KEH; reset: () => void }
] => {
  const [currMods, setCurrMods] = useState<Mod[]>([]);
  const down = (e: KeyboardEvent) => {
    const key = e.key[0].toUpperCase() + e.key.slice(1);

    let isMod = false;
    const ncm = [...currMods];
    let m: Mod;
    for (m in modKeys) {
      if (modKeys[m].includes(key) && !ncm.includes(m)) {
        ncm.push(m);
        isMod = true;
      }
    }
    setCurrMods(ncm);
    return isMod;
  };
  const up = (e: KeyboardEvent) => {
    const key = e.key[0].toUpperCase() + e.key.slice(1);

    let isMod = false;
    const ncm = [...currMods];
    let m: Mod;
    for (m in modKeys) {
      if (modKeys[m].includes(key)) {
        ncm.splice(ncm.indexOf(m), 1);
        isMod = true;
      }
    }
    setCurrMods(ncm);
    return isMod;
  };
  const reset = () => setCurrMods([]);
  return [currMods, { down, up, reset }];
};
