"use client";

import Button from "components/button";
import Canvas from "components/canvas";
import GridLines from "components/gridLines";
import Panel from "components/panel";
import { Rect } from "helpers/canvas";
import { selectCanRedo, selectCanUndo } from "history";
import { useDimensions } from "hooks";
import { clamp, isEqual } from "lodash-es";
import { Grid, Redo2, RotateCcw, Scaling, Square, Undo2 } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createGridSlice, selectDimensions } from "store";
import { Point } from "types";
import { createStore, useStore } from "zustand";

export default function Editor({ children }: { children: React.ReactNode }) {
  const editorEl = useRef<HTMLDivElement>(null);
  const dimensions = useDimensions(editorEl);

  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [gridStore, _] = useState(
    createStore(createGridSlice([...Array(10)].map(() => Array(10).fill(0))))
  );
  const grid = useStore(gridStore, (state) => state.grid);
  const setGrid = useStore(gridStore, (state) => state.setGrid);
  const [width, height] = useStore(gridStore, selectDimensions);
  const paint = useStore(gridStore, (state) => state.paint);
  const cursor = useStore(gridStore, (state) => state.cursor);
  const moveCursorTo = useStore(gridStore, (state) => state.moveCursorTo);

  const undo = useStore(gridStore, (state) => state.undo);
  const redo = useStore(gridStore, (state) => state.redo);
  const clear = useStore(gridStore, (state) => state.clear);
  const canUndo = useStore(gridStore, selectCanUndo);
  const canRedo = useStore(gridStore, selectCanRedo);

  const [gridLinesVisible, setGridLinesVisibility] = useState(true);

  useEffect(() => {
    if (!searchParams.has("w") || !searchParams.has("h")) return;
    const newWidth = +searchParams.get("w")!;
    const newHeight = +searchParams.get("h")!;
    if (newWidth !== width || newHeight !== height)
      setGrid(
        [...Array(newHeight)].map((_, y) =>
          Array(newWidth)
            .fill(0)
            .map((v, x) => grid?.[y]?.[x] ?? v)
        )
      );
  }, [searchParams]);

  useEffect(() => {
    if (pathname === "/editor") {
      const w = searchParams.get("w") ?? [width, height][0],
        h = searchParams.get("h") ?? [width, height][1];
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
              aspectRatio: [width, height].join("/"),
            }}
            ref={editorEl}
          >
            <Canvas
              className="absolute touch-none border border-foreground"
              style={{ width: dimensions[0], height: dimensions[1] }}
              viewBox={[0, 0, width, height]}
              onPointerDown={(e, coords) => {
                paint([coords], { brush: 1 });
                moveCursorTo(...coords);
                e.currentTarget.setPointerCapture(e.pointerId);
              }}
              onPointerMove={(e, coords) => {
                if (!e.buttons) return;
                coords = coords.map((c, i) =>
                  clamp(c, 0, [width, height][i] - 1)
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
            <GridLines
              style={{
                width: dimensions[0],
                height: dimensions[1],
                visibility: gridLinesVisible ? "visible" : "hidden",
              }}
              width={width}
              height={height}
            />
            <div className="h-screen w-screen"></div>
          </div>
        </div>
        <Panel className="grid grid-cols-3 gap-2">
          <Button
            className="flex h-8 w-8 items-center justify-center"
            onClick={() => clear()}
          >
            <RotateCcw />
          </Button>
          <Button
            className="flex h-8 w-8 items-center justify-center"
            onClick={() => undo()}
            disabled={!canUndo}
          >
            <Undo2 />
          </Button>
          <Button
            className="flex h-8 w-8 items-center justify-center"
            onClick={() => redo()}
            disabled={!canRedo}
          >
            <Redo2 />
          </Button>
          <Button
            className="flex h-8 w-8 items-center justify-center"
            onClick={() => router.push("/editor/size")}
          >
            <Scaling />
          </Button>
          <Button
            className={`flex h-8 w-8 items-center justify-center ${
              gridLinesVisible ? "!bg-primary !text-background" : ""
            } enabled:hover:!bg-foreground`}
            onClick={() => setGridLinesVisibility((v) => !v)}
          >
            {gridLinesVisible ? <Grid /> : <Square />}
          </Button>
        </Panel>
      </div>
      {children}
    </main>
  );
}
