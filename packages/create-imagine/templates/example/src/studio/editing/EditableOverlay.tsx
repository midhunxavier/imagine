import type { RefObject } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '../components/ui';
import { focusRing } from '../components/ui/styles';
import { useEditableContext } from './EditableContext';
import { textAnchorToTextAlign, useEditableElements } from './useEditableElements';

export type EditableOverlayProps = {
  rootRef: RefObject<HTMLElement>;
  scale: number;
  textControlMetaByKey: Record<string, { multiline?: boolean }>;
};

export function EditableOverlay({ rootRef, scale, textControlMetaByKey }: EditableOverlayProps) {
  const { isEditMode, activeKey, setActiveKey, getValue, setValue, editableElements } = useEditableContext();
  const orderedKeys = useEditableElements({ rootRef, enabled: isEditMode, scale });
  const [draft, setDraft] = useState('');
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const skipBlurCommitRef = useRef(false);
  const editorRef = useRef<HTMLElement | null>(null);

  const activeInfo = activeKey ? editableElements.get(activeKey) ?? null : null;
  const activeMultiline = activeKey ? Boolean(textControlMetaByKey[activeKey]?.multiline) : false;

  const sortedElements = useMemo(() => {
    return Array.from(editableElements.values()).sort((a, b) => {
      if (a.bounds.top === b.bounds.top) return a.bounds.left - b.bounds.left;
      return a.bounds.top - b.bounds.top;
    });
  }, [editableElements]);

  useEffect(() => {
    if (!isEditMode) {
      setActiveKey(null);
      setHoveredKey(null);
      setDraft('');
      return;
    }

    if (!activeKey) {
      setDraft('');
      return;
    }

    setDraft(getValue(activeKey));
    window.requestAnimationFrame(() => {
      if (!(editorRef.current instanceof HTMLInputElement || editorRef.current instanceof HTMLTextAreaElement)) return;
      editorRef.current.focus();
      editorRef.current.select();
    });
  }, [activeKey, getValue, isEditMode, setActiveKey]);

  function commitActive(nextValue: string) {
    if (!activeKey) return;
    setValue(activeKey, nextValue);
  }

  function openEditor(nextKey: string) {
    if (!isEditMode) return;
    if (activeKey && activeKey !== nextKey) {
      commitActive(draft);
    }
    setActiveKey(nextKey);
  }

  function closeActiveEditor(cancel: boolean) {
    if (!activeKey) return;
    if (!cancel) commitActive(draft);
    setActiveKey(null);
  }

  function cycleEditor(forward: boolean) {
    if (!activeKey || !orderedKeys.length) {
      setActiveKey(null);
      return;
    }
    const currentIndex = orderedKeys.indexOf(activeKey);
    if (currentIndex < 0) {
      setActiveKey(orderedKeys[0] ?? null);
      return;
    }
    const offset = forward ? 1 : -1;
    const nextIndex = (currentIndex + offset + orderedKeys.length) % orderedKeys.length;
    const nextKey = orderedKeys[nextIndex];
    if (!nextKey) {
      setActiveKey(null);
      return;
    }
    setActiveKey(nextKey);
  }

  if (!isEditMode) {
    return <div className="pointer-events-none absolute inset-0 z-30" aria-hidden />;
  }

  return (
    <div className="absolute inset-0 z-30">
      {sortedElements.map((element) => {
        const isActive = element.key === activeKey;
        if (isActive) return null;
        const width = Math.max(12, element.bounds.width);
        const height = Math.max(14, element.bounds.height);
        return (
          <button
            key={element.key}
            type="button"
            className={cn(
              'absolute cursor-text rounded-[6px] border border-dashed border-studio-blue/50 bg-studio-blue/10 transition-opacity duration-80',
              hoveredKey === element.key ? 'opacity-100' : 'opacity-70 hover:opacity-100',
              focusRing
            )}
            style={{
              left: element.bounds.left,
              top: element.bounds.top,
              width,
              height
            }}
            aria-label={`Edit ${element.key}`}
            title={element.key}
            onMouseDown={(event) => event.preventDefault()}
            onMouseEnter={() => setHoveredKey(element.key)}
            onMouseLeave={() => setHoveredKey((current) => (current === element.key ? null : current))}
            onClick={() => openEditor(element.key)}
          />
        );
      })}

      {activeInfo ? (
        activeMultiline ? (
          <textarea
            ref={(node) => {
              editorRef.current = node;
            }}
            className={cn(
              'absolute resize-none rounded-[6px] border border-studio-blue bg-white px-1.5 py-1 shadow-cardHover outline-none',
              focusRing
            )}
            style={{
              left: activeInfo.bounds.left,
              top: activeInfo.bounds.top,
              width: Math.max(28, activeInfo.bounds.width),
              minHeight: Math.max(24, activeInfo.bounds.height),
              color: activeInfo.fill,
              fontFamily: activeInfo.fontFamily,
              fontSize: activeInfo.fontSize,
              fontWeight: activeInfo.fontWeight,
              textAlign: textAnchorToTextAlign(activeInfo.textAnchor),
              lineHeight: '1.2'
            }}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onBlur={() => {
              if (skipBlurCommitRef.current) {
                skipBlurCommitRef.current = false;
                return;
              }
              closeActiveEditor(false);
            }}
            onInput={(event) => {
              const el = event.currentTarget;
              el.style.height = 'auto';
              el.style.height = `${Math.max(activeInfo.bounds.height, el.scrollHeight)}px`;
            }}
            onKeyDown={(event) => {
              if (event.key === 'Escape') {
                event.preventDefault();
                skipBlurCommitRef.current = true;
                closeActiveEditor(true);
                editorRef.current?.blur();
                return;
              }
              if (event.key === 'Tab') {
                event.preventDefault();
                skipBlurCommitRef.current = true;
                commitActive(draft);
                cycleEditor(!event.shiftKey);
                return;
              }
              if (event.key === 'Enter') {
                event.preventDefault();
                skipBlurCommitRef.current = true;
                closeActiveEditor(false);
                editorRef.current?.blur();
              }
            }}
          />
        ) : (
          <input
            ref={(node) => {
              editorRef.current = node;
            }}
            className={cn(
              'absolute rounded-[6px] border border-studio-blue bg-white px-1.5 py-0.5 shadow-cardHover outline-none',
              focusRing
            )}
            style={{
              left: activeInfo.bounds.left,
              top: activeInfo.bounds.top,
              width: Math.max(28, activeInfo.bounds.width),
              minHeight: Math.max(24, activeInfo.bounds.height),
              color: activeInfo.fill,
              fontFamily: activeInfo.fontFamily,
              fontSize: activeInfo.fontSize,
              fontWeight: activeInfo.fontWeight,
              textAlign: textAnchorToTextAlign(activeInfo.textAnchor),
              lineHeight: '1.2'
            }}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onBlur={() => {
              if (skipBlurCommitRef.current) {
                skipBlurCommitRef.current = false;
                return;
              }
              closeActiveEditor(false);
            }}
            onKeyDown={(event) => {
              if (event.key === 'Escape') {
                event.preventDefault();
                skipBlurCommitRef.current = true;
                closeActiveEditor(true);
                editorRef.current?.blur();
                return;
              }
              if (event.key === 'Tab') {
                event.preventDefault();
                skipBlurCommitRef.current = true;
                commitActive(draft);
                cycleEditor(!event.shiftKey);
                return;
              }
              if (event.key === 'Enter') {
                event.preventDefault();
                skipBlurCommitRef.current = true;
                closeActiveEditor(false);
                editorRef.current?.blur();
              }
            }}
          />
        )
      ) : null}
    </div>
  );
}
