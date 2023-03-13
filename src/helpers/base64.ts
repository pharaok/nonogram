import { NonogramGrid } from "types";

const digits =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

export const bigIntToBase64 = (n: bigint) => {
  if (n === BigInt(0)) {
    return "A";
  }
  let b64 = "";
  while (n) {
    let c = n & BigInt(63);
    b64 = digits[Number(c)] + b64;
    n >>= BigInt(6);
  }
  return b64;
};

export const base64ToBigInt = (b64: string) => {
  let bi = BigInt(0);
  for (let c of b64) {
    bi <<= BigInt(6);
    bi |= BigInt(digits.indexOf(c));
  }
  return bi;
};

export const gridToBase64 = (grid: NonogramGrid) => {
  let bi = BigInt(0);
  grid.forEach((row, i) => {
    row.forEach((cell, j) => {
      bi |= BigInt(cell) << BigInt(i * grid[0].length + j);
    });
  });
  return bigIntToBase64(bi);
};

export const base64ToGrid = (b64: string, width: number, height: number) => {
  let grid = Array(height);
  let bi = base64ToBigInt(b64);
  for (let i = 0; i < height; i++) {
    grid[i] = Array(width);
    for (let j = 0; j < width; j++) {
      let c = bi & BigInt(1);
      grid[i][j] = Number(c);
      bi >>= BigInt(1);
    }
  }
  return grid;
};
