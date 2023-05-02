import Canvas2D, { drawGridLines } from "helpers/canvas";
import { useParentDimensions } from "hooks";
import { useEffect, useRef } from "react";
import useNonogramStore, { selectClues, selectDimensions } from "store";

export default function GridLines() {
  const canvasEl = useRef<HTMLCanvasElement>(null);
  const canvas = useRef<Canvas2D | null>(null);

  const [width, height] = useNonogramStore(selectDimensions);

  const clues = useNonogramStore(selectClues);
  const [clueWidth, clueHeight] = [
    Math.max(...clues[0].map((c) => c.length)),
    Math.max(...clues[1].map((c) => c.length)),
  ];

  const [totalWidth, totalHeight] = [width + clueWidth, height + clueHeight];
  const canvasDim = useParentDimensions(canvasEl);

  const draw = () => {
    canvas.current!.clear();

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
      }
    );
  };

  useEffect(() => {
    canvas.current = new Canvas2D(
      canvasEl.current!,
      [0, 0, totalWidth, totalHeight],
      [0, 0, 1, 1]
    );
    draw();
  }, [totalWidth, totalHeight]);

  useEffect(() => {
    draw();
  }, [canvasDim]);

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
