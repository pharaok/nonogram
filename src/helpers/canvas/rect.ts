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
    const ratio = canvas.getPixelRatio();
    const [x, y] = canvas.toPixel(this.x, this.y);
    const w = this.width * ratio,
      h = this.height * ratio;
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
