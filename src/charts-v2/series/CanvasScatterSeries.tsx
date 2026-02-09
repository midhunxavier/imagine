/**
 * CanvasScatterSeries Component
 * High-performance scatter plot rendering using HTML Canvas inside SVG foreignObject.
 * Best for datasets with >1000 points where SVG DOM becomes heavy.
 */

import React, { useRef, useEffect } from 'react';
import { useChartContext } from '../ChartContext';

export interface CanvasScatterSeriesProps {
  /** Data field for x-axis */
  x?: string;
  
  /** Data field for y-axis */
  y?: string;
  
  /** Point color */
  color?: string;
  
  /** Point radius */
  size?: number;
  
  /** Opacity (0-1) */
  opacity?: number;
  
  /** Data override */
  data?: any[];
}

export function CanvasScatterSeries({
  x: xProp,
  y: yProp,
  color = '#2196F3',
  size = 3,
  opacity = 0.6,
  data: dataProp
}: CanvasScatterSeriesProps) {
  const context = useChartContext();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const data = dataProp || context.data;
  const xField = xProp || context.xField || 'x';
  const yField = yProp || context.yField || 'y';
  const { xScale, yScale, plotWidth, plotHeight } = context;
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !xScale || !yScale || !data || !plotWidth || !plotHeight) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, plotWidth, plotHeight);
    
    // Set styles
    ctx.fillStyle = color;
    ctx.globalAlpha = opacity;
    
    // Draw points
    data.forEach((d: any) => {
      const xVal = d[xField];
      const yVal = d[yField];
      
      if (xVal === undefined || yVal === undefined) return;
      
      const cx = (xScale as any)(xVal);
      const cy = (yScale as any)(yVal);
      
      ctx.beginPath();
      ctx.arc(cx, cy, size, 0, 2 * Math.PI);
      ctx.fill();
    });
    
  }, [data, xScale, yScale, xField, yField, plotWidth, plotHeight, color, size, opacity]);
  
  if (!plotWidth || !plotHeight) return null;
  
  return (
    <foreignObject width={plotWidth} height={plotHeight} style={{ pointerEvents: 'none' }}>
      <canvas
        ref={canvasRef}
        width={plotWidth}
        height={plotHeight}
        style={{ width: '100%', height: '100%' }}
      />
    </foreignObject>
  );
}
