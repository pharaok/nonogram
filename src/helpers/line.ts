type Vector2D = [number, number];

// bresenham's line drawing algorithm
export const plotLine = (
  from: Vector2D,
  to: Vector2D,
  callback: (coords: Vector2D) => void
) => {
  const d = [to[0] - from[0], to[1] - from[1]].map(Math.abs);
  const axis = +(d[1] > d[0]); // the axis with longest projection
  if (from[axis] > to[axis]) {
    // ensure from point is left/above to point
    const tmp = from;
    from = to;
    to = tmp;
  }

  let e = 2 * d[+!axis] - d[axis];
  let incr = from[+!axis] > to[+!axis] ? -1 : 1;

  let curr: Vector2D = [...from];
  for (curr[axis] = from[axis]; curr[axis] <= to[axis]; curr[axis]++) {
    // iterate over the axis with longest projection,
    // and increment the other axis when needed.
    callback(curr);
    if (e > 0) {
      curr[+!axis] += incr;
      e -= 2 * d[axis];
    }
    e += 2 * d[+!axis];
  }
};
