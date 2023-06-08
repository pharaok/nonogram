import Canvas2D from "helpers/canvas";
import { useDimensions } from "hooks";
import { forwardRef, useEffect, useRef } from "react";
import { Point, Vector4D, Write } from "types";

type CanvasPointerEvent = (
  e: React.PointerEvent<HTMLCanvasElement>,
  point: Point
) => void;

export type CanvasProps = Write<
  React.ComponentPropsWithoutRef<"canvas">,
  {
    viewBox?: Vector4D;
    padding?: Vector4D;
    children?: ((canvas: Canvas2D) => any) | ((canvas: Canvas2D) => any)[];
    onPointerDown?: CanvasPointerEvent;
    onPointerMove?: CanvasPointerEvent;
    onPointerUp?: CanvasPointerEvent;
  }
>;

export default forwardRef<HTMLCanvasElement, CanvasProps>(function Canvas(
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
    if (canvasRef.current) {
      canvasRef.current.clear();
      if (children) {
        if (Array.isArray(children))
          children.forEach((c) => c(canvasRef.current!));
        else children(canvasRef.current);
      }
      canvasRef.current.draw();
    }
  }, [children]);
  useEffect(() => {
    canvasRef.current!.setTransform();
    canvasRef.current!.draw();
  }, [canvasDim]);
  return (
    <canvas
      ref={(el) => {
        if (ref) {
          if (typeof ref === "function") ref(el);
          else ref.current = el;
        }
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