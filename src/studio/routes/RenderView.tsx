import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { figures } from '../../figures/manifest';
import type { FigureVariant } from '../../figures/manifest';
import { resolveSize } from '../../framework/sizing';
import { loadFigureComponent } from '../figureLoader';
import { waitForMathTasks } from '../../framework/math/mathjax';

declare global {
  interface Window {
    __IMAGINE_READY__?: boolean;
  }
}

function setPageBackground(bg: 'white' | 'transparent') {
  const val = bg === 'transparent' ? 'transparent' : '#ffffff';
  document.documentElement.style.background = val;
  document.body.style.background = val;
}

async function waitForPendingMathDom(maxMs: number) {
  const start = Date.now();
  while (Date.now() - start < maxMs) {
    const pending = document.querySelector('[data-imagine-math="pending"]');
    if (!pending) return;
    await new Promise((r) => setTimeout(r, 25));
  }
}

export function RenderView() {
  const params = useParams();
  const figureId = params.figureId ?? '';
  const variantId = params.variantId;
  const [FigureComponent, setFigureComponent] = useState<React.ComponentType<any> | null>(null);

  const fig = figures.find((f) => f.id === figureId);
  const variant: FigureVariant | undefined = useMemo(() => {
    if (!fig) return undefined;
    if (variantId) return fig.variants.find((v) => v.id === variantId) ?? fig.variants[0];
    return fig.variants[0];
  }, [fig, variantId]);

  useEffect(() => {
    window.__IMAGINE_READY__ = false;
    if (!fig) return;
    setFigureComponent(null);
    loadFigureComponent(fig.moduleKey).then((Component) => setFigureComponent(() => Component), (err) => {
      // eslint-disable-next-line no-console
      console.error(err);
      setFigureComponent(() => () => null);
    });
  }, [fig?.moduleKey]);

  useEffect(() => {
    if (!fig || !variant || !FigureComponent) return;
    (async () => {
      window.__IMAGINE_READY__ = false;
      document.body.style.margin = '0';
      const bg = (variant?.background ?? 'white') as 'white' | 'transparent';
      setPageBackground(bg);

      await (document as any).fonts?.ready?.catch(() => undefined);

      // Let figure effects run at least once, then wait for math (if any).
      await new Promise((r) => setTimeout(r, 0));
      await Promise.race([waitForMathTasks(), new Promise((r) => setTimeout(r, 30_000))]);
      await waitForPendingMathDom(30_000);

      await new Promise(requestAnimationFrame);
      window.__IMAGINE_READY__ = true;
    })().catch((err) => {
      // eslint-disable-next-line no-console
      console.error(err);
      window.__IMAGINE_READY__ = true;
    });
  }, [fig?.id, variant?.id, variant?.background, FigureComponent]);

  if (!fig || !variant) return null;

  const size = resolveSize(variant.size ?? fig.size);
  const background = variant.background ?? 'white';
  const props = {
    width: size.width,
    height: size.height,
    background,
    ...(variant.props as any)
  };

  return (
    <div id="figure-root" style={{ width: size.width, height: size.height, overflow: 'hidden' }}>
      {FigureComponent ? <FigureComponent {...props} /> : null}
    </div>
  );
}
