import type { RefObject } from 'react';
import { useEffect, useRef, useState } from 'react';
import type { EditableBounds, EditableElementInfo } from './EditableContext';
import { useEditableContext } from './EditableContext';

export function normalizeEditableBounds(
  targetRect: Pick<DOMRect, 'left' | 'top' | 'width' | 'height'>,
  rootRect: Pick<DOMRect, 'left' | 'top'>,
  scale: number
): EditableBounds {
  const safeScale = Number.isFinite(scale) && scale > 0 ? scale : 1;
  return {
    left: (targetRect.left - rootRect.left) / safeScale,
    top: (targetRect.top - rootRect.top) / safeScale,
    width: targetRect.width / safeScale,
    height: targetRect.height / safeScale
  };
}

export function textAnchorToTextAlign(anchor: string): 'left' | 'center' | 'right' {
  if (anchor === 'middle') return 'center';
  if (anchor === 'end') return 'right';
  return 'left';
}

type UseEditableElementsOptions = {
  rootRef: RefObject<HTMLElement>;
  enabled: boolean;
  scale: number;
};

export function useEditableElements({ rootRef, enabled, scale }: UseEditableElementsOptions): string[] {
  const { registerElement, unregisterElement, editableElements } = useEditableContext();
  const [orderedKeys, setOrderedKeys] = useState<string[]>([]);
  const editableElementsRef = useRef(editableElements);

  useEffect(() => {
    editableElementsRef.current = editableElements;
  }, [editableElements]);

  useEffect(() => {
    if (!enabled) {
      for (const key of editableElementsRef.current.keys()) unregisterElement(key);
      setOrderedKeys([]);
      return;
    }

    const root = rootRef.current;
    if (!root) return;

    let rafId = 0;

    const recompute = () => {
      const rootRect = root.getBoundingClientRect();
      const nodes = root.querySelectorAll('[data-editable-key]');
      const found = new Set<string>();
      const nextOrdered: string[] = [];

      for (const node of nodes) {
        if (!(node instanceof SVGTextElement)) continue;
        const key = node.getAttribute('data-editable-key')?.trim() ?? '';
        if (!key) continue;

        const bounds = normalizeEditableBounds(node.getBoundingClientRect(), rootRect, scale);
        const style = window.getComputedStyle(node);
        const textAnchor = (node.getAttribute('text-anchor') ?? style.textAnchor ?? 'start').trim() || 'start';

        const info: EditableElementInfo = {
          key,
          bounds,
          fontSize: style.fontSize || '16px',
          fontWeight: style.fontWeight || '400',
          fontFamily: style.fontFamily || 'sans-serif',
          fill: style.fill || style.color || '#111827',
          textAnchor
        };

        registerElement(key, info);
        if (!found.has(key)) nextOrdered.push(key);
        found.add(key);
      }

      for (const key of editableElementsRef.current.keys()) {
        if (!found.has(key)) unregisterElement(key);
      }

      setOrderedKeys(nextOrdered);
    };

    const scheduleRecompute = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        recompute();
      });
    };

    recompute();

    const mutationObserver = new MutationObserver(() => scheduleRecompute());
    mutationObserver.observe(root, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true
    });

    const resizeObserver = new ResizeObserver(() => scheduleRecompute());
    resizeObserver.observe(root);
    window.addEventListener('resize', scheduleRecompute);

    return () => {
      mutationObserver.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener('resize', scheduleRecompute);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [enabled, registerElement, rootRef, scale, unregisterElement]);

  return orderedKeys;
}
