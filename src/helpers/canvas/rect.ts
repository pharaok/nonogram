import { Vector4D } from "types";
import Canvas2D from ".";
import StrokeStyle, { CanvasElement, FillStyle } from "./types";

export class Rect extends CanvasElement {
  width: number;
  height: number;
  fill?: FillStyle | null;
  stroke?: StrokeStyle | null;
  strokeWidth?: number;

  constructor({
    x,
    y,
    width,
    height,
    fill = "black",
    stroke,
    strokeWidth = 1,
  }: {
    x: number;
    y: number;
    width: number;
    height: number;
    fill?: FillStyle | null;
    stroke?: StrokeStyle | null;
    strokeWidth?: number;
  }) {
    super(x, y);
    this.width = width;
    this.height = height;
    this.fill = fill;
    this.stroke = stroke;
    this.strokeWidth = strokeWidth;
  }

  draw(canvas: Canvas2D) {
    canvas.ctx.save();
    const [ratioX, ratioY] = canvas.getViewBoxRatio();
    const [x, y] = canvas.toPixel(this.x, this.y);
    const w = this.width * ratioX,
      h = this.height * ratioY;
    if (this.fill) {
      let fill = this.fill;
      if (typeof fill === "string") fill = canvas.resolveCSSVariables(fill);
      canvas.ctx.fillStyle = fill;
      canvas.ctx.fillRect(...([x, y, w, h].map(Math.ceil) as Vector4D));
    }
    if (this.stroke) {
      canvas.ctx.strokeStyle = this.stroke;
      if (this.strokeWidth) canvas.ctx.lineWidth = this.strokeWidth;
      canvas.ctx.strokeRect(...([x, y, w, h].map(Math.ceil) as Vector4D));
    }
    canvas.ctx.restore();
  }
}
