/**
 * useChartExport Hook
 * Provides utilities for client-side export of charts to PNG and SVG
 */

import { useCallback } from 'react';

export interface ChartExportOptions {
  fileName?: string;
  scale?: number; // Scaling factor for high-DPI (default: 2)
  backgroundColor?: string; // Background color (default: white)
}

export function useChartExport() {
  /**
   * Downloads an SVG element as an SVG file
   */
  const downloadSVG = useCallback((svgElement: SVGSVGElement, options: ChartExportOptions = {}) => {
    const { fileName = 'chart.svg' } = options;
    
    // Serialize SVG
    const serializer = new XMLSerializer();
    let source = serializer.serializeToString(svgElement);
    
    // Add XML declaration
    if (!source.match(/^<xml/i)) {
      source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
    }
    
    // Convert to blob and download
    const url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(source);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  /**
   * Downloads an SVG element as a PNG file (rasterized)
   */
  const downloadPNG = useCallback((svgElement: SVGSVGElement, options: ChartExportOptions = {}) => {
    const { 
      fileName = 'chart.png', 
      scale = 2, // Default to 2x (Retina)
      backgroundColor = 'white' 
    } = options;
    
    // Get dimensions
    const width = svgElement.clientWidth || parseInt(svgElement.getAttribute('width') || '0');
    const height = svgElement.clientHeight || parseInt(svgElement.getAttribute('height') || '0');
    
    if (!width || !height) {
      console.error('Cannot determine SVG dimensions');
      return;
    }
    
    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.width = width * scale;
    canvas.height = height * scale;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      console.error('Cannot get canvas context');
      return;
    }
    
    // Fill background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Serialize SVG
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svgElement);
    const svgBlob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    
    // Load image and draw to canvas
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, width * scale, height * scale);
      URL.revokeObjectURL(url);
      
      // Download
      const pngUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = pngUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
    img.src = url;
  }, []);

  return {
    downloadSVG,
    downloadPNG
  };
}
