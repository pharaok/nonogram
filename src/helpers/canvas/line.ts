import { Point } from "types";
import StrokeStyle, { CanvasElement, LineCap } from "./types";
import Canvas2D from ".";

export class Line extends CanvasElement {
  strokeWidth: number;
  points: Point[];
  stroke: StrokeStyle;
  lineCap: LineCap;

  constructor({
    points,
    width = 1,
    stroke = "black",
    lineCap = "butt",
  }: {
    points: Point[];
    width?: number;
    stroke?: StrokeStyle;
    lineCap?: LineCap;
  }) {
    super(...points[0]);
    this.strokeWidth = width;
    this.points = points;
    this.stroke = stroke;
    this.lineCap = lineCap;
  }

  draw(canvas: Canvas2D) {
    canvas.ctx.save();

    let stroke = this.stroke;
    if (typeof stroke === "string") stroke = canvas.resolveCSSVariables(stroke);
    if (this.points.length < 2) return;
    if (!this.strokeWidth) return;
    canvas.ctx.lineWidth = this.strokeWidth;
    canvas.ctx.strokeStyle = stroke;
    canvas.ctx.lineCap = this.lineCap;

    canvas.ctx.beginPath();
    const points = this.points.map(
      (p) =>
        canvas
          .toPixel(...p)
          .map((pp) => pp + (this.strokeWidth % 2) / 2) as Point
    );

    canvas.ctx.moveTo(...points[0]);
    for (let i = 1; i < points.length; i++) {
      canvas.ctx.lineTo(...points[i]);
    }
    canvas.ctx.stroke();
    canvas.ctx.closePath();
    canvas.ctx.restore();
  }
}
