"use client";

import { clamp, gridToPath } from "helpers";
import { line } from "helpers/line";
import produce from "immer";
import { Dispatch, PointerEvent, SetStateAction, useRef } from "react";
import { NonogramGrid } from "types";

export default ({
  grid,
  setGrid,
}: {
  grid: NonogramGrid;
  setGrid: Dispatch<SetStateAction<NonogramGrid>>;
}) => {
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

  const paint = (...points: [number, number][]) => {
    prevCell.current = points[0];
    setGrid((prevGrid: NonogramGrid) =>
      produce(prevGrid, (draft) => {
        for (let i = 0; i + 1 < points.length; i++) {
          line(points[i], points[i + 1], ([x, y]) => {
            draft[y][x] = 1;
          });
          prevCell.current = points[i + 1];
        }
      })
    );
  };

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        paint(eventToCoords(e));
        painting.current = true;
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
      <path d={gridToPath(grid)} />
    </svg>
  );
};
