"use client";

import type { Property } from "csstype";
import { useRef, useEffect, useState, memo } from "react";

interface Props {
  clue: number[];
  direction: Property.FlexDirection;
}

export default memo(
  function Clue({ clue, direction }: Props) {
    const clueEl = useRef(null);
    const resizeObserver = useRef<ResizeObserver | null>(null);
    const [fontSize, setFontSize] = useState(0);

    useEffect(() => {
      resizeObserver.current = new ResizeObserver((entries) => {
        const contentRect = entries[0].contentRect;
        const length = direction.includes("row")
          ? contentRect.height
          : contentRect.width;
        setFontSize((length * 2) / 3);
      });
      resizeObserver.current.observe(clueEl.current!);
      return () => {
        resizeObserver.current?.disconnect();
      };
    }, [direction]);

    return (
      <div
        className="flex w-full h-full justify-end"
        style={{
          flexDirection: direction,
          fontSize: fontSize,
        }}
        ref={clueEl}
      >
        {clue.map((n, i) => (
          <div
            key={i}
            className="rounded aspect-square min-h-0 flex justify-center items-center"
            style={{ fontSize: `${Math.min(1, 2 / n.toString().length)}em` }}
          >
            <span>{n}</span>
          </div>
        ))}
      </div>
    );
  },
  (oldProps: Props, newProps: Props) =>
    oldProps.direction == newProps.direction &&
    newProps.clue.length == newProps.clue.length &&
    oldProps.clue.every((a, i) => a == newProps.clue[i])
);
