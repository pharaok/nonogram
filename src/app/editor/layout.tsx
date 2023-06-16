"use client";

import Button from "components/button";
import Canvas from "components/canvas";
import Grid from "components/grid";
import GridLines from "components/gridLines";
import Link from "components/link";
import Panel from "components/panel";
import { gridToBase64 } from "helpers";
import { selectCanRedo, selectCanUndo } from "history";
import { useDimensions } from "hooks";
import {
  Redo2,
  RotateCcw,
  Scaling,
  Square,
  Undo2,
  Grid as GridIcon,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { GridContext, createGridSlice, selectDimensions } from "store";
import { createStore, useStore } from "zustand";

export default function Editor({ children }: { children: React.ReactNode }) {
  const editorEl = useRef<HTMLDivElement>(null);
  const dimensions = useDimensions(editorEl);

  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [gridStore] = useState(
    createStore(createGridSlice([...Array(10)].map(() => Array(10).fill(0))))
  );
  const grid = useStore(gridStore, (state) => state.grid);
  const setGrid = useStore(gridStore, (state) => state.setGrid);
  const [width, height] = useStore(gridStore, selectDimensions);

  const undo = useStore(gridStore, (state) => state.undo);
  const redo = useStore(gridStore, (state) => state.redo);
  const clear = useStore(gridStore, (state) => state.clear);
  const canUndo = useStore(gridStore, selectCanUndo);
  const canRedo = useStore(gridStore, selectCanRedo);

  const [isPending, startTransition] = useTransition();
  const [seed, setSeed] = useState(gridToBase64(grid));

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
    router.replace(`${pathname}?w=${width}&h=${height}&s=${seed}`);
  }, [width, height, seed, router, pathname, searchParams]);
  useEffect(() => {
    startTransition(() => {
      setSeed(gridToBase64(grid));
    });
  }, [grid]);

  return (
    <GridContext.Provider value={gridStore}>
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
              <Canvas viewBox={[0, 0, width, height]} padding={[1, 1, 1, 1]}>
                <Grid
                  className="absolute touch-none border border-foreground"
                  style={{ width: dimensions[0], height: dimensions[1] }}
                />
                <GridLines
                  style={{
                    width: dimensions[0],
                    height: dimensions[1],
                    visibility: gridLinesVisible ? "visible" : "hidden",
                  }}
                  width={width}
                  height={height}
                />
              </Canvas>
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
              touchRepeat
            >
              <Undo2 />
            </Button>
            <Button
              className="flex h-8 w-8 items-center justify-center"
              onClick={() => redo()}
              disabled={!canRedo}
              touchRepeat
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
              {gridLinesVisible ? <GridIcon /> : <Square />}
            </Button>
            <div></div>
            <Link
              href={{
                pathname: "/",
                query: {
                  w: width,
                  h: height,
                  s: seed,
                },
              }}
              variant="button"
              className="col-span-3 h-8 !bg-primary text-center !text-background hover:!bg-foreground"
              onClick={(e) => {
                e.preventDefault();
                router.push(`/?w=${width}&h=${height}&s=${gridToBase64(grid)}`);
              }}
            >
              Play
            </Link>
          </Panel>
        </div>
        {children}
      </main>
    </GridContext.Provider>
  );
}
