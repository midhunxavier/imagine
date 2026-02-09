/**
 * Physics Utilities - Mathematical functions and field calculations
 */

export interface Vector {
  x: number;
  y: number;
  vx: number;
  vy: number;
  magnitude?: number;
}

export interface ScalarField {
  x: number;
  y: number;
  value: number;
}

export interface ContourLevel {
  value: number;
  color: string;
  label?: string;
}

/**
 * Sample vector field: fluid flow around a cylinder
 */
export function generateCylinderFlow(
  width: number,
  height: number,
  cylinderX: number,
  cylinderY: number,
  cylinderRadius: number
): Vector[] {
  const vectors: Vector[] = [];
  const gridSize = 20;
  
  for (let x = 0; x < width; x += gridSize) {
    for (let y = 0; y < height; y += gridSize) {
      const dx = x - cylinderX;
      const dy = y - cylinderY;
      const r = Math.sqrt(dx * dx + dy * dy);
      
      if (r < cylinderRadius) continue; // Inside cylinder
      
      // Uniform flow with cylinder perturbation
      const theta = Math.atan2(dy, dx);
      const U = 1; // Free stream velocity
      
      const vx = U * (1 - (cylinderRadius * cylinderRadius) / (r * r)) * Math.cos(theta) * Math.cos(theta) +
                 U * (1 + (cylinderRadius * cylinderRadius) / (r * r)) * Math.sin(theta) * Math.sin(theta);
      const vy = -U * (1 - (cylinderRadius * cylinderRadius) / (r * r)) * Math.sin(theta) * Math.cos(theta) +
                 U * (1 + (cylinderRadius * cylinderRadius) / (r * r)) * Math.sin(theta) * Math.cos(theta);
      
      vectors.push({
        x,
        y,
        vx: vx * 15,
        vy: vy * 15,
        magnitude: Math.sqrt(vx * vx + vy * vy)
      });
    }
  }
  
  return vectors;
}

/**
 * Generate vortex field
 */
export function generateVortexField(
  width: number,
  height: number,
  vortexX: number,
  vortexY: number
): Vector[] {
  const vectors: Vector[] = [];
  const gridSize = 25;
  
  for (let x = 0; x < width; x += gridSize) {
    for (let y = 0; y < height; y += gridSize) {
      const dx = x - vortexX;
      const dy = y - vortexY;
      const r = Math.sqrt(dx * dx + dy * dy);
      
      if (r < 5) continue;
      
      // Vortex velocity field
      const vx = -dy / r * 20;
      const vy = dx / r * 20;
      
      vectors.push({
        x,
        y,
        vx,
        vy,
        magnitude: 20
      });
    }
  }
  
  return vectors;
}

/**
 * Generate saddle point field
 */
export function generateSaddleField(
  width: number,
  height: number
): Vector[] {
  const vectors: Vector[] = [];
  const gridSize = 25;
  const centerX = width / 2;
  const centerY = height / 2;
  
  for (let x = 0; x < width; x += gridSize) {
    for (let y = 0; y < height; y += gridSize) {
      const dx = (x - centerX) / 50;
      const dy = (y - centerY) / 50;
      
      // Saddle point: dx/dt = x, dy/dt = -y
      const vx = dx * 10;
      const vy = -dy * 10;
      
      vectors.push({
        x,
        y,
        vx,
        vy,
        magnitude: Math.sqrt(vx * vx + vy * vy)
      });
    }
  }
  
  return vectors;
}

/**
 * Generate scalar field for contour plot
 */
export function generateGaussianField(
  width: number,
  height: number
): ScalarField[] {
  const field: ScalarField[] = [];
  const resolution = 10;
  
  // Multiple Gaussian peaks
  const peaks = [
    { x: width * 0.3, y: height * 0.3, sigma: 80, amplitude: 100 },
    { x: width * 0.7, y: height * 0.7, sigma: 60, amplitude: 80 },
    { x: width * 0.5, y: height * 0.5, sigma: 100, amplitude: -50 }
  ];
  
  for (let x = 0; x <= width; x += resolution) {
    for (let y = 0; y <= height; y += resolution) {
      let value = 0;
      
      peaks.forEach(peak => {
        const dx = x - peak.x;
        const dy = y - peak.y;
        value += peak.amplitude * Math.exp(-(dx * dx + dy * dy) / (2 * peak.sigma * peak.sigma));
      });
      
      field.push({ x, y, value });
    }
  }
  
  return field;
}

/**
 * Generate phase diagram data (simplified water phase diagram)
 */
export interface PhaseRegion {
  name: string;
  temperature: [number, number];
  pressure: [number, number];
  color: string;
}

export function generatePhaseDiagram(): PhaseRegion[] {
  return [
    { name: 'Solid', temperature: [0, 273], pressure: [0.001, 100], color: '#E3F2FD' },
    { name: 'Liquid', temperature: [273, 373], pressure: [0.001, 100], color: '#BBDEFB' },
    { name: 'Gas', temperature: [373, 1000], pressure: [0.001, 100], color: '#90CAF9' },
    { name: 'Supercritical', temperature: [647, 1000], pressure: [22, 100], color: '#64B5F6' }
  ];
}

/**
 * Parametric equations
 */
export function lissajous(t: number, A: number, B: number, a: number, b: number, delta: number) {
  return {
    x: A * Math.sin(a * t + delta),
    y: B * Math.sin(b * t)
  };
}

export function spiral(t: number, a: number, b: number) {
  return {
    x: (a + b * t) * Math.cos(t),
    y: (a + b * t) * Math.sin(t)
  };
}

export function cycloid(t: number, r: number) {
  return {
    x: r * (t - Math.sin(t)),
    y: r * (1 - Math.cos(t))
  };
}

/**
 * Polar to Cartesian conversion
 */
export function polarToCartesian(r: number, theta: number) {
  return {
    x: r * Math.cos(theta),
    y: r * Math.sin(theta)
  };
}

/**
 * Sample data generators
 */
export const samplePhysicsData = {
  cylinderFlow: (w: number, h: number) => generateCylinderFlow(w, h, w / 2, h / 2, 40),
  vortexField: (w: number, h: number) => generateVortexField(w, h, w / 2, h / 2),
  saddleField: (w: number, h: number) => generateSaddleField(w, h),
  gaussianField: (w: number, h: number) => generateGaussianField(w, h),
  phaseDiagram: generatePhaseDiagram()
};
