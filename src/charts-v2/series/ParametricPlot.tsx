/**
 * ParametricPlot Component - Parametric curve visualization
 */

export interface ParametricPlotProps {
  /** Parametric function x(t) */
  xFunc: (t: number) => number;
  
  /** Parametric function y(t) */
  yFunc: (t: number) => number;
  
  /** Parameter range [tMin, tMax] */
  tRange: [number, number];
  
  /** Width of the plot */
  width?: number;
  
  /** Height of the plot */
  height?: number;
  
  /** Line color */
  lineColor?: string;
  
  /** Line width */
  lineWidth?: number;
  
  /** Show grid */
  showGrid?: boolean;
  
  /** Show axes */
  showAxes?: boolean;
  
  /** Background color */
  backgroundColor?: string;
  
  /** Margin */
  margin?: { top: number; right: number; bottom: number; left: number };
  
  /** Title */
  title?: string;
  
  /** Number of points to sample */
  numPoints?: number;
}

export function ParametricPlot({
  xFunc,
  yFunc,
  tRange,
  width = 500,
  height = 400,
  lineColor = '#2196F3',
  lineWidth = 2,
  showGrid = true,
  showAxes = true,
  backgroundColor = 'white',
  margin = { top: 40, right: 40, bottom: 60, left: 60 },
  title,
  numPoints = 500
}: ParametricPlotProps) {
  // Generate points
  const points: { x: number; y: number; t: number }[] = [];
  const [tMin, tMax] = tRange;
  
  for (let i = 0; i <= numPoints; i++) {
    const t = tMin + (tMax - tMin) * (i / numPoints);
    points.push({ x: xFunc(t), y: yFunc(t), t });
  }
  
  // Find bounds
  const xValues = points.map(p => p.x);
  const yValues = points.map(p => p.y);
  const xMin = Math.min(...xValues);
  const xMax = Math.max(...xValues);
  const yMin = Math.min(...yValues);
  const yMax = Math.max(...yValues);
  
  // Add padding
  const xPadding = (xMax - xMin) * 0.1 || 1;
  const yPadding = (yMax - yMin) * 0.1 || 1;
  const xDomain: [number, number] = [xMin - xPadding, xMax + xPadding];
  const yDomain: [number, number] = [yMin - yPadding, yMax + yPadding];
  
  // Scale functions
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  
  const scaleX = (x: number) => {
    return margin.left + ((x - xDomain[0]) / (xDomain[1] - xDomain[0])) * plotWidth;
  };
  
  const scaleY = (y: number) => {
    return height - margin.bottom - ((y - yDomain[0]) / (yDomain[1] - yDomain[0])) * plotHeight;
  };
  
  // Generate path
  const pathD = points.map((p, i) => {
    const x = scaleX(p.x);
    const y = scaleY(p.y);
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');
  
  return (
    <svg width={width} height={height} style={{ backgroundColor }}>
      {/* Title */}
      {title && (
        <text
          x={width / 2}
          y={25}
          textAnchor="middle"
          fontSize={16}
          fontWeight="bold"
          fill="#333"
        >
          {title}
        </text>
      )}
      
      {/* Grid */}
      {showGrid && (
        <g>
          {/* Vertical grid lines */}
          {Array.from({ length: 6 }, (_, i) => {
            const x = margin.left + (i / 5) * plotWidth;
            return (
              <line
                key={`v-grid-${i}`}
                x1={x}
                y1={margin.top}
                x2={x}
                y2={height - margin.bottom}
                stroke="#e0e0e0"
                strokeWidth={1}
              />
            );
          })}
          
          {/* Horizontal grid lines */}
          {Array.from({ length: 6 }, (_, i) => {
            const y = margin.top + (i / 5) * plotHeight;
            return (
              <line
                key={`h-grid-${i}`}
                x1={margin.left}
                y1={y}
                x2={width - margin.right}
                y2={y}
                stroke="#e0e0e0"
                strokeWidth={1}
              />
            );
          })}
        </g>
      )}
      
      {/* Axes */}
      {showAxes && (
        <g>
          <line
            x1={margin.left}
            y1={height - margin.bottom}
            x2={width - margin.right}
            y2={height - margin.bottom}
            stroke="#333"
            strokeWidth={2}
          />
          <line
            x1={margin.left}
            y1={margin.top}
            x2={margin.left}
            y2={height - margin.bottom}
            stroke="#333"
            strokeWidth={2}
          />
          
          {/* X-axis ticks */}
          {Array.from({ length: 5 }, (_, i) => {
            const x = margin.left + (i / 4) * plotWidth;
            const value = xDomain[0] + (i / 4) * (xDomain[1] - xDomain[0]);
            return (
              <g key={`x-tick-${i}`}>
                <line
                  x1={x}
                  y1={height - margin.bottom}
                  x2={x}
                  y2={height - margin.bottom + 5}
                  stroke="#333"
                  strokeWidth={1}
                />
                <text
                  x={x}
                  y={height - margin.bottom + 20}
                  textAnchor="middle"
                  fontSize={10}
                  fill="#666"
                >
                  {value.toFixed(1)}
                </text>
              </g>
            );
          })}
          
          {/* Y-axis ticks */}
          {Array.from({ length: 5 }, (_, i) => {
            const y = height - margin.bottom - (i / 4) * plotHeight;
            const value = yDomain[0] + (i / 4) * (yDomain[1] - yDomain[0]);
            return (
              <g key={`y-tick-${i}`}>
                <line
                  x1={margin.left - 5}
                  y1={y}
                  x2={margin.left}
                  y2={y}
                  stroke="#333"
                  strokeWidth={1}
                />
                <text
                  x={margin.left - 10}
                  y={y + 4}
                  textAnchor="end"
                  fontSize={10}
                  fill="#666"
                >
                  {value.toFixed(1)}
                </text>
              </g>
            );
          })}
          
          {/* Axis labels */}
          <text
            x={width / 2}
            y={height - 10}
            textAnchor="middle"
            fontSize={12}
            fill="#333"
          >
            x
          </text>
          <text
            x={15}
            y={height / 2}
            textAnchor="middle"
            fontSize={12}
            fill="#333"
            transform={`rotate(-90, 15, ${height / 2})`}
          >
            y
          </text>
        </g>
      )}
      
      {/* Parametric curve */}
      <path
        d={pathD}
        fill="none"
        stroke={lineColor}
        strokeWidth={lineWidth}
      />
    </svg>
  );
}
