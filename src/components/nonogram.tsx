import { crossPath } from "helpers";
import Canvas2D, { Line, Rect } from "helpers/canvas";
import { isMod, useMods, useParentDimensions } from "hooks";
import { clamp, isEqual } from "lodash-es";
import { useCallback, useEffect, useRef } from "react";
import { useSettings } from "settings";
import useNonogramStore, { selectClues, selectDimensions } from "store";
import { Point } from "types";
import GridLines from "./gridLines";

const enum PaintingState {
  None,
  Mouse,
  Keyboard,
}

export default function Nonogram() {
  const canvasEl = useRef<HTMLCanvasElement>(null);
  const canvas = useRef<Canvas2D | null>(null);
  const painting = useRef(PaintingState.None);

  const mods = useMods(canvasEl.current?.parentElement ?? null);
  const matchKeys = useSettings((state) => state.matchKeys);
  const grid = useNonogramStore((state) => state.grid);
  const [width, height] = useNonogramStore(selectDimensions);
  const cursor = useNonogramStore((state) => state.cursor);
  const moveCursorTo = useNonogramStore((state) => state.moveCursorTo);
  const moveCursorRelative = useNonogramStore(
    (state) => state.moveCursorRelative
  );
  const undo = useNonogramStore((state) => state.undo);
  const redo = useNonogramStore((state) => state.redo);

  const colors = useNonogramStore((state) => state.colors);
  const clues = useNonogramStore(selectClues);
  const [clueWidth, clueHeight] = [
    Math.max(...clues[0].map((c) => c.length)),
    Math.max(...clues[1].map((c) => c.length)),
  ];
  const paint = useNonogramStore((state) => state.paint);
  const [totalWidth, totalHeight] = [width + clueWidth, height + clueHeight];
  const canvasDim = useParentDimensions(canvasEl);

  // const draw = useCallback(() => {
  //   canvas.current!.clear();
  //
  //   drawGrid(
  //     canvas.current!,
  //     grid,
  //     clueWidth,
  //     clueHeight,
  //     (canvas, cell, x, y) => {
  //       if (cell === colors.length) {
  //         const lineWidth = 0.075 * canvas.getViewBoxRatio()[1];
  //         canvas.drawPath(
  //           crossPath(x, y),
  //           lineWidth,
  //           "rgb(var(--color-foreground))",
  //           "round"
  //         );
  //       } else {
  //         canvas.drawRect(x, y, 1, 1, colors[cell]);
  //       }
  //     }
  //   );
  //
  //   const [_, ratioY] = canvas.current!.getViewBoxRatio();
  //   clues.forEach((gClues, a) => {
  //     gClues.forEach((ce, i) => {
  //       ce.forEach((n, j) => {
  //         canvas.current!.fillText(
  //           n.length.toString(),
  //           (a === 1 ? i + clueWidth : j + clueWidth - ce.length) + 0.5,
  //           (a === 0 ? i + clueHeight : j + clueHeight - ce.length) + 0.5,
  //           `${ratioY / 2}px sans-serif`,
  //           n.isMarked
  //             ? "rgb(var(--color-foreground) / 0.5)"
  //             : "rgb(var(--color-foreground))"
  //         );
  //       });
  //     });
  //   });
  // }, [grid, clues, clueWidth, clueHeight, colors]);

  useEffect(() => {
    canvas.current = new Canvas2D(
      canvasEl.current!,
      [0, 0, totalWidth, totalHeight],
      [0, 0, 1, 1]
    );
    canvas.current.add(
      new Line({
        points: [
          [2, 2],
          [4, 3],
        ],
        width: 2,
      })
    );
  }, [totalWidth, totalHeight]);

  useEffect(() => {
    canvas.current!.draw();
  }, [canvasDim]);

  useEffect(() => {
    if (painting.current === PaintingState.Keyboard)
      paint([cursor], { toggle: false });
  }, [paint, cursor]);

  return (
    <div
      className="relative max-h-full max-w-full overflow-hidden outline-none"
      style={{ aspectRatio: `${totalWidth} / ${totalHeight}` }}
      tabIndex={-1}
      onKeyDown={(e) => {
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
      }}
      onKeyUp={(e) => {
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
      }}
    >
      <canvas
        ref={canvasEl}
        className="absolute h-full w-full touch-none "
        width={canvasDim[0] * (canvas.current?.scale ?? 0)}
        height={canvasDim[1] * (canvas.current?.scale ?? 0)}
        style={{ width: canvasDim[0], height: canvasDim[1] }}
        onContextMenu={(e) => e.preventDefault()}
        onPointerDown={(e) => {
          const coords = canvas
            .current!.eventToCoords(e)
            .map((c, i) => c - [clueWidth, clueHeight][i]) as Point;
          if (coords.some((d) => d < 0)) {
            return;
          }
          e.currentTarget.setPointerCapture(e.pointerId);
          paint([coords], { brush: +(e.button === 2) });
          moveCursorTo(...coords);
          painting.current = PaintingState.Mouse;
        }}
        onPointerMove={(e) => {
          if (painting.current !== PaintingState.Mouse) {
            return;
          }
          const coords = canvas
            .current!.eventToCoords(e)
            .map((c, i) =>
              clamp(c - [clueWidth, clueHeight][i], 0, [width, height][i] - 1)
            ) as Point;
          if (isEqual(coords, cursor)) return;
          paint([cursor, coords], { toggle: false });
          moveCursorTo(...coords);
        }}
        onPointerUp={() => {
          painting.current = PaintingState.None;
        }}
      ></canvas>
      <div className="h-screen w-screen"></div>
    </div>
  );
}
