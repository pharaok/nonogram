import { NonogramGrid } from "types";

export const gridToPath = (grid: NonogramGrid) => {
  let path = "";
  grid.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell === 1) {
        path += `M ${x} ${y} h 1 v 1 h -1 v -1 `;
      }
    });
  });
  return path;
};

const MARK_PADDING = 0.2;
export const markToPath = (grid: NonogramGrid) => {
  let path = "";
  grid.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell === 2) {
        path += `M ${x + MARK_PADDING} ${y + MARK_PADDING}
                 l ${1 - 2 * MARK_PADDING} ${1 - 2 * MARK_PADDING} 
                 M ${x + 1 - MARK_PADDING} ${y + MARK_PADDING} 
                 l ${-(1 - 2 * MARK_PADDING)} ${1 - 2 * MARK_PADDING} `;
      }
    });
  });
  return path;
};
