type FillStyle = typeof CanvasRenderingContext2D.prototype.fillStyle;
type StrokeStyle = typeof CanvasRenderingContext2D.prototype.strokeStyle;
type Point = [number, number];

export default class Canvas2D {
  readonly ctx: CanvasRenderingContext2D;
  viewBox: [number, number, number, number];

  constructor(
    canvasEl: HTMLCanvasElement,
    viewBox?: [number, number, number, number]
  ) {
    this.ctx = canvasEl.getContext("2d")!;
    this.viewBox = viewBox ?? [0, 0, canvasEl.width, canvasEl.height];
  }

  toPixel(x: number, y: number, c = true): [number, number] {
    const [ratioX, ratioY] = this.getViewBoxRatio(c);
    return [(x - this.viewBox[0]) * ratioX, (y - this.viewBox[1]) * ratioY];
  }

  drawRect(x: number, y: number, w: number, h: number, fill: FillStyle) {
    const [ratioX, ratioY] = this.getViewBoxRatio();
    this.ctx.fillStyle = fill;
    this.ctx.fillRect(...this.toPixel(x, y), w * ratioX, h * ratioY);
  }

  getViewBoxRatio(c = true): [number, number] {
    const [viewBoxWidth, viewBoxHeight] = [
      this.viewBox[2] - this.viewBox[0],
      this.viewBox[3] - this.viewBox[1],
    ];
    const { width, height } = this.ctx.canvas;
    return [(width - +c) / viewBoxWidth, (height - +c) / viewBoxHeight];
  }

  drawLine(points: Point[], lineWidth: number, stroke: StrokeStyle) {
    if (!points.length) return;
    this.ctx.lineWidth = lineWidth;
    this.ctx.strokeStyle = stroke;

    const getCenter = (p: Point) =>
      this.toPixel(...p, lineWidth % 2 === 1).map(
        (pp) => Math.round(pp) + (lineWidth % 2) / 2
      ) as [number, number];

    this.ctx.beginPath();
    this.ctx.moveTo(...getCenter(points[0]));
    for (let i = 1; i < points.length; i++) {
      this.ctx.lineTo(...getCenter(points[i]));
    }
    this.ctx.stroke();
    this.ctx.closePath();
  }
}
