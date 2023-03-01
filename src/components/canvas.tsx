"use client";

import { clamp, gridToPath } from "helpers";
import { plotLine } from "helpers/line";
import { Dispatch, PointerEvent, SetStateAction, useRef } from "react";
import { NonogramGrid } from "types";
import produce from "immer";

export default function Canvas({
  grid,
  setGrid,
}: {
  grid: NonogramGrid;
  setGrid: Dispatch<SetStateAction<NonogramGrid>>;
}) {
  const painting = useRef(false);
  const brush = useRef(0);
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

  const paint = (...points: [number, number][]) => {
    setGrid((prevGrid: NonogramGrid) =>
      produce(prevGrid, (draft) => {
        draft[points[0][1]][points[0][0]] = brush.current;
        for (let i = 0; i + 1 < points.length; i++) {
          plotLine(points[i], points[i + 1], ([x, y]) => {
            draft[y][x] = brush.current;
          });
        }
      })
    );
    prevCell.current = points[points.length - 1];
  };

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        let [x, y] = eventToCoords(e);
        painting.current = true;
        brush.current = +!grid[y][x];
        paint([x, y]);
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
      }}
      onPointerUp={() => {
        painting.current = false;
      }}
    >
      <path pointerEvents="none" d={gridToPath(grid)} />
    </svg>
  );
}
