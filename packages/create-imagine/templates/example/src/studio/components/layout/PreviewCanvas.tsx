import type { ReactNode, RefObject } from 'react';
import { cn } from '../ui';

type PreviewSize = {
  width: number;
  height: number;
};

type PreviewCanvasProps = {
  surfaceRef: RefObject<HTMLDivElement>;
  figureRootRef: RefObject<HTMLDivElement>;
  scale: number;
  checker: boolean;
  size: PreviewSize;
  figureNode: ReactNode;
  overlayNode?: ReactNode;
};

export function PreviewCanvas({ surfaceRef, figureRootRef, scale, checker, size, figureNode, overlayNode }: PreviewCanvasProps) {
  const backgroundStyle = checker
    ? undefined
    : {
        backgroundImage: 'radial-gradient(rgba(148, 163, 184, 0.28) 0.9px, transparent 0.9px)',
        backgroundSize: '14px 14px'
      };

  return (
    <div
      className={cn('flex-1 min-w-0 overflow-auto p-4', checker ? 'studio-checkerboard bg-studio-bg' : 'bg-studio-bg')}
      style={backgroundStyle}
      ref={surfaceRef}
    >
      <div className="origin-top-left inline-block" style={{ transform: `scale(${scale})` }}>
        <div className="relative" style={{ width: size.width, height: size.height }}>
          <div id="figure-root" ref={figureRootRef} className="h-full w-full overflow-hidden bg-white shadow-figure">
            {figureNode}
          </div>
          {overlayNode}
        </div>
      </div>
    </div>
  );
}
