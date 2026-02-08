import { useEffect, useRef } from 'react';
import { loadMathJax, trackMathTask } from './mathjax';

export function MathSvg({
  tex,
  x,
  y,
  scale = 1
}: {
  tex: string;
  x: number;
  y: number;
  scale?: number;
}) {
  const ref = useRef<SVGGElement | null>(null);

  useEffect(() => {
    const run = async () => {
      await loadMathJax();
      if (!ref.current) return;

      const node = await window.MathJax?.tex2svgPromise?.(tex, { display: true });
      if (!node || !ref.current) return;

      const el = (node as any).querySelector?.('svg') ?? node;
      ref.current.replaceChildren(el as any);
      ref.current.setAttribute('data-imagine-math', 'done');
    };

    const p = run();
    trackMathTask(p);
  }, [tex]);

  return <g ref={ref} data-imagine-math="pending" transform={`translate(${x}, ${y}) scale(${scale})`} />;
}
