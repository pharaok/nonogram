"use client";

import { clamp, gridToPath } from "helpers";
import produce from "immer";
import { PointerEvent, useRef } from "react";
import { NonogramGrid } from "types";

export default ({
  grid,
  setGrid,
}: {
  grid: NonogramGrid;
  setGrid: (grid: NonogramGrid) => void;
}) => {
  const painting = useRef(false);
  const prevCell = useRef([0, 0]);
  const width = grid[0].length;
  const height = grid.length;

  const eventToCoords = (e: PointerEvent): [number, number] => {
    const ratioX = e.clientX / e.currentTarget.clientWidth;
    const ratioY = e.clientY / e.currentTarget.clientHeight;
    const cellX = clamp(Math.floor(ratioX * width), 0, width - 1);
    const cellY = clamp(Math.floor(ratioY * height), 0, height - 1);
    return [cellX, cellY];
  };

  const paintCell = (x: number, y: number) => {
    setGrid(
      produce(grid, (draft) => {
        draft[y][x] = 1;
      })
    );
    prevCell.current = [x, y];
  };

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        painting.current = true;
        paintCell(...eventToCoords(e));
      }}
      onPointerMove={(e) => {
        // TODO: fill in the gaps when events aren't fast enough
        const coords = eventToCoords(e);
        if (
          !painting.current ||
          (coords[0] == prevCell.current[0] && coords[1] == prevCell.current[1])
        ) {
          return;
        }
        paintCell(...coords);
      }}
      onPointerUp={() => {
        painting.current = false;
      }}
    >
      <path d={gridToPath(grid)} />
    </svg>
  );
};
