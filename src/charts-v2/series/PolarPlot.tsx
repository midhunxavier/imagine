/**
 * PolarPlot Component - Polar coordinate visualization
 */

export interface PolarPlotProps {
  /** Polar function r(theta) */
  rFunc: (theta: number) => number;
  
  /** Angular range [thetaMin, thetaMax] in radians */
  thetaRange?: [number, number];
  
  /** Width of the plot */
  width?: number;
  
  /** Height of the plot */
  height?: number;
  
  /** Line color */
  lineColor?: string;
  
  /** Line width */
  lineWidth?: number;
  
  /** Show concentric circles (grid) */
  showGrid?: boolean;
  
  /** Show radial lines */
  showRadialLines?: boolean;
  
  /** Show radial axis labels */
  showRadialLabels?: boolean;
  
  /** Background color */
  backgroundColor?: string;
  
  /** Title */
  title?: string;
  
  /** Number of points to sample */
  numPoints?: number;
}

export function PolarPlot({
  rFunc,
  thetaRange = [0, 2 * Math.PI],
  width = 500,
  height = 500,
  lineColor = '#2196F3',
  lineWidth = 2,
  showGrid = true,
  showRadialLines = true,
  showRadialLabels = true,
  backgroundColor = 'white',
  title,
  numPoints = 360
}: PolarPlotProps) {
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2 - 60;
  
  // Generate points
  const points: { x: number; y: number; r: number; theta: number }[] = [];
  const [thetaMin, thetaMax] = thetaRange;
  
  for (let i = 0; i <= numPoints; i++) {
    const theta = thetaMin + (thetaMax - thetaMin) * (i / numPoints);
    const r = rFunc(theta);
    const x = centerX + r * radius * Math.cos(theta);
    const y = centerY - r * radius * Math.sin(theta);
    points.push({ x, y, r, theta });
  }
  
  // Generate path
  const pathD = points.map((p, i) => {
    return `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`;
  }).join(' ');
  
  // Find max r for grid scaling
  const maxR = Math.max(...points.map(p => p.r));
  
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
      
      {/* Concentric circles (grid) */}
      {showGrid && (
        <g>
          {[0.25, 0.5, 0.75, 1].map((t, i) => {
            const r = t * radius;
            return (
              <circle
                key={`grid-${i}`}
                cx={centerX}
                cy={centerY}
                r={r}
                fill="none"
                stroke="#e0e0e0"
                strokeWidth={1}
                strokeDasharray="4,4"
              />
            );
          })}
        </g>
      )}
      
      {/* Radial lines */}
      {showRadialLines && (
        <g>
          {Array.from({ length: 12 }, (_, i) => {
            const theta = (i * 2 * Math.PI) / 12;
            const x = centerX + radius * Math.cos(theta);
            const y = centerY - radius * Math.sin(theta);
            return (
              <line
                key={`radial-${i}`}
                x1={centerX}
                y1={centerY}
                x2={x}
                y2={y}
                stroke="#e0e0e0"
                strokeWidth={1}
              />
            );
          })}
        </g>
      )}
      
      {/* Radial labels */}
      {showRadialLabels && (
        <g>
          {[0.25, 0.5, 0.75, 1].map((t, i) => {
            const r = t * radius;
            const value = (t * maxR).toFixed(1);
            return (
              <text
                key={`label-${i}`}
                x={centerX + r + 5}
                y={centerY + 4}
                fontSize={10}
                fill="#666"
              >
                {value}
              </text>
            );
          })}
        </g>
      )}
      
      {/* Polar curve */}
      <path
        d={pathD}
        fill="none"
        stroke={lineColor}
        strokeWidth={lineWidth}
      />
      
      {/* Axes */}
      <line
        x1={centerX - radius}
        y1={centerY}
        x2={centerX + radius}
        y2={centerY}
        stroke="#333"
        strokeWidth={1}
      />
      <line
        x1={centerX}
        y1={centerY - radius}
        x2={centerX}
        y2={centerY + radius}
        stroke="#333"
        strokeWidth={1}
      />
    </svg>
  );
}
