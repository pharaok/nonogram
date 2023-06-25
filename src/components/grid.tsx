import { crossPath } from "helpers";
import Canvas2D, { Path, Rect } from "helpers/canvas";
import { HistorySlice } from "history";
import { isMod, useMods } from "hooks";
import { clamp, isEqual } from "lodash-es";
import { forwardRef, useCallback, useContext, useEffect, useRef } from "react";
import { useSettings } from "settings";
import {
  GridContext,
  GridSlice,
  NonogramContext,
  NonogramSlice,
  selectDimensions,
} from "store";
import { Point, Write } from "types";
import { useStore } from "zustand";
import Layer, { CanvasProps } from "./canvas/layer";

const enum PaintingState {
  None,
  Mouse,
  Keyboard,
}

const useGridStore = <U extends unknown>(
  selector: (
    state: Write<Partial<NonogramSlice>, GridSlice & HistorySlice>
  ) => U
) => {
  const gridStore = useContext(GridContext);
  const nonogramStore = useContext(NonogramContext);
  return useStore(gridStore ?? nonogramStore, selector);
};

export default forwardRef<
  Canvas2D | null,
  Write<
    CanvasProps,
    {
      readonly?: boolean;
    }
  >
>(function Grid({ readonly, children = [], ...props }, ref) {
  const gridEl = useRef<HTMLCanvasElement | null>(null);
  const painting = useRef(PaintingState.None);

  const mods = useMods(gridEl.current ?? null);
  const matchKeys = useSettings((state) => state.matchKeys);

  const grid = useGridStore((state) => state.grid);
  const [width, height] = useGridStore(selectDimensions);
  const colors = useGridStore((state) => state.colors);
  const paint = useGridStore((state) => state.paint);

  const cursor = useGridStore((state) => state.cursor);
  const moveCursorTo = useGridStore((state) => state.moveCursorTo);
  const moveCursorRelative = useGridStore((state) => state.moveCursorRelative);

  const undo = useGridStore((state) => state.undo);
  const redo = useGridStore((state) => state.redo);

  useEffect(() => {
    if (painting.current === PaintingState.Keyboard)
      paint([cursor], { toggle: false });
  }, [paint, cursor]);

  const draw = useCallback(
    (canvas: Canvas2D) => {
      grid.forEach((row, y) => {
        row.forEach((cell, x) => {
          if (cell === 1)
            canvas.add(
              new Rect({
                x,
                y,
                width: 1,
                height: 1,
                fill: colors[1],
              })
            );
          else if (cell === 2)
            canvas.add(
              new Path({
                path: crossPath(x, y),
                width: 0.1,
                stroke: colors[1],
                lineCap: "round",
              })
            );
        });
      });
    },
    [grid]
  );

  // HACK: putting this inside the jsx while also passing
  // the rest of the children causes a type error
  if (!Array.isArray(children)) children = [children];
  children.splice(0, 0, draw);

  return (
    <Layer
      ref={(el) => {
        if (ref) {
          if (typeof ref === "function") ref(el);
          else ref.current = el;
        }
        if (el) gridEl.current = el.ctx.canvas;
      }}
      className="absolute touch-none"
      tabIndex={-1}
      {...(!readonly && {
        onContextMenu: (e) => e.preventDefault(),
        onPointerDown: (e, coords) => {
          coords = coords.map((c, i) =>
            clamp(Math.floor(c), 0, [width, height][i] - 1)
          ) as Point;
          if (coords.some((d) => d < 0)) return;

          e.currentTarget.setPointerCapture(e.pointerId);
          if (e.button === 0) paint([coords], { brush: 0 });
          else if (e.button === 2) paint([coords], { brush: 1 });
          else return;
          moveCursorTo(...coords);
          painting.current = PaintingState.Mouse;
        },
        onPointerMove: (_, coords) => {
          coords = coords.map((c, i) =>
            clamp(Math.floor(c), 0, [width, height][i] - 1)
          ) as Point;
          if (isEqual(coords, cursor)) return;
          moveCursorTo(...coords);
          if (painting.current !== PaintingState.Mouse) return;
          paint([cursor, coords], { toggle: false });
        },
        onPointerUp: () => {
          painting.current = PaintingState.None;
        },
        onKeyDown: (e) => {
          console.log(e);
          const key = e.key[0].toUpperCase() + e.key.slice(1);
          if (isMod(e.key)) return;
          const action = matchKeys([mods, key]);
          if (action === null) return;
          let isHandled = true;
          switch (action) {
            case "cursorLeft":
              moveCursorRelative(-1, 0);
              break;
            case "cursorDown":
              moveCursorRelative(0, 1);
              break;
            case "cursorUp":
              moveCursorRelative(0, -1);
              break;
            case "cursorRight":
              moveCursorRelative(1, 0);
              break;
            case "erase":
              if (e.repeat) break;
              painting.current = PaintingState.Keyboard;
              paint([cursor], { color: 0 });
              break;
            case "brush1":
              if (e.repeat) break;
              painting.current = PaintingState.Keyboard;
              paint([cursor], { brush: 0 });
              break;
            case "brush2":
              if (e.repeat) break;
              painting.current = PaintingState.Keyboard;
              paint([cursor], { brush: 1 });
              break;
            case "undo":
              console.log("undoin");
              undo();
              break;
            case "redo":
              redo();
              break;
            default:
              isHandled = false;
              break;
          }
          if (isHandled) e.preventDefault();
        },
        onKeyUp: (e) => {
          const key = e.key[0].toUpperCase() + e.key.slice(1);
          const action = matchKeys([mods, key]);
          if (action === null) return;
          switch (action) {
            case "erase":
            case "brush1":
            case "brush2":
              painting.current = PaintingState.None;
              break;
          }
        },
      })}
      {...props}
    >
      {draw}
    </Layer>
  );
});
