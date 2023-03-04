"use client";

import { clamp, gridToPath } from "helpers";
import { PointerEvent, useRef } from "react";
import useNonogramStore from "store";

export default function Canvas() {
  const grid = useNonogramStore((state) => state.grid);
  const setBrush = useNonogramStore((state) => state.setBrush);
  const paint = useNonogramStore((state) => state.paint);

  const painting = useRef(false);
  const prevCell = useRef<[number, number]>([0, 0]);
  const width = grid[0].length;
  const height = grid.length;

  const eventToCoords = (e: PointerEvent): [number, number] => {
    const ratioX = e.clientX / e.currentTarget.clientWidth;
    const ratioY = e.clientY / e.currentTarget.clientHeight;
    const cellX = clamp(Math.floor(ratioX * width), 0, width - 1);
    const cellY = clamp(Math.floor(ratioY * height), 0, height - 1);
    return [cellX, cellY];
  };

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      shapeRendering="crispEdges"
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        let [x, y] = eventToCoords(e);
        painting.current = true;
        setBrush(+!grid[y][x]);
        paint([x, y]);
        prevCell.current = [x, y];
      }}
      onPointerMove={(e) => {
        const coords = eventToCoords(e);
        if (
          !painting.current ||
          (coords[0] == prevCell.current[0] && coords[1] == prevCell.current[1])
        ) {
          return;
        }
        paint(prevCell.current, coords);
        prevCell.current = coords;
      }}
      onPointerUp={() => {
        painting.current = false;
      }}
    >
      <path pointerEvents="none" d={gridToPath(grid)} />
    </svg>
  );
}
