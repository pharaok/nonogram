import { Vector4D } from "types";
import { CanvasElement } from "./types";
import Canvas2D from ".";

export class Group extends CanvasElement {
  width: number;
  height: number;
  viewBox: Vector4D;
  elements: CanvasElement[];

  constructor({
    x,
    y,
    width,
    height,
    viewBox,
    elements,
  }: {
    x: number;
    y: number;
    width: number;
    height: number;
    viewBox: Vector4D;
    elements?: CanvasElement[];
  }) {
    super(x, y);
    this.width = width;
    this.height = height;
    this.viewBox = viewBox;
    this.elements = elements ?? [];
  }
  draw(canvas: Canvas2D) {
    const groupCanvas = Object.assign(
      Object.create(Object.getPrototypeOf(canvas)),
      canvas
    ) as Canvas2D;
    const [x1, y1, x2, y2] = canvas.viewBox;
    const vbWidth = this.viewBox[2] - this.viewBox[0];
    const vbHeight = this.viewBox[3] - this.viewBox[1];
    const rx = vbWidth / this.width;
    const ry = vbHeight / this.height;
    groupCanvas.viewBox = [
      (x1 - this.x) * rx,
      (y1 - this.y) * ry,
      (x2 - this.x) * rx,
      (y2 - this.y) * ry,
    ];
    this.elements.forEach((el) => {
      el.draw(groupCanvas);
    });
  }

  add(...elements: CanvasElement[]) {
    this.elements.push(...elements);
  }
}
