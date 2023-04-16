import Canvas2D from "helpers/canvas";
import { clamp } from "lodash-es";
import { PointerEvent, useEffect, useRef } from "react";
import useNonogramStore, { selectClues, selectDimensions } from "store";

export default function Nonogram() {
  const canvasEl = useRef<HTMLCanvasElement>(null);
  const canvas = useRef<Canvas2D | null>(null);
  const prevCell = useRef<[number, number]>([0, 0]);
  const painting = useRef(false);

  const grid = useNonogramStore((state) => state.grid);
  const [width, height] = useNonogramStore(selectDimensions);

  const colors = useNonogramStore((state) => state.colors);
  const clues = useNonogramStore(selectClues);
  const [clueWidth, clueHeight] = [
    Math.max(...clues[0].map((c) => c.length)),
    Math.max(...clues[1].map((c) => c.length)),
  ];
  const paint = useNonogramStore((state) => state.paint);
  const [totalWidth, totalHeight] = [width + clueWidth, height + clueHeight];

  const eventToCoords = (
    e: PointerEvent<HTMLCanvasElement>
  ): [number, number] => {
    const [ratioX, ratioY] = canvas.current!.getViewBoxRatio();
    const { top, left } = e.currentTarget.getBoundingClientRect();
    const [cx, cy] = [
      (e.clientX - left - canvas.current!.extra[0]) / ratioX,
      (e.clientY - top - canvas.current!.extra[1]) / ratioY,
    ].map(Math.floor);
    return [cx - clueWidth, cy - clueHeight];
  };

  const drawGridLines = () => {
    for (let a = 0; a < 2; a++) {
      for (
        let i = [clueWidth, clueHeight][a];
        i <= [totalWidth, totalHeight][a];
        i++
      ) {
        const p1: [number, number] = [-Infinity, -Infinity];
        const p2: [number, number] = [Infinity, Infinity];
        p1[a] = i;
        p2[a] = i;

        let lineWidth = 1;
        const j = i - [clueWidth, clueHeight][a];
        if (j % 5 === 0) {
          lineWidth = 2;
        }
        if (j === 0 || j === [width, height][a]) {
          lineWidth = 2;
        }

        canvas.current!.drawLine([p1, p2], lineWidth, "black");
      }
    }
  };

  const drawCell = (x: number, y: number) => {
    if (grid[y][x] == colors.length) {
      const crossPadding = 0.25;
      const lineWidth = 0.075 * canvas.current!.getViewBoxRatio()[1];

      canvas.current!.drawLine(
        [
          [crossPadding, crossPadding],
          [1 - crossPadding, 1 - crossPadding],
        ].map(([px, py]) => [px + clueWidth + x, py + clueHeight + y]),
        lineWidth,
        "black",
        "round"
      );
      canvas.current!.drawLine(
        [
          [1 - crossPadding, crossPadding],
          [crossPadding, 1 - crossPadding],
        ].map(([px, py]) => [px + clueWidth + x, py + clueHeight + y]),
        lineWidth,
        "black",
        "round"
      );
    } else {
      canvas.current!.drawRect(
        clueWidth + x,
        clueHeight + y,
        1,
        1,
        colors[grid[y][x]]
      );
    }
  };

  const draw = () => {
    canvas.current!.clear();
    grid.forEach((row, y) => {
      row.forEach((_, x) => {
        drawCell(x, y);
      });
    });

    const [_, ratioY] = canvas.current!.getViewBoxRatio();
    clues.forEach((gClues, a) => {
      gClues.forEach((ce, i) => {
        ce.forEach((n, j) => {
          canvas.current!.fillText(
            n.length.toString(),
            (a === 1 ? i + clueWidth : j + clueWidth - ce.length) + 0.5,
            (a === 0 ? i + clueHeight : j + clueHeight - ce.length) + 0.5,
            `${ratioY / 2}px sans-serif`,
            n.isMarked ? "gray" : "black"
          );
        });
      });
    });

    drawGridLines();
  };

  useEffect(() => {
    canvas.current = new Canvas2D(
      canvasEl.current!,
      [0, 0, totalWidth, totalHeight],
      [0, 0, 1, 1]
    );

    const resizeObserver = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      canvasEl.current!.width = width;
      canvasEl.current!.height = height;
      draw();
    });
    resizeObserver.observe(canvasEl.current!.parentElement!);
    return () => {
      resizeObserver.disconnect();
    };
  }, [totalWidth, totalHeight]);

  useEffect(() => {
    draw();
  }, [grid]);

  return (
    <div
      className="relative max-h-full max-w-full overflow-hidden"
      style={{ aspectRatio: `${totalWidth} / ${totalHeight}` }}
    >
      <canvas
        ref={canvasEl}
        className="absolute h-full w-full"
        onContextMenu={(e) => e.preventDefault()}
        onPointerDown={(e) => {
          const coords = eventToCoords(e);
          if (coords.some((d) => d < 0)) {
            return;
          }
          e.currentTarget.setPointerCapture(e.pointerId);
          paint([coords], +(e.button === 2));
          prevCell.current = coords;
          painting.current = true;
        }}
        onPointerMove={(e) => {
          if (!painting.current) {
            return;
          }
          const coords = eventToCoords(e).map((d, i) =>
            clamp(d, 0, [width, height][i] - 1)
          ) as [number, number];
          paint([coords, prevCell.current]);
          prevCell.current = coords;
        }}
        onPointerUp={() => {
          painting.current = false;
        }}
      ></canvas>
      <div className="h-screen w-screen"></div>
    </div>
  );
}
