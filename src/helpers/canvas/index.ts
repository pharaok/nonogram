import { clamp } from "lodash-es";
import { PointerEvent } from "react";
import { Point, Vector4D } from "types";
import { CanvasElement, FillStyle } from "./types";

export default class Canvas2D {
  readonly ctx: CanvasRenderingContext2D;

  viewBox: Vector4D;
  // extra "padding" pixels outside viewBox
  // [left, top, right, bottom]
  extra: Vector4D;
  scale: number;
  elements: CanvasElement[];

  constructor(
    canvasEl: HTMLCanvasElement,
    viewBox?: Vector4D,
    extra?: Vector4D
  ) {
    this.ctx = canvasEl.getContext("2d")!;
    this.viewBox = viewBox ?? [0, 0, canvasEl.width, canvasEl.height];
    this.scale = window.devicePixelRatio;
    this.extra = (extra ?? [0, 0, 0, 0]).map((n) => n * this.scale) as Vector4D;
    this.elements = [];
  }

  add(element: CanvasElement) {
    this.elements.push(element);
    this.draw();
  }

  draw() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.elements.forEach((el) => {
      el.draw(this);
    });
  }

  toPixel(x: number, y: number): Point {
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
    ) as Point;
  }

  getViewBoxRatio(): Point {
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

  // drawPath(
  //   path: string,
  //   lineWidth: number,
  //   stroke: StrokeStyle,
  //   lineCap: LineCap = "butt"
  // ) {
  //   if (typeof stroke === "string") stroke = this.resolveCSSVariables(stroke);
  //   this.ctx.save();
  //   this.ctx.strokeStyle = stroke;
  //   this.ctx.lineWidth = lineWidth;
  //   this.ctx.lineCap = lineCap;
  //
  //   const commandRegex = /^\s*([A-Za-z])/;
  //   const decimalRegex = /([-+]?\d+(?:\.\d+)?)/.source;
  //   const pointRegex =
  //     /^\s+/.source + decimalRegex + /\s+/.source + decimalRegex;
  //   let m = path.match(commandRegex);
  //   let [x, y] = [0, 0];
  //   let i = 0;
  //   this.ctx.beginPath();
  //   while (m !== null) {
  //     i += m[0].length;
  //     if ("mM".includes(m[1])) {
  //       if (m[1] === "M") [x, y] = [0, 0];
  //
  //       const nm = path.slice(i).match(pointRegex);
  //       if (nm === null) break;
  //       i += nm[0].length;
  //       [x, y] = nm.slice(1, 3).map((n, i) => +n + [x, y][i]);
  //       this.ctx.moveTo(...this.toPixel(x, y));
  //     } else if ("LlHhVv".includes(m[1])) {
  //       if (m[1] === "L") [x, y] = [0, 0];
  //       else if (m[1] === "H") x = 0;
  //       else if (m[1] === "V") y = 0;
  //
  //       if ("Ll".includes(m[1])) {
  //         const nm = path.slice(i).match(pointRegex);
  //         if (nm === null) break;
  //         i += nm[0].length;
  //         [x, y] = nm.slice(1, 3).map((n, i) => +n + [x, y][i]);
  //       } else {
  //         const nm = path.slice(i).match(/^\s+/.source + decimalRegex);
  //         if (nm === null) break;
  //         i += nm[0].length;
  //         if ("Hh".includes(m[1])) x += +nm[1];
  //         else y += +nm[1];
  //       }
  //       this.ctx.lineTo(...this.toPixel(x, y));
  //     }
  //
  //     m = path.slice(i).match(commandRegex);
  //   }
  //   this.ctx.stroke();
  //   this.ctx.closePath();
  //   this.ctx.restore();
  // }

  clear() {
    this.elements = [];
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

  fillText(text: string, x: number, y: number, font: string, fill: FillStyle) {
    if (typeof fill === "string") fill = this.resolveCSSVariables(fill);
    this.ctx.save();
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.font = font;
    this.ctx.fillStyle = fill;
    [x, y] = this.toPixel(x, y);
    const fix = this.ctx.measureText(text).actualBoundingBoxDescent / 2;
    this.ctx.fillText(text, x, y + fix);
    this.ctx.restore();
  }

  eventToCoords(e: PointerEvent<HTMLCanvasElement>): Point {
    const [ratioX, ratioY] = this.getViewBoxRatio();
    const { top, left } = e.currentTarget.getBoundingClientRect();
    const [cx, cy] = [
      ((e.clientX - left - this.extra[0]) * this.scale) / ratioX,
      ((e.clientY - top - this.extra[1]) * this.scale) / ratioY,
    ].map(Math.floor);
    return [cx, cy];
  }

  resolveCSSVariables(s: string) {
    const matches = s.matchAll(/var\((.*?)\)/g);
    let resolved = "";
    let prevIndex = 0;
    for (const match of matches) {
      resolved += s.slice(prevIndex, match.index);
      resolved += getComputedStyle(this.ctx.canvas).getPropertyValue(match[1]);
      prevIndex = match.index! + match[0].length;
    }
    resolved += s.slice(prevIndex);
    return resolved;
  }
}

// export const drawGridLines = (
//   canvas: Canvas2D,
//   x1: number,
//   y1: number,
//   x2: number,
//   y2: number,
//   getLineWidth: (a: number, i: number) => number,
//   getLineStroke: (a: number, i: number) => StrokeStyle
// ) => {
//   for (let a = 0; a < 2; a++) {
//     for (let i = [x1, y1][a]; i <= [x2, y2][a]; i++) {
//       const p1: Point = [-Infinity, -Infinity];
//       const p2: Point = [Infinity, Infinity];
//       p1[a] = i;
//       p2[a] = i;
//
//       canvas.drawLine(
//         [p1, p2],
//         getLineWidth(a, i) * canvas.scale,
//         getLineStroke(a, i)
//       );
//     }
//   }
// };
//
// export const drawGrid = <T>(
//   canvas: Canvas2D,
//   grid: T[][],
//   x: number,
//   y: number,
//   drawCell: (canvas: Canvas2D, value: T, x: number, y: number) => void
// ) => {
//   grid.forEach((row, gy) => {
//     row.forEach((cell, gx) => {
//       drawCell(canvas, cell, x + gx, y + gy);
//     });
//   });
// };
//
export { Rect } from "./rect";
export { Line } from "./line";
