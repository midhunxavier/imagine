import { Link } from 'react-router-dom';
import { Button, ButtonLink, Input, Select, Switch, ThemeToggle } from '../ui';

export type HeaderVariant = {
  id: string;
  title?: string;
};

type HeaderProps = {
  projectId: string;
  figureId: string;
  figureTitle: string;
  sizeLabel: string;
  variants: HeaderVariant[];
  activeVariantId: string;
  onVariantChange: (variantId: string) => void;
  zoomValue: number;
  onZoomInput: (value: number) => void;
  onFit: () => void;
  onZoom100: () => void;
  onZoom200: () => void;
  checker: boolean;
  onCheckerChange: (checked: boolean) => void;
  isEditMode: boolean;
  onEditModeChange: (checked: boolean) => void;
  renderRouteTo: string;
  controlsCollapsed?: boolean;
  onToggleControlsCollapse?: () => void;
};

export function Header({
  projectId,
  figureId,
  figureTitle,
  sizeLabel,
  variants,
  activeVariantId,
  onVariantChange,
  zoomValue,
  onZoomInput,
  onFit,
  onZoom100,
  onZoom200,
  checker,
  onCheckerChange,
  isEditMode,
  onEditModeChange,
  renderRouteTo,
  controlsCollapsed = false,
  onToggleControlsCollapse
}: HeaderProps) {
  return (
    <header className="h-16 border-b border-studio-border bg-white/80 px-4 backdrop-blur dark:bg-gray-900/80 dark:border-gray-700">
      <div className="flex h-full items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs text-studio-subtle">
            <Link
              className="font-medium text-studio-blue underline underline-offset-4 hover:opacity-90"
              to={`/project/${encodeURIComponent(projectId)}`}
            >
              {projectId}
            </Link>
            <span>•</span>
            <span className="font-mono">{figureId}</span>
          </div>
          <div className="mt-0.5 truncate text-sm font-extrabold">{figureTitle}</div>
          <div className="text-xs text-studio-subtle">{sizeLabel}</div>
        </div>

        <div className="min-w-[200px]">
          <Select
            label="Variant"
            className="min-w-[170px]"
            value={activeVariantId}
            onChange={(event) => onVariantChange(event.target.value)}
            options={variants.map((variant) => ({
              value: variant.id,
              label: variant.title ? `${variant.title} (${variant.id})` : variant.id
            }))}
          />
        </div>

        <div className="flex flex-wrap items-end gap-2.5">
          <div className="inline-flex gap-2">
            <Button size="sm" onClick={onFit}>
              Fit
            </Button>
            <Button size="sm" onClick={onZoom100}>
              100%
            </Button>
            <Button size="sm" onClick={onZoom200}>
              200%
            </Button>
          </div>

          <Input
            containerClassName="min-w-[110px]"
            label="Zoom"
            type="number"
            min={5}
            max={800}
            step={5}
            value={zoomValue}
            onChange={(event) => onZoomInput(Number(event.target.value))}
          />

          <Switch checked={checker} onCheckedChange={onCheckerChange} label="Checkerboard" />
          <Switch checked={isEditMode} onCheckedChange={onEditModeChange} label="Edit Text" />

          {onToggleControlsCollapse ? (
            <Button size="sm" variant="secondary" onClick={onToggleControlsCollapse}>
              {controlsCollapsed ? 'Show Controls' : 'Hide Controls'}
            </Button>
          ) : null}

          <ButtonLink to={renderRouteTo} target="_blank">
            Render route
          </ButtonLink>

          <ThemeToggle size="sm" />
        </div>
      </div>
    </header>
  );
}
