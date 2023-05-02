import { crossPath } from "helpers";
import Canvas2D, { drawGrid } from "helpers/canvas";
import { clamp } from "lodash-es";
import { useEffect, useRef, useState } from "react";
import useNonogramStore, { selectClues, selectDimensions } from "store";
import GridLines from "./gridLines";

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
  const [canvasDim, setCanvasDim] = useState([0, 0]);

  const draw = () => {
    canvas.current!.clear();

    drawGrid(
      canvas.current!,
      grid,
      clueWidth,
      clueHeight,
      (canvas, cell, x, y) => {
        if (cell === colors.length) {
          const lineWidth = 0.075 * canvas.getViewBoxRatio()[1];
          canvas.drawPath(crossPath(x, y), lineWidth, "black", "round");
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
  };

  useEffect(() => {
    canvas.current = new Canvas2D(
      canvasEl.current!,
      [0, 0, totalWidth, totalHeight],
      [0, 0, 1, 1]
    );

    const resizeObserver = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setCanvasDim([width, height].map(Math.floor));
      draw();
    });
    resizeObserver.observe(canvasEl.current!.parentElement!);
    return () => {
      resizeObserver.disconnect();
    };
  }, [totalWidth, totalHeight, draw]);

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
        className="absolute h-full w-full touch-none "
        width={canvasDim[0] * (canvas.current?.scale ?? 0)}
        height={canvasDim[1] * (canvas.current?.scale ?? 0)}
        style={{ width: canvasDim[0], height: canvasDim[1] }}
        onContextMenu={(e) => e.preventDefault()}
        onPointerDown={(e) => {
          const coords = canvas
            .current!.eventToCoords(e)
            .map((c, i) => c - [clueWidth, clueHeight][i]) as [number, number];
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
          const coords = canvas
            .current!.eventToCoords(e)
            .map((c, i) =>
              clamp(c - [clueWidth, clueHeight][i], 0, [width, height][i] - 1)
            ) as [number, number];
          paint([coords, prevCell.current]);
          prevCell.current = coords;
        }}
        onPointerUp={() => {
          painting.current = false;
        }}
      ></canvas>
      <GridLines />
      <div className="h-screen w-screen"></div>
    </div>
  );
}
