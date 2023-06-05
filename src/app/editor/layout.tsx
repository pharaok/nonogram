"use client";

import Button from "components/button";
import Canvas from "components/canvas";
import { Rect } from "helpers/canvas";
import { selectCanRedo, selectCanUndo } from "history";
import { clamp, isEqual } from "lodash-es";
import { Redo2, RotateCcw, Scaling, Undo2 } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createGridSlice, selectDimensions } from "store";
import { Point } from "types";
import { createStore, useStore } from "zustand";

export default function Editor({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [gridStore, _] = useState(
    createStore(createGridSlice([...Array(10)].map(() => Array(10).fill(0))))
  );
  const grid = useStore(gridStore, (state) => state.grid);
  const setGrid = useStore(gridStore, (state) => state.setGrid);
  const dimensions = useStore(gridStore, selectDimensions);
  const paint = useStore(gridStore, (state) => state.paint);
  const cursor = useStore(gridStore, (state) => state.cursor);
  const moveCursorTo = useStore(gridStore, (state) => state.moveCursorTo);

  const undo = useStore(gridStore, (state) => state.undo);
  const redo = useStore(gridStore, (state) => state.redo);
  const clear = useStore(gridStore, (state) => state.clear);
  const canUndo = useStore(gridStore, selectCanUndo);
  const canRedo = useStore(gridStore, selectCanRedo);

  useEffect(() => {
    if (!searchParams.has("w") || !searchParams.has("h")) return;
    const [currWidth, currHeight] = dimensions;
    const width = +searchParams.get("w")!;
    const height = +searchParams.get("h")!;
    if (width !== currWidth || height !== currHeight)
      setGrid(
        [...Array(height)].map((_, y) =>
          Array(width)
            .fill(0)
            .map((v, x) => grid?.[y]?.[x] ?? v)
        )
      );
  }, [searchParams]);

  useEffect(() => {
    if (pathname === "/editor") {
      const w = searchParams.get("w") ?? dimensions[0],
        h = searchParams.get("h") ?? dimensions[1];
      router.replace(`${pathname}?w=${w}&h=${h}`);
    }
  }, [pathname, searchParams]);

  return (
    <main className="relative flex-1">
      <div className="items center absolute inset-0 flex flex-col items-center justify-evenly gap-8 p-4 md:flex-row md:p-8">
        <div className="flex aspect-square max-h-full max-w-full items-center justify-center overflow-hidden">
          <div
            className="relative max-h-full max-w-full overflow-hidden"
            style={{
              aspectRatio: dimensions.join("/"),
            }}
          >
            <Canvas
              className="absolute h-full w-full touch-none border border-foreground"
              viewBox={[0, 0, ...dimensions]}
              onPointerDown={(e, coords) => {
                paint([coords], { brush: 1 });
                moveCursorTo(...coords);
                e.currentTarget.setPointerCapture(e.pointerId);
              }}
              onPointerMove={(e, coords) => {
                if (!e.buttons) return;
                coords = coords.map((c, i) =>
                  clamp(c, 0, dimensions[i] - 1)
                ) as Point;
                if (isEqual(coords, cursor)) return;
                paint([cursor, coords], { toggle: false });
                moveCursorTo(...coords);
              }}
            >
              {(canvas) => {
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
              }}
            </Canvas>
            <div className="h-screen w-screen"></div>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2 rounded-xl bg-background-alt py-4 px-8 shadow-md shadow-black/25">
          <div className="flex gap-2">
            <Button
              className="flex h-8 w-8 items-center justify-center !bg-background enabled:hover:!bg-foreground"
              onClick={() => router.push("/editor/size")}
            >
              <Scaling />
            </Button>
            <Button
              className="flex h-8 w-8 items-center justify-center !bg-background enabled:hover:!bg-foreground"
              onClick={() => clear()}
            >
              <RotateCcw />
            </Button>
            <Button
              className="flex h-8 w-8 items-center justify-center !bg-background enabled:hover:!bg-foreground"
              onClick={() => undo()}
              disabled={!canUndo}
            >
              <Undo2 />
            </Button>
            <Button
              className="flex h-8 w-8 items-center justify-center !bg-background enabled:hover:!bg-foreground"
              onClick={() => redo()}
              disabled={!canRedo}
            >
              <Redo2 />
            </Button>
          </div>
        </div>
      </div>
      {children}
    </main>
  );
}
