import { RefObject, useEffect, useState } from "react";

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
  }, []);
  return dimensions;
};
