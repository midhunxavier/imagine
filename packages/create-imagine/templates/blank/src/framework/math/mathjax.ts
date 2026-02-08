type MathJaxGlobal = {
  startup?: { promise?: Promise<unknown> };
  tex2svgPromise?: (tex: string, options?: unknown) => Promise<unknown>;
};

declare global {
  interface Window {
    MathJax?: MathJaxGlobal;
    __IMAGINE_MATH_PENDING__?: number;
    __IMAGINE_MATH_WAITERS__?: Array<() => void>;
  }
}

let loadPromise: Promise<void> | null = null;

export async function loadMathJax(): Promise<void> {
  if (typeof window === 'undefined') return;
  if (window.MathJax?.tex2svgPromise) return;
  if (loadPromise) return loadPromise;

  loadPromise = new Promise<void>((resolve, reject) => {
    const url = import.meta.env.VITE_MATHJAX_URL ?? 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js';

    window.MathJax = {
      ...window.MathJax,
      svg: { ...(window.MathJax as any)?.svg, fontCache: 'global' }
    } as MathJaxGlobal;

    const script = document.createElement('script');
    script.async = true;
    script.src = url;
    script.addEventListener('load', () => resolve());
    script.addEventListener('error', () => reject(new Error(`Failed to load MathJax from ${url}`)));
    document.head.appendChild(script);
  }).then(async () => {
    await window.MathJax?.startup?.promise?.catch(() => undefined);
  });

  return loadPromise;
}

export function trackMathTask(task: Promise<unknown>): void {
  if (typeof window === 'undefined') return;
  window.__IMAGINE_MATH_PENDING__ = (window.__IMAGINE_MATH_PENDING__ ?? 0) + 1;

  task.finally(() => {
    window.__IMAGINE_MATH_PENDING__ = Math.max(0, (window.__IMAGINE_MATH_PENDING__ ?? 1) - 1);
    if (window.__IMAGINE_MATH_PENDING__ === 0 && window.__IMAGINE_MATH_WAITERS__?.length) {
      const waiters = window.__IMAGINE_MATH_WAITERS__;
      window.__IMAGINE_MATH_WAITERS__ = [];
      waiters.forEach((w) => w());
    }
  });
}

export function waitForMathTasks(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if ((window.__IMAGINE_MATH_PENDING__ ?? 0) === 0) return Promise.resolve();

  return new Promise((resolve) => {
    window.__IMAGINE_MATH_WAITERS__ = window.__IMAGINE_MATH_WAITERS__ ?? [];
    window.__IMAGINE_MATH_WAITERS__.push(resolve);
  });
}
