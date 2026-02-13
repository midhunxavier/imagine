import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { PropsFileV1 } from '../core/manifest';
import { emptyPropsFile, fetchPropsFile, savePropsFile } from './propsApi';
import { useHistory } from './hooks/useHistory';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype;
}

export function useProjectProps(projectId: string) {
  const { state: file, set: setFile, setDebounced, undo, redo, canUndo, canRedo, reset } = useHistory<PropsFileV1>(emptyPropsFile());
  const [readOnly, setReadOnly] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [saveError, setSaveError] = useState<string | null>(null);
  const saveTimer = useRef<number | null>(null);
  const latestFile = useRef<PropsFileV1>(file);
  latestFile.current = file;

  useEffect(() => {
    if (!projectId) return;
    setLoadError(null);
    setSaveStatus('idle');
    setSaveError(null);
    setReadOnly(false);

    fetchPropsFile(projectId).then(
      (f) => {
        reset(f);
        setReadOnly(false);
      },
      (err) => {
        reset(emptyPropsFile());
        setReadOnly(true);
        setLoadError(String(err?.message ?? err));
      }
    );

    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
      saveTimer.current = null;
    };
  }, [projectId, reset]);

  const forceSave = useCallback(
    async (next: PropsFileV1) => {
      if (readOnly) return;
      if (saveTimer.current) {
        window.clearTimeout(saveTimer.current);
        saveTimer.current = null;
      }

      setSaveStatus('saving');
      setSaveError(null);

      try {
        await savePropsFile(projectId, next);
        setSaveStatus('saved');
      } catch (err) {
        setSaveStatus('error');
        setSaveError(String((err as Error)?.message ?? err));
      }
    },
    [projectId, readOnly]
  );

  const queueSave = useCallback(
    (next: PropsFileV1) => {
      if (readOnly) return;
      if (saveTimer.current) window.clearTimeout(saveTimer.current);

      setSaveStatus('saving');
      setSaveError(null);
      saveTimer.current = window.setTimeout(() => {
        saveTimer.current = null;
        forceSave(next);
      }, 350);
    },
    [readOnly, forceSave]
  );

  const setVariantOverride = useCallback(
    (figureId: string, variantId: string, key: string, value: unknown) => {
      setDebounced((prev: PropsFileV1) => {
        const overrides = { ...prev.overrides };
        const fig = { ...(overrides[figureId] ?? {}) };
        const variant = { ...(fig[variantId] ?? {}) };

        if (value === undefined) delete variant[key];
        else variant[key] = value;
        fig[variantId] = variant;
        overrides[figureId] = fig;

        const next = { version: 1 as const, overrides };
        queueSave(next);
        return next;
      });
    },
    [setDebounced, queueSave]
  );

  const resetVariantOverrides = useCallback(
    (figureId: string, variantId: string) => {
      setDebounced((prev: PropsFileV1) => {
        const overrides = { ...prev.overrides };
        const fig = { ...(overrides[figureId] ?? {}) };
        delete fig[variantId];

        if (!Object.keys(fig).length) delete overrides[figureId];
        else overrides[figureId] = fig;

        const next = { version: 1 as const, overrides };
        queueSave(next);
        return next;
      });
    },
    [setDebounced, queueSave]
  );

  const getVariantOverrides = useCallback(
    (figureId: string, variantId: string): Record<string, unknown> => {
      const v = file.overrides[figureId]?.[variantId];
      return isPlainObject(v) ? v : {};
    },
    [file.overrides]
  );

  const value = useMemo(
    () => ({
      file,
      readOnly,
      loadError,
      saveStatus,
      saveError,
      setVariantOverride,
      resetVariantOverrides,
      getVariantOverrides,
      undo,
      redo,
      canUndo,
      canRedo,
      forceSave
    }),
    [file, getVariantOverrides, loadError, readOnly, resetVariantOverrides, saveError, saveStatus, setVariantOverride, undo, redo, canUndo, canRedo, forceSave]
  );

  return value;
}
