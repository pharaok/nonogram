import { clamp } from "lodash-es";
import { PointerEvent } from "react";
import { Point, Vector4D } from "types";
import { CanvasElement } from "./types";

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
    extra: Vector4D = [0, 0, 0, 0]
  ) {
    this.ctx = canvasEl.getContext("2d")!;
    this.viewBox = viewBox ?? [0, 0, canvasEl.width, canvasEl.height];
    this.extra = extra;
    this.elements = [];
  }

  setTransform() {
    this.ctx.setTransform({
      a: window.devicePixelRatio,
      d: window.devicePixelRatio,
    });
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
    const ratios = this.getPixelRatio();
    const { width, height } = this.ctx.canvas;
    return [x, y].map((a, i) =>
      Math.round(
        clamp(
          (a - this.viewBox[i]) * ratios[i],
          -this.extra[i],
          [width, height][i] + this.extra[i + 2]
        ) + this.extra[i]
      )
    ) as Point;
  }

  getPixelRatio(): [number, number] {
    const viewBoxWidth = this.viewBox[2] - this.viewBox[0];
    const viewBoxHeight = this.viewBox[3] - this.viewBox[1];
    const { width, height } = this.ctx.canvas;
    const { a, d } = this.ctx.getTransform();
    return [
      (width / a - this.extra[0] - this.extra[2]) / viewBoxWidth,
      (height / d - this.extra[1] - this.extra[3]) / viewBoxHeight,
    ];
  }

  clear() {
    this.elements = [];
    this.draw();
  }

  eventToCoords(e: PointerEvent<HTMLCanvasElement>): Point {
    const [ratioX, ratioY] = this.getPixelRatio();
    const { top, left } = e.currentTarget.getBoundingClientRect();
    const [cx, cy] = [
      (e.clientX - left - this.extra[0]) / ratioX,
      (e.clientY - top - this.extra[1]) / ratioY,
    ].map(Math.floor);
    return [cx + this.viewBox[0], cy + this.viewBox[1]];
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

export { Line } from "./line";
export { Path } from "./path";
export { Rect } from "./rect";
export { Text } from "./text";
export { Group } from "./group";
