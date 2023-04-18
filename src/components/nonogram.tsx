import Canvas2D, { drawGrid, drawGridLines } from "helpers/canvas";
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

  const draw = () => {
    canvas.current!.clear();

    drawGrid(
      canvas.current!,
      grid,
      clueWidth,
      clueHeight,
      (canvas, cell, x, y) => {
        if (cell === colors.length) {
          const crossPadding = 0.2;
          const lineWidth = 0.075 * canvas.getViewBoxRatio()[1];

          canvas.drawPath(
            `M ${x + crossPadding} ${y + crossPadding}
           l ${1 - 2 * crossPadding} ${1 - 2 * crossPadding}
           m 0 ${-(1 - 2 * crossPadding)}
           l ${-(1 - 2 * crossPadding)} ${1 - 2 * crossPadding}`,
            lineWidth,
            "black",
            "round"
          );
        } else {
          canvas.drawRect(x, y, 1, 1, colors[cell]);
        }
      }
    );

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

    drawGridLines(
      canvas.current!,
      clueWidth,
      clueHeight,
      totalWidth,
      totalHeight,
      (a, i) => {
        const j = i - [clueWidth, clueHeight][a];
        if (j % 5 === 0) {
          return 2;
        }
        if (j === 0 || j === [width, height][a]) {
          return 2;
        }
        return 1;
      }
    );
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
