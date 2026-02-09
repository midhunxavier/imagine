/**
 * ExportControls Component
 * UI component for triggering chart exports
 */

import React from 'react';
import { useChartExport } from '../hooks/useChartExport';

export interface ExportControlsProps {
  /** 
   * Reference to the chart container element (must contain an SVG)
   */
  chartRef: React.RefObject<HTMLDivElement>;
  
  /** Base file name for download */
  fileName?: string;
  
  /** Show PNG button */
  showPng?: boolean;
  
  /** Show SVG button */
  showSvg?: boolean;
  
  /** Style override */
  style?: React.CSSProperties;
}

export function ExportControls({
  chartRef,
  fileName = 'chart',
  showPng = true,
  showSvg = true,
  style
}: ExportControlsProps) {
  const { downloadSVG, downloadPNG } = useChartExport();
  
  const handleDownload = (format: 'png' | 'svg') => {
    if (!chartRef.current) return;
    
    const svgElement = chartRef.current.querySelector('svg');
    if (!svgElement) {
      console.error('No SVG element found in chart container');
      return;
    }
    
    if (format === 'png') {
      downloadPNG(svgElement, { fileName: `${fileName}.png`, scale: 2 });
    } else {
      downloadSVG(svgElement, { fileName: `${fileName}.svg` });
    }
  };
  
  return (
    <div className="export-controls" style={{ display: 'flex', gap: '8px', marginBottom: '10px', ...style }}>
      {showPng && (
        <button
          onClick={() => handleDownload('png')}
          style={{
            padding: '6px 12px',
            fontSize: '12px',
            backgroundColor: '#f0f0f0',
            border: '1px solid #ccc',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Download PNG
        </button>
      )}
      {showSvg && (
        <button
          onClick={() => handleDownload('svg')}
          style={{
            padding: '6px 12px',
            fontSize: '12px',
            backgroundColor: '#f0f0f0',
            border: '1px solid #ccc',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Download SVG
        </button>
      )}
    </div>
  );
}
