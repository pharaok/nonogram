import { clamp } from "lodash-es";

type FillStyle = typeof CanvasRenderingContext2D.prototype.fillStyle;
type StrokeStyle = typeof CanvasRenderingContext2D.prototype.strokeStyle;
type Point = [number, number];
type Vector4D = [number, number, number, number];

export default class Canvas2D {
  readonly ctx: CanvasRenderingContext2D;

  viewBox: Vector4D;
  // extra "padding" pixels outside viewBox
  // [left, top, right, bottom]
  extra: Vector4D;

  constructor(
    canvasEl: HTMLCanvasElement,
    viewBox?: Vector4D,
    extra?: Vector4D
  ) {
    this.ctx = canvasEl.getContext("2d")!;
    this.viewBox = viewBox ?? [0, 0, canvasEl.width, canvasEl.height];
    this.extra = extra ?? [0, 0, 0, 0];
  }

  toPixel(x: number, y: number): [number, number] {
    const ratios = this.getViewBoxRatio();
    const { width, height } = this.ctx.canvas;
    const dimensions = [width, height];
    return [x, y].map(
      (a, i) =>
        clamp(
          (a - this.viewBox[i]) * ratios[i],
          -this.extra[i],
          dimensions[i] + this.extra[i + 2]
        ) + this.extra[i]
    ) as [number, number];
  }

  drawRect(x: number, y: number, w: number, h: number, fill: FillStyle) {
    const [ratioX, ratioY] = this.getViewBoxRatio();
    this.ctx.fillStyle = fill;
    this.ctx.fillRect(
      ...([...this.toPixel(x, y), w * ratioX, h * ratioY].map(
        Math.round
      ) as Vector4D)
    );
  }

  getViewBoxRatio(): [number, number] {
    const [viewBoxWidth, viewBoxHeight] = [
      this.viewBox[2] - this.viewBox[0],
      this.viewBox[3] - this.viewBox[1],
    ];
    const { width, height } = this.ctx.canvas;
    return [
      (width - this.extra[0] - this.extra[2]) / viewBoxWidth,
      (height - this.extra[1] - this.extra[3]) / viewBoxHeight,
    ];
  }

  drawLine(points: Point[], lineWidth: number, stroke: StrokeStyle) {
    if (!points.length) return;
    this.ctx.lineWidth = lineWidth;
    this.ctx.strokeStyle = stroke;

    const getCenter = (p: Point) =>
      this.toPixel(...p).map((pp) => Math.floor(pp) + (lineWidth % 2) / 2) as [
        number,
        number
      ];

    this.ctx.beginPath();
    this.ctx.moveTo(...getCenter(points[0]));
    for (let i = 1; i < points.length; i++) {
      this.ctx.lineTo(...getCenter(points[i]));
    }
    this.ctx.stroke();
    this.ctx.closePath();
  }

  clear() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

  fillText(text: string, x: number, y: number, font: string, fill: FillStyle) {
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.font = font;
    this.ctx.fillStyle = fill;
    [x, y] = this.toPixel(x, y);
    const fix = this.ctx.measureText(text).actualBoundingBoxDescent / 2;
    this.ctx.fillText(text, x, y + fix);
  }
}
