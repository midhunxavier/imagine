import { extent } from 'd3-array';
import { scaleLinear } from 'd3-scale';

export type Point = { x: number; y: number };

export function extentX(points: Point[]): [number, number] {
  const ex = extent(points, (d) => d.x);
  return [ex[0] ?? 0, ex[1] ?? 1];
}

export function extentY(points: Point[]): [number, number] {
  const ex = extent(points, (d) => d.y);
  return [ex[0] ?? 0, ex[1] ?? 1];
}

export function linearScale(domain: [number, number], range: [number, number]) {
  return scaleLinear(domain, range);
}

