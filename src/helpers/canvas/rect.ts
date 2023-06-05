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
    const [ratioX, ratioY] = canvas.getPixelRatio();
    const [x, y] = canvas.toPixel(this.x, this.y);
    let w = this.width * ratioX,
      h = this.height * ratioY;
    if (w === Infinity) w = canvas.ctx.canvas.width;
    if (h === Infinity) h = canvas.ctx.canvas.height;

    if (this.fill) {
      let fill = this.fill;
      if (typeof fill === "string") fill = canvas.resolveCSSVariables(fill);
      canvas.ctx.fillStyle = fill;
      canvas.ctx.fillRect(...([x, y, w, h].map(Math.ceil) as Vector4D));
    }
    if (this.stroke) {
      let stroke = this.stroke;
      if (typeof stroke === "string")
        stroke = canvas.resolveCSSVariables(stroke);
      canvas.ctx.strokeStyle = stroke;
      if (this.strokeWidth) canvas.ctx.lineWidth = this.strokeWidth;
      canvas.ctx.strokeRect(...([x, y, w, h].map(Math.ceil) as Vector4D));
    }
    canvas.ctx.restore();
  }
}
