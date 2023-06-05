import { crossPath } from "helpers";
import { Group, Path, Rect, Text } from "helpers/canvas";
import { isMod, useDimensions, useMods } from "hooks";
import { clamp, isEqual } from "lodash-es";
import { useRef } from "react";
import { useSettings } from "settings";
import useNonogramStore, { selectClues, selectDimensions } from "store";
import { Point } from "types";
import Canvas from "./canvas";
import GridLines from "./gridLines";

const enum PaintingState {
  None,
  Mouse,
  Keyboard,
}

export default function Nonogram() {
  const nonogramEl = useRef<HTMLDivElement>(null);
  const painting = useRef(PaintingState.None);

  const mods = useMods(nonogramEl.current ?? null);
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
  const gridClues = useNonogramStore(selectClues);
  const [clueWidth, clueHeight] = [
    Math.max(...gridClues[0].map((c) => c.length)),
    Math.max(...gridClues[1].map((c) => c.length)),
  ];
  const paint = useNonogramStore((state) => state.paint);
  const [totalWidth, totalHeight] = [width + clueWidth, height + clueHeight];
  const dimensions = useDimensions(nonogramEl);

  return (
    <div
      ref={nonogramEl}
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
      <Canvas
        className="absolute touch-none"
        style={{ width: dimensions[0], height: dimensions[1] }}
        viewBox={[0, 0, totalWidth, totalHeight]}
        padding={[0, 0, 1, 1]}
        onContextMenu={(e) => e.preventDefault()}
        onPointerDown={(e, coords) => {
          coords = coords.map(
            (c, i) => c - [clueWidth, clueHeight][i]
          ) as Point;
          if (coords.some((d) => d < 0)) return;

          e.currentTarget.setPointerCapture(e.pointerId);
          paint([coords], { brush: +(e.button === 2) });
          moveCursorTo(...coords);
          painting.current = PaintingState.Mouse;
        }}
        onPointerMove={(_, coords) => {
          if (painting.current !== PaintingState.Mouse) return;

          coords = coords.map((c, i) =>
            clamp(c - [clueWidth, clueHeight][i], 0, [width, height][i] - 1)
          ) as Point;
          if (isEqual(coords, cursor)) return;
          paint([cursor, coords], { toggle: false });
          moveCursorTo(...coords);
        }}
        onPointerUp={() => {
          painting.current = PaintingState.None;
        }}
      >
        {(canvas) => {
          gridClues.forEach((clues, a) => {
            clues.forEach((clue, i) => {
              clue.forEach((n, j) => {
                const point = [clueWidth + i + 0.5, clueHeight + i + 0.5];
                point[a] = [clueWidth, clueHeight][a] - (clue.length - j) + 0.5;
                const [x, y] = point;
                canvas.add(
                  new Text({
                    x,
                    y,
                    text: n.length.toString(),
                    fontSize: 0.5,
                    fill: n.isMarked
                      ? "rgb(var(--color-foreground) / 0.5)"
                      : "rgb(var(--color-foreground))",
                  })
                );
              });
            });
          });
          const gridGroup = new Group({
            x: clueWidth,
            y: clueHeight,
            width,
            height,
            viewBox: [0, 0, width, height],
          });
          grid.forEach((row, y) => {
            row.forEach((cell, x) => {
              if (cell === 1)
                gridGroup.add(
                  new Rect({
                    x,
                    y,
                    width: 1,
                    height: 1,
                    fill: colors[1],
                  })
                );
              else if (cell === 2)
                gridGroup.add(
                  new Path({
                    path: crossPath(x, y),
                    width: 0.1,
                    stroke: colors[1],
                    lineCap: "round",
                  })
                );
            });
          });
          canvas.add(gridGroup);
        }}
      </Canvas>
      <GridLines
        style={{ width: dimensions[0], height: dimensions[1] }}
        x={clueWidth}
        y={clueHeight}
      />
      <div className="h-screen w-screen"></div>
    </div>
  );
}
