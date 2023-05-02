import Canvas2D, { drawGridLines } from "helpers/canvas";
import { useParentDimensions } from "hooks";
import { useCallback, useEffect, useRef } from "react";
import useNonogramStore, { selectClues, selectDimensions } from "store";

export default function GridLines() {
  const canvasEl = useRef<HTMLCanvasElement>(null);
  const canvas = useRef<Canvas2D | null>(null);

  const cursor = useNonogramStore((state) => state.cursor);
  const [width, height] = useNonogramStore(selectDimensions);

  const clues = useNonogramStore(selectClues);
  const [clueWidth, clueHeight] = [
    Math.max(...clues[0].map((c) => c.length)),
    Math.max(...clues[1].map((c) => c.length)),
  ];

  const [totalWidth, totalHeight] = [width + clueWidth, height + clueHeight];
  const canvasDim = useParentDimensions(canvasEl);

  const draw = useCallback(() => {
    canvas.current!.clear();

    const primaryColor = getComputedStyle(canvasEl.current!).getPropertyValue(
      "--color-primary"
    );

    drawGridLines(
      canvas.current!,
      clueWidth,
      clueHeight,
      totalWidth,
      totalHeight,
      (a, i) => {
        const j = i - [clueWidth, clueHeight][a];
        if (j % 5 === 0) return 2;
        if (j === 0 || j === [width, height][a]) return 2;
        return 1;
      },
      (a, i) => {
        const j = i - [clueWidth, clueHeight][a];
        const d = j - cursor[a];
        if (0 <= d && d <= 1) return `rgb(${primaryColor})`;
        return "black";
      }
    );

    canvas.current!.drawRect(
      clueWidth + cursor[0],
      0,
      1,
      totalHeight,
      `rgb(${primaryColor} / 0.15)`
    );
    canvas.current!.drawRect(
      0,
      clueHeight + cursor[1],
      totalWidth,
      1,
      `rgb(${primaryColor} / 0.15)`
    );
  }, [clueWidth, clueHeight, totalWidth, totalHeight, width, height, cursor]);

  useEffect(() => {
    canvas.current = new Canvas2D(
      canvasEl.current!,
      [0, 0, totalWidth, totalHeight],
      [0, 0, 1, 1]
    );
    draw();
  }, [totalWidth, totalHeight, draw]);

  useEffect(() => {
    draw();
  }, [canvasDim, draw]);

  return (
    <canvas
      ref={canvasEl}
      className="pointer-events-none absolute h-full w-full touch-none"
      width={canvasDim[0] * (canvas.current?.scale ?? 0)}
      height={canvasDim[1] * (canvas.current?.scale ?? 0)}
      style={{ width: canvasDim[0], height: canvasDim[1] }}
    ></canvas>
  );
}
