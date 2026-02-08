import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { PropsFileV1 } from '../core/manifest';
import { emptyPropsFile, fetchPropsFile, savePropsFile } from './propsApi';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype;
}

export function useProjectProps(projectId: string) {
  const [file, setFile] = useState<PropsFileV1>(() => emptyPropsFile());
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
        setFile(f);
        setReadOnly(false);
      },
      (err) => {
        setFile(emptyPropsFile());
        setReadOnly(true);
        setLoadError(String(err?.message ?? err));
      }
    );

    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
      saveTimer.current = null;
    };
  }, [projectId]);

  const queueSave = useCallback(
    (next: PropsFileV1) => {
      if (readOnly) return;
      if (saveTimer.current) window.clearTimeout(saveTimer.current);

      setSaveStatus('saving');
      setSaveError(null);
      saveTimer.current = window.setTimeout(() => {
        saveTimer.current = null;
        const toSave = next;
        savePropsFile(projectId, toSave).then(
          () => setSaveStatus('saved'),
          (err) => {
            setSaveStatus('error');
            setSaveError(String(err?.message ?? err));
          }
        );
      }, 350);
    },
    [projectId, readOnly]
  );

  const setVariantOverride = useCallback(
    (figureId: string, variantId: string, key: string, value: unknown) => {
      setFile((prev) => {
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
    [queueSave]
  );

  const resetVariantOverrides = useCallback(
    (figureId: string, variantId: string) => {
      setFile((prev) => {
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
    [queueSave]
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
      getVariantOverrides
    }),
    [file, getVariantOverrides, loadError, readOnly, resetVariantOverrides, saveError, saveStatus, setVariantOverride]
  );

  return value;
}
