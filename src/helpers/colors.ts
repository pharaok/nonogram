import { chunk, kebabCase } from "lodash-es";
import { Color } from "settings";

export const isHex = (s: any): s is string =>
  typeof s === "string" && /^#[0-9A-F]{6}$/i.test(s);
export const isRGB = (s: any): s is string =>
  typeof s === "string" &&
  s.split(" ").every((x) => parseInt(x) < 256) &&
  s.split(" ").length === 3;
export const isColor = (s: any) => isHex(s) || isRGB(s);

export const hexToRGB = (s: string) => {
  if (!isHex(s)) return null;
  return chunk(s.slice(1).split(""), 2)
    .map((c) => parseInt(c.join(""), 16))
    .join(" ");
};
export const RGBToHex = (s: any) => {
  if (!isRGB(s)) return null;
  return `#${s
    .split(" ")
    .map((n) => parseInt(n).toString(16).padStart(2, "0").toUpperCase())
    .join("")}`;
};
export const toRGB = (s: any) => {
  if (isHex(s)) return hexToRGB(s);
  return s;
};
export const toHex = (s: any) => {
  if (isRGB(s)) return RGBToHex(s);
  return s;
};

export const setDocumentColor = (color: Color, value: string) =>
  (document.querySelector(":root") as HTMLElement).style.setProperty(
    `--color-${kebabCase(color)}`,
    toRGB(value)
  );
