import Canvas2D, { drawGrid } from "helpers/canvas";
import { useParentDimensions } from "hooks";
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import useNonogramStore, { selectDimensions } from "store";

const Solution = forwardRef(function Solution(
  { style, ...props }: React.ComponentProps<"canvas">,
  ref
) {
  const solution = useNonogramStore((state) => state.solution);
  const colors = useNonogramStore((state) => state.colors);
  const [width, height] = useNonogramStore(selectDimensions);
  const canvasEl = useRef<HTMLCanvasElement | null>(null);
  const canvas = useRef<Canvas2D | null>(null);
  const [hue, setHue] = useState(Math.floor(Math.random() * 360));
  const canvasDim = useParentDimensions(canvasEl);

  const draw = useCallback(() => {
    const grad = canvas.current!.ctx.createLinearGradient(
      0,
      0,
      canvasEl.current!.width,
      canvasEl.current!.height
    );
    grad.addColorStop(0, `hsl(${hue}, 100%, 50%)`);
    grad.addColorStop(1, `hsl(${hue + 60}, 100%, 50%)`);
    drawGrid(canvas.current!, solution, 0, 0, (canvas, cell, x, y) => {
      if (!cell) canvas.drawRect(x, y, 1, 1, colors[0]);
      if (cell === 1) canvas.drawRect(x, y, 1, 1, grad);
    });
  }, [solution, colors, hue]);

  useEffect(() => {
    canvas.current = new Canvas2D(canvasEl.current!, [0, 0, width, height]);
    draw();
  }, [width, height, draw]);

  useEffect(() => {
    draw();
  }, [canvasDim, draw]);

  return (
    <canvas
      ref={(el) => {
        if (ref && typeof ref !== "function") {
          ref.current = el;
        }
        canvasEl.current = el;
      }}
      {...props}
      style={{ ...style, aspectRatio: `${width} / ${height}` }}
      width={canvasDim[0]}
      height={canvasDim[1]}
    ></canvas>
  );
});

export default Solution;
