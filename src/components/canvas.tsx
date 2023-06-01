import Canvas2D from "helpers/canvas";
import { useDimensions } from "hooks";
import { forwardRef, useEffect, useRef } from "react";
import { Point, Vector4D, Write } from "types";

type CanvasPointerEvent = (
  e: React.PointerEvent<HTMLCanvasElement>,
  point: Point
) => void;

export default forwardRef<
  HTMLCanvasElement,
  Write<
    React.ComponentPropsWithoutRef<"canvas">,
    {
      viewBox?: Vector4D;
      padding?: Vector4D;
      children: (canvas: Canvas2D) => any;
      onPointerDown?: CanvasPointerEvent;
      onPointerMove?: CanvasPointerEvent;
      onPointerUp?: CanvasPointerEvent;
    }
  >
>(function Canvas(
  {
    viewBox,
    padding,
    children,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    ...props
  },
  ref
) {
  const canvasEl = useRef<HTMLCanvasElement | null>(null);
  const canvasRef = useRef<Canvas2D | null>(null);
  const canvasDim = useDimensions(canvasEl);
  useEffect(() => {
    canvasRef.current = new Canvas2D(canvasEl.current!, viewBox, padding);
  }, [viewBox, padding]);
  useEffect(() => {
    if (canvasRef.current) children(canvasRef.current);
  }, [children]);
  useEffect(() => {
    canvasRef.current!.setScale();
    canvasRef.current!.draw();
  }, [canvasDim]);
  return (
    <canvas
      ref={(el) => {
        if (ref && typeof ref !== "function") ref.current = el;
        canvasEl.current = el;
      }}
      width={canvasDim[0] * window.devicePixelRatio}
      height={canvasDim[1] * window.devicePixelRatio}
      onPointerDown={(e) =>
        onPointerDown && onPointerDown(e, canvasRef.current!.eventToCoords(e))
      }
      onPointerMove={(e) =>
        onPointerMove && onPointerMove(e, canvasRef.current!.eventToCoords(e))
      }
      onPointerUp={(e) =>
        onPointerUp && onPointerUp(e, canvasRef.current!.eventToCoords(e))
      }
      {...props}
    ></canvas>
  );
});
