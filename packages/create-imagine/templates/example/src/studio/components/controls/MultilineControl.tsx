import { Textarea } from '../ui';
import { ControlField } from './ControlField';

export type MultilineControlProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
};

export function MultilineControl({ label, value, onChange, placeholder, maxLength }: MultilineControlProps) {
  const meta = maxLength ? `${value.length}/${maxLength}` : `${value.length}`;
  return (
    <ControlField label={label} meta={meta}>
      <Textarea
        aria-label={label}
        rows={5}
        autoResize
        maxRows={12}
        placeholder={placeholder}
        value={value}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
      />
    </ControlField>
  );
}

