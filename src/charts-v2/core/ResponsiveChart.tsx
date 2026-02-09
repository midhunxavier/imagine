/**
 * ResponsiveChart Component
 * Wraps any chart component and automatically provides width/height based on container size.
 * Uses ResizeObserver to detect container size changes.
 */

import React, { useRef, useState, useEffect, ReactElement } from 'react';

export interface ResponsiveChartProps {
  /** 
   * Child chart component. Must accept width and height props.
   * Can be a function that receives { width, height } and returns ReactElement
   */
  children: ReactElement | ((dims: { width: number; height: number }) => ReactElement);
  
  /** Aspect ratio to maintain (width / height). If provided, height is calculated from width. */
  aspectRatio?: number;
  
  /** Minimum width in pixels */
  minWidth?: number;
  
  /** Minimum height in pixels */
  minHeight?: number;
  
  /** Initial width (before measure) */
  initialWidth?: number;
  
  /** Initial height (before measure) */
  initialHeight?: number;
  
  /** Debounce resize events (ms) */
  debounce?: number;
  
  /** Class name for container */
  className?: string;
  
  /** Style for container */
  style?: React.CSSProperties;
}

export function ResponsiveChart({
  children,
  aspectRatio,
  minWidth = 100,
  minHeight = 100,
  initialWidth = 500,
  initialHeight = 300,
  debounce = 100,
  className,
  style
}: ResponsiveChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: initialWidth, height: initialHeight });
  const [hasMeasured, setHasMeasured] = useState(false);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    let timeoutId: any = null;
    
    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      
      const { width, height } = entry.contentRect;
      
      // Debounce logic
      if (timeoutId) clearTimeout(timeoutId);
      
      timeoutId = setTimeout(() => {
        let newWidth = Math.max(width, minWidth);
        let newHeight = Math.max(height, minHeight);
        
        if (aspectRatio) {
          newHeight = newWidth / aspectRatio;
        }
        
        setDimensions({ width: newWidth, height: newHeight });
        setHasMeasured(true);
      }, debounce);
    });
    
    resizeObserver.observe(containerRef.current);
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      resizeObserver.disconnect();
    };
  }, [aspectRatio, minWidth, minHeight, debounce]);
  
  // Render child with dimensions
  const renderChild = () => {
    if (typeof children === 'function') {
      return children(dimensions);
    }
    
    return React.cloneElement(children as ReactElement, {
      width: dimensions.width,
      height: dimensions.height
    });
  };
  
  return (
    <div 
      ref={containerRef} 
      className={`responsive-chart-container ${className || ''}`}
      style={{ 
        width: '100%', 
        height: aspectRatio ? 'auto' : '100%', 
        minHeight: aspectRatio ? undefined : minHeight,
        ...style 
      }}
    >
      {hasMeasured && renderChild()}
    </div>
  );
}
