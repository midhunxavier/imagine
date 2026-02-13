import { hexToRgb, rgbToHex } from '../../utils/color';
import { ColorPicker } from '../ui';
import { ControlField } from './ControlField';

function normalizeHexColor(value: string): string | null {
  try {
    const [r, g, b] = hexToRgb(value);
    return rgbToHex(r, g, b);
  } catch {
    return null;
  }
}

export type ColorControlProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  presets?: string[];
};

export function ColorControl({ label, value, onChange, presets }: ColorControlProps) {
  const normalized = normalizeHexColor(value);
  const resolved = normalized ?? '#000000';

  return (
    <ControlField label={label}>
      <div className="flex items-center gap-2">
        <ColorPicker value={resolved} onChange={onChange} presets={presets} />
        <div className="font-mono text-xs text-studio-subtle">{resolved}</div>
      </div>
    </ControlField>
  );
}
