export const gridToPath = (grid: Array<Array<number>>) => {
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
