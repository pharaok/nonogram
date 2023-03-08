"use client";

import type { Property } from "csstype";
import { useRef, useEffect, useState } from "react";

export default function Clue({
  clue,
  direction,
}: {
  clue: number[];
  direction: Property.FlexDirection;
}) {
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
  }, []);

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
          className="border-[1px] border-red-600 rounded aspect-square min-h-0 flex justify-center items-center"
          style={{ fontSize: `${Math.min(1, 2 / n.toString().length)}em` }}
        >
          <span>{n}</span>
        </div>
      ))}
    </div>
  );
}
