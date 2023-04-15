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

  drawRect(
    x: number,
    y: number,
    w: number,
    h: number,
    fill: typeof CanvasRenderingContext2D.prototype.fillStyle
  ) {
    const [ratioX, ratioY] = this.getViewBoxRatio();
    this.ctx.fillStyle = fill;
    this.ctx.fillRect(
      (x - this.viewBox[0]) * ratioX,
      (y - this.viewBox[1]) * ratioY,
      w * ratioX,
      h * ratioY
    );
  }

  getViewBoxRatio() {
    const [viewBoxWidth, viewBoxHeight] = [
      this.viewBox[2] - this.viewBox[0],
      this.viewBox[3] - this.viewBox[1],
    ];
    const { width, height } = this.ctx.canvas;
    return [width / viewBoxWidth, height / viewBoxHeight];
  }
}
