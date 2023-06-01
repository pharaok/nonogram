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
  elements: CanvasElement[];

  constructor(
    canvasEl: HTMLCanvasElement,
    viewBox?: Vector4D,
    extra?: Vector4D
  ) {
    this.ctx = canvasEl.getContext("2d")!;
    this.viewBox = viewBox ?? [0, 0, canvasEl.width, canvasEl.height];
    this.extra = extra ?? [0, 0, 0, 0];
    this.elements = [];

    this.setScale();
  }

  setScale() {
    const transform = this.ctx.getTransform();

    const [viewBoxWidth, viewBoxHeight] = [
      this.viewBox[2] - this.viewBox[0],
      this.viewBox[3] - this.viewBox[1],
    ];
    const { width, height } = this.ctx.canvas;
    const [ratioX, ratioY] = [
      (width - this.extra[0] - this.extra[2]) / viewBoxWidth,
      (height - this.extra[1] - this.extra[3]) / viewBoxHeight,
    ];

    const min = Math.abs(ratioX) < Math.abs(ratioY) ? ratioX : ratioY;
    transform.a = window.devicePixelRatio * (ratioX / min);
    transform.d = window.devicePixelRatio * (ratioY / min);
    this.ctx.setTransform(transform);
  }

  add(...elements: CanvasElement[]) {
    this.elements.push(...elements);
  }

  draw() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.elements.forEach((el) => {
      el.draw(this);
    });
  }

  toPixel(x: number, y: number): Point {
    const ratio = this.getPixelRatio();
    const { width, height } = this.ctx.canvas;
    const dimensions = [width, height];
    return [x, y].map((a, i) =>
      Math.round(
        clamp(
          (a - this.viewBox[i]) * ratio,
          -this.extra[i],
          dimensions[i] + this.extra[i + 2]
        ) + this.extra[i]
      )
    ) as Point;
  }

  getPixelRatio(): number {
    const viewBoxWidth = this.viewBox[2] - this.viewBox[0];
    const { a: scaleX } = this.ctx.getTransform();
    const { width } = this.ctx.canvas;
    return (width - this.extra[0] - this.extra[2]) / scaleX / viewBoxWidth;
  }

  clear() {
    this.elements = [];
    this.draw();
  }

  eventToCoords(e: PointerEvent<HTMLCanvasElement>): Point {
    const ratio = this.getPixelRatio();
    const { top, left } = e.currentTarget.getBoundingClientRect();
    const [cx, cy] = [
      (e.clientX - left - this.extra[0]) / ratio,
      (e.clientY - top - this.extra[1]) / ratio,
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

export { Rect } from "./rect";
export { Line } from "./line";
export { Text } from "./text";
export { Path } from "./path";
