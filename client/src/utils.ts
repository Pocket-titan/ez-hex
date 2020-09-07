export const stringify_points = (points: [number, number][]) => {
  return points.map(([x, y]) => `${x},${y}`).join(" ");
};
