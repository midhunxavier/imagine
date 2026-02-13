import { useMemo, useState } from 'react';
import type { FigureControl } from '../../../core/manifest';
import { ControlsRenderer } from '../controls';
import { Button } from '../ui';
import { groupControls } from './layoutUtils';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

type ControlsPanelProps = {
  controls: FigureControl[];
  effectiveVariantProps: Record<string, unknown>;
  variantOverrides: Record<string, unknown>;
  onControlChange: (key: string, value: unknown) => void;
  onReset: () => void;
  onCopyJson: () => void;
  saveStatus: SaveStatus;
  saveError: string | null;
  readOnly: boolean;
  loadError: string | null;
  collapsed: boolean;
  onToggleCollapsed: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
};

export function ControlsPanel({
  controls,
  effectiveVariantProps,
  variantOverrides,
  onControlChange,
  onReset,
  onCopyJson,
  saveStatus,
  saveError,
  readOnly,
  loadError,
  collapsed,
  onToggleCollapsed,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false
}: ControlsPanelProps) {
  const [showJson, setShowJson] = useState(false);
  const groups = useMemo(() => groupControls(controls), [controls]);

  if (collapsed) {
    return (
      <aside className="flex w-[52px] shrink-0 items-start justify-center border-l border-studio-border bg-white p-2 dark:bg-gray-900 dark:border-gray-700" aria-label="Controls">
        <Button size="sm" variant="ghost" onClick={onToggleCollapsed} title="Expand controls">
          »
        </Button>
      </aside>
    );
  }

  return (
    <aside className="w-[360px] shrink-0 overflow-auto border-l border-studio-border bg-white p-4 dark:bg-gray-900 dark:border-gray-700" aria-label="Controls">
      <div className="mb-2 flex items-center justify-between gap-2.5">
        <div className="font-extrabold">Controls</div>
        <div className="inline-flex gap-1.5">
          <Button
            size="sm"
            variant="ghost"
            onClick={onUndo}
            disabled={!canUndo || readOnly}
            title="Undo (Ctrl/Cmd+Z)"
          >
            ↩
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={onRedo}
            disabled={!canRedo || readOnly}
            title="Redo (Ctrl/Cmd+Shift+Z)"
          >
            ↪
          </Button>
          <Button size="sm" variant="ghost" onClick={onToggleCollapsed} title="Collapse controls">
            «
          </Button>
          <Button size="sm" variant={showJson ? 'secondary' : 'ghost'} onClick={() => setShowJson((current) => !current)}>
            JSON
          </Button>
          <Button size="sm" onClick={onReset} title="Clear saved overrides for this variant">
            Reset
          </Button>
          <Button size="sm" onClick={onCopyJson} title="Copy overrides JSON">
            Copy
          </Button>
        </div>
      </div>

      <div className="mb-3 text-xs text-studio-subtle">
        {readOnly ? (
          <span title={loadError ?? undefined}>Saving disabled</span>
        ) : saveStatus === 'saving' ? (
          <span>Saving…</span>
        ) : saveStatus === 'saved' ? (
          <span className="font-semibold text-emerald-700">Saved</span>
        ) : saveStatus === 'error' ? (
          <span className="font-semibold text-studio-red">Save failed</span>
        ) : (
          <span>Edits auto-save</span>
        )}
        {saveError ? <div className="mt-2 font-mono text-xs text-studio-red">{saveError}</div> : null}
      </div>

      {showJson ? (
        <pre className="mb-3 overflow-auto rounded-control border border-studio-border bg-studio-panel p-2.5 text-[11px] text-studio-subtle">
          {JSON.stringify(variantOverrides, null, 2)}
        </pre>
      ) : null}

      {groups.length ? (
        <div className="space-y-4">
          {groups.map((group) => (
            <section key={group.title}>
              <div className="mb-1.5 px-1 text-[11px] font-bold uppercase tracking-wider text-gray-500">{group.title}</div>
              <div className="flex flex-col gap-2.5">
                {group.items.map((control, index) => {
                  const key = control.key;
                  const currentValue = effectiveVariantProps[key];
                  return (
                    <ControlsRenderer
                      key={`${group.title}:${key}:${index}`}
                      control={control}
                      value={currentValue}
                      onChange={(value) => onControlChange(key, value)}
                    />
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="py-3 text-sm text-studio-subtle">No editable props found.</div>
      )}
    </aside>
  );
}
