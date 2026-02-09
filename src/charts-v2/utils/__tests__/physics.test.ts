
import { describe, it, expect } from 'vitest';
import { generateCylinderFlow, generateVortexField, lissajous, polarToCartesian } from '../physics';

describe('Physics Utilities', () => {
  describe('Vector Fields', () => {
    it('generateCylinderFlow should return vectors', () => {
      const width = 100;
      const height = 100;
      const field = generateCylinderFlow(width, height, 50, 50, 20);
      
      expect(field.length).toBeGreaterThan(0);
      expect(field[0]).toHaveProperty('x');
      expect(field[0]).toHaveProperty('y');
      expect(field[0]).toHaveProperty('vx');
      expect(field[0]).toHaveProperty('vy');
    });

    it('generateVortexField should create rotational flow', () => {
      const field = generateVortexField(100, 100, 50, 50);
      expect(field.length).toBeGreaterThan(0);
      
      // Check a point to the right of center (50, 50) -> (75, 50)
      // Vortex should point up or down depending on rotation direction
      // dy = 0, dx = 25. vx = -dy... = 0, vy = dx... > 0
      
      const rightPoint = field.find(v => Math.abs(v.x - 75) < 1 && Math.abs(v.y - 50) < 1);
      if (rightPoint) {
        expect(rightPoint.vy).not.toBe(0);
      }
    });
  });

  describe('Parametric Functions', () => {
    it('lissajous should return correct coordinates', () => {
      const point = lissajous(0, 10, 10, 1, 1, 0);
      // sin(0) = 0
      expect(point.x).toBeCloseTo(0);
      expect(point.y).toBeCloseTo(0);
      
      const pointPI2 = lissajous(Math.PI / 2, 10, 10, 1, 1, 0);
      // sin(PI/2) = 1
      expect(pointPI2.x).toBeCloseTo(10);
      expect(pointPI2.y).toBeCloseTo(10);
    });
  });

  describe('Coordinate Conversions', () => {
    it('polarToCartesian should convert correctly', () => {
      const p1 = polarToCartesian(10, 0);
      expect(p1.x).toBeCloseTo(10);
      expect(p1.y).toBeCloseTo(0);
      
      const p2 = polarToCartesian(10, Math.PI / 2);
      expect(p2.x).toBeCloseTo(0);
      expect(p2.y).toBeCloseTo(10);
    });
  });
});
