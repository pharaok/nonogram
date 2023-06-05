import Canvas2D from ".";
import StrokeStyle, { CanvasElement, FillStyle } from "./types";

export class Text extends CanvasElement {
  text: string;
  font: string;
  fontSize: number;
  fill?: FillStyle | null;
  stroke?: StrokeStyle | null;

  constructor({
    x,
    y,
    text,
    font = "sans-serif",
    fontSize,
    fill = "black",
    stroke,
  }: {
    x: number;
    y: number;
    text: string;
    font?: string;
    fontSize: number;
    fill?: FillStyle | null;
    stroke?: StrokeStyle | null;
  }) {
    super(x, y);
    this.text = text;
    this.font = font;
    this.fontSize = fontSize;
    this.fill = fill;
    this.stroke = stroke;
  }

  draw(canvas: Canvas2D) {
    canvas.ctx.save();
    let [x, y] = canvas.toPixel(this.x, this.y);
    const fix = canvas.ctx.measureText(this.text).actualBoundingBoxDescent / 2;
    y += fix;
    canvas.ctx.textAlign = "center";
    canvas.ctx.textBaseline = "middle";
    canvas.ctx.font = `${this.fontSize * canvas.getPixelRatio()[1]}px ${
      this.font
    }`;

    if (this.fill) {
      let fill = this.fill;
      if (typeof fill === "string") fill = canvas.resolveCSSVariables(fill);
      canvas.ctx.fillStyle = fill;
      canvas.ctx.fillText(this.text, x, y);
    }
    if (this.stroke) {
      let stroke = this.stroke;
      if (typeof stroke === "string")
        stroke = canvas.resolveCSSVariables(stroke);
      canvas.ctx.strokeStyle = stroke;
      canvas.ctx.strokeText(this.text, x, y);
    }
    canvas.ctx.restore();
  }
}
