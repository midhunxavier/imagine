import { theme } from '../../../framework/theme';
import { SelectControl, type SelectControlOption } from './SelectControl';

export type FontControlProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  fonts?: string[];
};

export function FontControl({ label, value, onChange, fonts }: FontControlProps) {
  const options: SelectControlOption[] = fonts?.length
    ? fonts.map((f) => ({ label: f, value: f }))
    : [
        { label: 'Sans', value: theme.fontFamily },
        { label: 'Mono', value: theme.monoFontFamily }
      ];

  return (
    <SelectControl
      label={label}
      value={value}
      options={options}
      onChange={onChange}
      renderOptionLabel={(opt) => <span style={{ fontFamily: opt.value }}>{opt.label}</span>}
    />
  );
}

