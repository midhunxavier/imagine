/**
 * Legend Component - Automatic legend for multi-series charts
 */

import { useChartContext } from '../ChartContext';

export interface LegendProps {
  // Position
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'right' | 'left';
  
  // Styling
  orientation?: 'horizontal' | 'vertical';
  itemSpacing?: number; // Spacing between legend items
  symbolSize?: number; // Size of legend symbols (line/marker)
  symbolSpacing?: number; // Space between symbol and label
  fontSize?: number;
  
  // Layout
  offsetX?: number;
  offsetY?: number;
  padding?: number;
  background?: boolean; // Show background box
  backgroundOpacity?: number;
  
  // Filter
  filter?: string[]; // Only show specific series labels
}

export function Legend({
  position = 'top-right',
  orientation,
  itemSpacing = 16,
  symbolSize = 20,
  symbolSpacing = 8,
  fontSize,
  offsetX = 0,
  offsetY = 0,
  padding = 12,
  background = true,
  backgroundOpacity = 0.9,
  filter
}: LegendProps) {
  const ctx = useChartContext();
  
  // Filter series if specified
  let displaySeries = ctx.series.filter(s => s.visible !== false);
  if (filter && filter.length > 0) {
    displaySeries = displaySeries.filter(s => filter.includes(s.label));
  }
  
  if (displaySeries.length === 0) return null;

  const theme = ctx.theme;
  const textSize = fontSize || theme.typography.sizes.label;
  
  // Auto-detect orientation based on position
  const autoOrientation = 
    position === 'right' || position === 'left' ? 'vertical' : 'horizontal';
  const actualOrientation = orientation || autoOrientation;
  
  // Calculate legend dimensions
  const maxLabelWidth = 100; // Approximate max label width
  const itemWidth = symbolSize + symbolSpacing + maxLabelWidth;
  const itemHeight = Math.max(symbolSize, textSize + 4);
  
  let legendWidth: number;
  let legendHeight: number;
  
  if (actualOrientation === 'horizontal') {
    legendWidth = displaySeries.length * (itemWidth + itemSpacing) - itemSpacing + padding * 2;
    legendHeight = itemHeight + padding * 2;
  } else {
    legendWidth = itemWidth + padding * 2;
    legendHeight = displaySeries.length * (itemHeight + itemSpacing) - itemSpacing + padding * 2;
  }
  
  // Calculate position
  let x = 0;
  let y = 0;
  
  switch (position) {
    case 'top-right':
      x = ctx.plotWidth - legendWidth + offsetX;
      y = offsetY;
      break;
    case 'top-left':
      x = offsetX;
      y = offsetY;
      break;
    case 'bottom-right':
      x = ctx.plotWidth - legendWidth + offsetX;
      y = ctx.plotHeight - legendHeight + offsetY;
      break;
    case 'bottom-left':
      x = offsetX;
      y = ctx.plotHeight - legendHeight + offsetY;
      break;
    case 'right':
      x = ctx.plotWidth + 20 + offsetX;
      y = (ctx.plotHeight - legendHeight) / 2 + offsetY;
      break;
    case 'left':
      x = -legendWidth - 20 + offsetX;
      y = (ctx.plotHeight - legendHeight) / 2 + offsetY;
      break;
  }
  
  return (
    <g className="legend" transform={`translate(${x}, ${y})`}>
      {/* Background */}
      {background && (
        <rect
          x={0}
          y={0}
          width={legendWidth}
          height={legendHeight}
          fill={theme.colors.background}
          stroke={theme.colors.muted}
          strokeWidth={1}
          opacity={backgroundOpacity}
          rx={4}
        />
      )}
      
      {/* Legend items */}
      {displaySeries.map((series, idx) => {
        const itemX = actualOrientation === 'horizontal'
          ? padding + idx * (itemWidth + itemSpacing)
          : padding;
        const itemY = actualOrientation === 'horizontal'
          ? padding
          : padding + idx * (itemHeight + itemSpacing);
        
        return (
          <g key={series.id} className="legend-item" transform={`translate(${itemX}, ${itemY})`}>
            {/* Symbol */}
            {renderSymbol(series, symbolSize, theme.colors.foreground)}
            
            {/* Label */}
            <text
              x={symbolSize + symbolSpacing}
              y={symbolSize / 2}
              fontSize={textSize}
              fill={theme.colors.foreground}
              dominantBaseline="middle"
              fontFamily={theme.typography.fontFamily}
            >
              {series.label}
            </text>
          </g>
        );
      })}
    </g>
  );
}

function renderSymbol(series: any, size: number, defaultStroke: string) {
  const { shape = 'line', color } = series;
  const cy = size / 2;
  
  switch (shape) {
    case 'line':
      return (
        <line
          x1={0}
          y1={cy}
          x2={size}
          y2={cy}
          stroke={color}
          strokeWidth={2}
        />
      );
    
    case 'scatter':
      return (
        <circle
          cx={size / 2}
          cy={cy}
          r={size / 4}
          fill={color}
          stroke={defaultStroke}
          strokeWidth={1}
        />
      );
    
    case 'bar':
      return (
        <rect
          x={size / 4}
          y={size / 4}
          width={size / 2}
          height={size / 2}
          fill={color}
          stroke={defaultStroke}
          strokeWidth={1}
        />
      );
    
    case 'area':
      return (
        <>
          <rect
            x={0}
            y={size / 4}
            width={size}
            height={size / 2}
            fill={color}
            opacity={0.5}
          />
          <line
            x1={0}
            y1={cy}
            x2={size}
            y2={cy}
            stroke={color}
            strokeWidth={2}
          />
        </>
      );
    
    default:
      return (
        <line
          x1={0}
          y1={cy}
          x2={size}
          y2={cy}
          stroke={color}
          strokeWidth={2}
        />
      );
  }
}
