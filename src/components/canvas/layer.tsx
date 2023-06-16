import Canvas2D from "helpers/canvas";
import { useDimensions } from "hooks";
import { forwardRef, useContext, useEffect, useRef } from "react";
import { Point, Write } from "types";
import { CanvasContext } from ".";

type CanvasPointerEvent = (
  e: React.PointerEvent<HTMLCanvasElement>,
  point: Point
) => void;

export type CanvasProps = Write<
  React.ComponentPropsWithoutRef<"canvas">,
  {
    children?: ((canvas: Canvas2D) => any) | ((canvas: Canvas2D) => any)[];
    onPointerDown?: CanvasPointerEvent;
    onPointerMove?: CanvasPointerEvent;
    onPointerUp?: CanvasPointerEvent;
  }
>;

export default forwardRef<HTMLCanvasElement, CanvasProps>(function Layer(
  { children, onPointerDown, onPointerMove, onPointerUp, className, ...props },
  ref
) {
  const { viewBox, padding } = useContext(CanvasContext)!;
  const canvasEl = useRef<HTMLCanvasElement | null>(null);
  const canvasRef = useRef<Canvas2D | null>(null);
  const canvasDim = useDimensions(canvasEl);
  useEffect(() => {
    canvasRef.current = new Canvas2D({
      canvasEl: canvasEl.current!,
      viewBox,
      padding,
    });
  }, []);
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
    if (viewBox) canvasRef.current!.viewBox = viewBox;
    if (padding) canvasRef.current!.padding = padding;
    canvasRef.current!.draw();
  }, [viewBox, padding]);
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
      className={`absolute h-full w-full ${className}`}
      width={canvasDim[0] * window.devicePixelRatio}
      height={canvasDim[1] * window.devicePixelRatio}
      onPointerDown={(e) =>
        onPointerDown &&
        onPointerDown(e, canvasRef.current!.toViewBox(e.clientX, e.clientY))
      }
      onPointerMove={(e) =>
        onPointerMove &&
        onPointerMove(e, canvasRef.current!.toViewBox(e.clientX, e.clientY))
      }
      onPointerUp={(e) =>
        onPointerUp &&
        onPointerUp(e, canvasRef.current!.toViewBox(e.clientX, e.clientY))
      }
      {...props}
    ></canvas>
  );
});
