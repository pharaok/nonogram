import { clamp } from "lodash-es";

type FillStyle = typeof CanvasRenderingContext2D.prototype.fillStyle;
type StrokeStyle = typeof CanvasRenderingContext2D.prototype.strokeStyle;
type Point = [number, number];
type Vector4D = [number, number, number, number];
type LineCap = typeof CanvasRenderingContext2D.prototype.lineCap;

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
    return [x, y].map((a, i) =>
      Math.round(
        clamp(
          (a - this.viewBox[i]) * ratios[i],
          -this.extra[i],
          dimensions[i] + this.extra[i + 2]
        ) + this.extra[i]
      )
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

  drawLine(
    points: Point[],
    lineWidth: number,
    stroke: StrokeStyle,
    lineCap: LineCap = "butt"
  ) {
    if (!points.length) return;
    this.ctx.lineWidth = lineWidth;
    this.ctx.strokeStyle = stroke;
    this.ctx.lineCap = lineCap;

    const getCenter = (p: Point) =>
      this.toPixel(...p).map((pp) => pp + (lineWidth % 2) / 2) as [
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

  drawPath(
    path: string,
    lineWidth: number,
    stroke: StrokeStyle,
    lineCap: LineCap = "butt"
  ) {
    this.ctx.save();
    this.ctx.strokeStyle = stroke;
    this.ctx.lineWidth = lineWidth;
    this.ctx.lineCap = lineCap;

    const commandRegex = /^\s*([A-Za-z])/;
    const decimalRegex = /([-+]?\d+(?:\.\d+)?)/.source;
    const pointRegex =
      /^\s+/.source + decimalRegex + /\s+/.source + decimalRegex;
    let m = path.match(commandRegex);
    let [x, y] = [0, 0];
    let i = 0;
    this.ctx.beginPath();
    while (m !== null) {
      console.log(x, y);
      i += m[0].length;
      if ("mM".includes(m[1])) {
        if (m[1] === "M") [x, y] = [0, 0];

        const nm = path.slice(i).match(pointRegex);
        if (nm === null) break;
        i += nm[0].length;
        [x, y] = nm.slice(1, 3).map((n, i) => +n + [x, y][i]);
        this.ctx.moveTo(...this.toPixel(x, y));
      } else if ("LlHhVv".includes(m[1])) {
        if (m[1] === "L") [x, y] = [0, 0];
        else if (m[1] === "H") x = 0;
        else if (m[1] === "V") y = 0;

        if ("Ll".includes(m[1])) {
          const nm = path.slice(i).match(pointRegex);
          if (nm === null) break;
          i += nm[0].length;
          [x, y] = nm.slice(1, 3).map((n, i) => +n + [x, y][i]);
        } else {
          const nm = path.slice(i).match(/^\s+/.source + decimalRegex);
          if (nm === null) break;
          i += nm[0].length;
          if ("Hh".includes(m[1])) x += +nm[1];
          else y += +nm[1];
        }
        this.ctx.lineTo(...this.toPixel(x, y));
      }
      console.log(x, y);

      m = path.slice(i).match(commandRegex);
    }
    this.ctx.stroke();
    this.ctx.closePath();
    this.ctx.restore();
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

export const drawGridLines = (
  canvas: Canvas2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  getLineWidth: (a: number, i: number) => number
) => {
  for (let a = 0; a < 2; a++) {
    for (let i = [x1, y1][a]; i <= [x2, y2][a]; i++) {
      const p1: [number, number] = [-Infinity, -Infinity];
      const p2: [number, number] = [Infinity, Infinity];
      p1[a] = i;
      p2[a] = i;

      canvas.drawLine([p1, p2], getLineWidth(a, i), "black");
    }
  }
};
