/**
 * Physics/Mathematics Domain Demo
 * Phase 6 showcase - Vector fields, parametric curves, polar plots
 */
import React from 'react';
import {
  VectorField, ParametricPlot, PolarPlot, ContourPlot, PhaseDiagram,
  samplePhysicsData, lissajous, spiral
} from '../../../src/charts-v2';

// Variant 1: Vector field visualization (cylinder flow)
export const VectorFieldDemo = () => {
  const vectors = samplePhysicsData.cylinderFlow(600, 400);
  
  return (
    <VectorField
      vectors={vectors}
      width={600}
      height={400}
      arrowColor="#4a90e2"
      colorByMagnitude
      title="Fluid Flow Around Cylinder"
    />
  );
};

// Variant 2: Lissajous parametric curve
export const ParametricPlotDemo = () => {
  return (
    <ParametricPlot
      xFunc={(t) => lissajous(t, 1, 1, 2, 3, Math.PI / 2).x}
      yFunc={(t) => lissajous(t, 1, 1, 2, 3, Math.PI / 2).y}
      tRange={[0, 2 * Math.PI]}
      width={500}
      height={400}
      lineColor="#e24a4a"
      lineWidth={2}
      title="Lissajous Curve (2:3)"
      numPoints={1000}
    />
  );
};

// Variant 3: Polar plot (rose curve with 3 petals)
export const PolarPlotDemo = () => {
  const k = 3; // Number of petals
  
  return (
    <PolarPlot
      rFunc={(theta) => Math.cos(k * theta)}
      thetaRange={[0, Math.PI]}
      width={500}
      height={500}
      lineColor="#2ecc71"
      lineWidth={2}
      showGrid
      showRadialLines
      title="Rose Curve (3 petals)"
    />
  );
};

// Variant 4: Contour Plot
export const ContourPlotDemo = () => {
  const field = samplePhysicsData.gaussianField(600, 400);
  
  return (
    <ContourPlot
      data={field}
      width={600}
      height={400}
      title="Scalar Field (Gaussian Peaks)"
      numLevels={12}
      colors={['#f7fbff', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#08519c', '#08306b']}
    />
  );
};

// Variant 5: Phase Diagram
export const PhaseDiagramDemo = () => {
  return (
    <PhaseDiagram
      regions={samplePhysicsData.phaseDiagram}
      width={500}
      height={400}
      title="Water Phase Diagram (Simplified)"
    />
  );
};

// Variant 6: Combined physics dashboard
export const PhysicsDashboard = () => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
      {/* Vector field */}
      <div>
        <h4 style={{ margin: '0 0 10px 0' }}>Fluid Flow Around Cylinder</h4>
        <VectorField
          vectors={samplePhysicsData.cylinderFlow(280, 200)}
          width={280}
          height={200}
          arrowColor="#3498db"
          colorByMagnitude
        />
      </div>
      
      {/* Parametric */}
      <div>
        <h4 style={{ margin: '0 0 10px 0' }}>Lissajous Curve</h4>
        <ParametricPlot
          xFunc={(t) => lissajous(t, 1, 1, 3, 2, 0).x}
          yFunc={(t) => lissajous(t, 1, 1, 3, 2, 0).y}
          tRange={[0, 2 * Math.PI]}
          width={280}
          height={200}
          lineColor="#e74c3c"
          lineWidth={1.5}
          showGrid
        />
      </div>
      
      {/* Contour */}
      <div>
        <h4 style={{ margin: '0 0 10px 0' }}>Field Contours</h4>
        <ContourPlot
          data={samplePhysicsData.gaussianField(280, 200)}
          width={280}
          height={200}
          numLevels={8}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        />
      </div>
      
      {/* Vortex field */}
      <div>
        <h4 style={{ margin: '0 0 10px 0' }}>Vortex Velocity Field</h4>
        <VectorField
          vectors={samplePhysicsData.vortexField(280, 200)}
          width={280}
          height={200}
          arrowColor="#e67e22"
          colorByMagnitude
        />
      </div>
    </div>
  );
};

export default {
  title: 'Physics & Mathematics Domain',
  variants: [
    { name: 'Vector Field - Fluid Flow', component: VectorFieldDemo },
    { name: 'Parametric - Lissajous Curve', component: ParametricPlotDemo },
    { name: 'Polar Plot - Rose Curve', component: PolarPlotDemo },
    { name: 'Contour Plot - Scalar Field', component: ContourPlotDemo },
    { name: 'Phase Diagram - Water', component: PhaseDiagramDemo },
    { name: 'Dashboard - Multiple Views', component: PhysicsDashboard }
  ]
};
