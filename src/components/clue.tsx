"use client";

import type { Property } from "csstype";
import { useRef, useEffect, useState, memo } from "react";
import { isEqual } from "lodash-es";
import { Clue } from "store";

interface Props {
  clue: Clue[];
  direction: Property.FlexDirection;
}

export default memo(
  function Clue({ clue, direction }: Props) {
    const clueEl = useRef(null);
    const [fontSize, setFontSize] = useState(0);

    useEffect(() => {
      const resizeObserver = new ResizeObserver((entries) => {
        const contentRect = entries[0].contentRect;
        const length = direction.includes("row")
          ? contentRect.height
          : contentRect.width;
        setFontSize((length * 2) / 3);
      });
      resizeObserver.observe(clueEl.current!);
      return () => {
        resizeObserver.disconnect();
      };
    }, [direction]);
    return (
      <div
        className={`flex h-full w-full justify-end`}
        style={{
          flexDirection: direction,
          fontSize: fontSize,
        }}
        ref={clueEl}
      >
        {clue.map((c, i) => (
          <div
            key={i}
            className={`flex aspect-square min-h-0 items-center justify-center rounded ${
              c.isMarked ? "text-gray-400" : ""
            }`}
            style={{
              fontSize: `${Math.min(1, 2 / c.length.toString().length)}em`,
            }}
          >
            <span>{c.length}</span>
          </div>
        ))}
      </div>
    );
  },
  (oldProps: Props, newProps: Props) => isEqual(oldProps, newProps)
);
