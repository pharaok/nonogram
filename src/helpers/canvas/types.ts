import Canvas2D from ".";

export type FillStyle = typeof CanvasRenderingContext2D.prototype.fillStyle;
type StrokeStyle = typeof CanvasRenderingContext2D.prototype.strokeStyle;
export default StrokeStyle;
export type LineCap = typeof CanvasRenderingContext2D.prototype.lineCap;

export abstract class CanvasElement {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  abstract draw(canvas: Canvas2D): void;
}
