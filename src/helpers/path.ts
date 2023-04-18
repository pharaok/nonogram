export const crossPath = (x: number, y: number, crossPadding = 0.2) =>
  `M ${x + crossPadding} ${y + crossPadding}
   l ${1 - 2 * crossPadding} ${1 - 2 * crossPadding}
   m 0 ${-(1 - 2 * crossPadding)}
   l ${-(1 - 2 * crossPadding)} ${1 - 2 * crossPadding}`;
