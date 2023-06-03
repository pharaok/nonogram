"use client";

import Canvas from "components/canvas";
import NumberInput from "components/numberInput";
import { plotLine } from "helpers";
import { Rect } from "helpers/canvas";
import produce from "immer";
import { clamp, isEqual } from "lodash-es";
import { useEffect, useRef, useState } from "react";
import { EntriesOf, Point } from "types";

export default function Editor() {
  const cursor = useRef<Point>([0, 0]);
  const brush = useRef(1);
  const [dimensions, setDimensions] = useState({ width: 10, height: 10 });
  const [grid, setGrid] = useState(
    [...Array(dimensions.height)].map(() => Array(dimensions.width).fill(0))
  );
  useEffect(() => {
    setGrid((grid) =>
      [...Array(dimensions.height)].map((_, y) =>
        Array(dimensions.width)
          .fill(0)
          .map((v, x) => grid?.[y]?.[x] ?? v)
      )
    );
  }, [dimensions]);
  return (
    <main className="relative flex-1">
      <div className="items center absolute inset-0 flex flex-col items-center justify-evenly gap-8 p-4 md:flex-row md:p-8">
        <div className="flex aspect-square max-h-full max-w-full items-center justify-center  overflow-hidden">
          <div
            className="relative max-h-full max-w-full overflow-hidden"
            style={{
              aspectRatio: `${dimensions.width} / ${dimensions.height}`,
            }}
          >
            <Canvas
              className="absolute h-full w-full touch-none border border-foreground"
              viewBox={[0, 0, dimensions.width, dimensions.height]}
              onPointerDown={(e, coords) => {
                const [x, y] = coords;
                brush.current = +!grid[y][x];
                setGrid(
                  produce((draft) => {
                    draft[y][x] = brush.current;
                  })
                );
                e.currentTarget.setPointerCapture(e.pointerId);
                cursor.current = coords;
              }}
              onPointerMove={(e, coords) => {
                if (!e.buttons) return;
                if (isEqual(coords, cursor.current)) return;
                coords = coords.map((c, i) =>
                  clamp(c, 0, [dimensions.width, dimensions.height][i] - 1)
                ) as Point;
                setGrid(
                  produce(grid, (draft) => {
                    plotLine(cursor.current, coords, ([x, y]) => {
                      draft[y][x] = brush.current;
                    });
                  })
                );
                cursor.current = coords;
              }}
            >
              {(canvas) => {
                canvas.clear();
                grid.forEach((row, y) => {
                  row.forEach((cell, x) => {
                    if (cell)
                      canvas.add(
                        new Rect({
                          x,
                          y,
                          width: 1,
                          height: 1,
                          fill: "rgb(var(--color-foreground))",
                        })
                      );
                  });
                });
                canvas.draw();
              }}
            </Canvas>
            <div className="h-screen w-screen"></div>
          </div>
        </div>
        <div className="grid w-64 grid-cols-2 gap-2 rounded-xl bg-background-alt py-4 px-8 shadow-md shadow-black/25">
          {(Object.entries(dimensions) as EntriesOf<typeof dimensions>).map(
            ([k, v], i) => (
              <div key={i}>
                <label htmlFor={k}>{k}</label>
                <NumberInput
                  className="!bg-background"
                  value={v}
                  onChange={(v) => setDimensions({ ...dimensions, [k]: v })}
                />
              </div>
            )
          )}
        </div>
      </div>
    </main>
  );
}
