import { NonogramGrid } from "types";

export const gridToPath = (grid: NonogramGrid) => {
  let path = "";
  grid.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell) {
        path += `M ${x} ${y} h 1 v 1 h -1 v -1 `;
      }
    });
  });
  return path;
};
