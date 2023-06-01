import Canvas2D from ".";
import StrokeStyle, { CanvasElement, LineCap } from "./types";

export class Path extends CanvasElement {
  path: string;
  width: number;
  stroke: StrokeStyle;
  lineCap: LineCap;

  constructor({
    path,
    width,
    stroke = "black",
    lineCap = "butt",
  }: {
    path: string;
    width: number;
    stroke?: StrokeStyle;
    lineCap?: LineCap;
  }) {
    super(0, 0);
    this.path = path;
    this.width = width;
    this.stroke = stroke;
    this.lineCap = lineCap;
  }

  draw(canvas: Canvas2D) {
    canvas.ctx.save();
    let stroke = this.stroke;
    if (typeof stroke === "string") stroke = canvas.resolveCSSVariables(stroke);
    canvas.ctx.strokeStyle = stroke;
    canvas.ctx.lineWidth = this.width * canvas.getPixelRatio();
    canvas.ctx.lineCap = this.lineCap;

    const commandRegex = /^\s*([A-Za-z])/;
    const decimalRegex = /([-+]?\d+(?:\.\d+)?)/.source;
    const pointRegex =
      /^\s+/.source + decimalRegex + /\s+/.source + decimalRegex;
    let m = this.path.match(commandRegex);
    let [x, y] = [0, 0];
    let i = 0;
    canvas.ctx.beginPath();
    while (m !== null) {
      i += m[0].length;
      if ("mM".includes(m[1])) {
        if (m[1] === "M") [x, y] = [0, 0];

        const nm = this.path.slice(i).match(pointRegex);
        if (nm === null) break;
        i += nm[0].length;
        [x, y] = nm.slice(1, 3).map((n, i) => +n + [x, y][i]);
        canvas.ctx.moveTo(...canvas.toPixel(x, y));
      } else if ("LlHhVv".includes(m[1])) {
        if (m[1] === "L") [x, y] = [0, 0];
        else if (m[1] === "H") x = 0;
        else if (m[1] === "V") y = 0;

        if ("Ll".includes(m[1])) {
          const nm = this.path.slice(i).match(pointRegex);
          if (nm === null) break;
          i += nm[0].length;
          [x, y] = nm.slice(1, 3).map((n, i) => +n + [x, y][i]);
        } else {
          const nm = this.path.slice(i).match(/^\s+/.source + decimalRegex);
          if (nm === null) break;
          i += nm[0].length;
          if ("Hh".includes(m[1])) x += +nm[1];
          else y += +nm[1];
        }
        canvas.ctx.lineTo(...canvas.toPixel(x, y));
      }

      m = this.path.slice(i).match(commandRegex);
    }
    canvas.ctx.stroke();
    canvas.ctx.closePath();
    canvas.ctx.restore();
  }
}
