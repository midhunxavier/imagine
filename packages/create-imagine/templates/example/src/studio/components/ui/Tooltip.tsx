import type { ReactElement, ReactNode } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from './cn';

export type TooltipProps = {
  content: ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  children: ReactElement;
};

type Coords = { top: number; left: number };

function placementClasses(placement: NonNullable<TooltipProps['placement']>) {
  if (placement === 'bottom') return '-translate-x-1/2';
  if (placement === 'left') return '-translate-x-full -translate-y-1/2';
  if (placement === 'right') return '-translate-y-1/2';
  return '-translate-x-1/2 -translate-y-full';
}

function getCoords(rect: DOMRect, placement: NonNullable<TooltipProps['placement']>, offset: number): Coords {
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  if (placement === 'bottom') return { left: cx, top: rect.bottom + offset };
  if (placement === 'left') return { left: rect.left - offset, top: cy };
  if (placement === 'right') return { left: rect.right + offset, top: cy };
  return { left: cx, top: rect.top - offset };
}

export function Tooltip({ content, placement = 'top', children }: TooltipProps) {
  const triggerRef = useRef<HTMLSpanElement | null>(null);
  const hideTimer = useRef<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState<Coords>({ top: 0, left: 0 });

  const show = () => {
    if (hideTimer.current) {
      window.clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
    setMounted(true);
    requestAnimationFrame(() => setVisible(true));
  };

  const hide = () => {
    setVisible(false);
    hideTimer.current = window.setTimeout(() => setMounted(false), 80);
  };

  const updatePosition = () => {
    const el = triggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setCoords(getCoords(rect, placement, 8));
  };

  useEffect(() => {
    if (!mounted) return;
    updatePosition();
  }, [mounted, placement, content]);

  useEffect(() => {
    if (!mounted) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') hide();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    const onChange = () => updatePosition();
    window.addEventListener('resize', onChange);
    window.addEventListener('scroll', onChange, true);
    return () => {
      window.removeEventListener('resize', onChange);
      window.removeEventListener('scroll', onChange, true);
    };
  }, [mounted]);

  useEffect(() => {
    return () => {
      if (hideTimer.current) window.clearTimeout(hideTimer.current);
    };
  }, []);

  const portalNode = useMemo(() => (typeof document !== 'undefined' ? document.body : null), []);

  return (
    <>
      <span ref={triggerRef} className="inline-flex" onMouseEnter={show} onMouseLeave={hide} onFocus={show} onBlur={hide}>
        {children}
      </span>
      {mounted && portalNode
        ? createPortal(
            <div
              role="tooltip"
              className={cn(
                'pointer-events-none fixed z-50 max-w-[240px] rounded-control bg-gray-900 px-2.5 py-2 text-xs text-white shadow-lg transition-opacity duration-80',
                placementClasses(placement),
                visible ? 'opacity-100' : 'opacity-0'
              )}
              style={{ top: coords.top, left: coords.left }}
            >
              {content}
            </div>,
            portalNode
          )
        : null}
    </>
  );
}
