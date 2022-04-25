export function stringify_points(points: [number, number][]) {
  return points.map(([x, y]) => `${x},${y}`).join(" ");
}

export function midpoint(
  [x1, y1]: [number, number],
  [x2, y2]: [number, number]
): [number, number] {
  return [(x1 + x2) / 2, (y1 + y2) / 2];
}

export function last<T extends unknown>(array: T[]): T {
  return array[array.length - 1];
}

export function first<T extends unknown>(array: T[]): T {
  return array[0];
}
