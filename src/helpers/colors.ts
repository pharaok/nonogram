import { chunk, kebabCase } from "lodash-es";
import { Color } from "settings";

export const hexToRGB = (hex: string) =>
  chunk(hex.slice(1).split(""), 2)
    .map((c) => parseInt(c.join(""), 16))
    .join(" ");
export const RGBToHex = (rgb: string) =>
  `#${rgb
    .split(" ")
    .map((n) => parseInt(n).toString(16).padStart(2, "0").toUpperCase())
    .join("")}`;
export const toRGB = (s: string) => {
  if (s[0] === "#") return hexToRGB(s);
  return s;
};

export const setDocumentColor = (color: Color, value: string) =>
  (document.querySelector(":root") as HTMLElement).style.setProperty(
    `--color-${kebabCase(color)}`,
    toRGB(value)
  );
