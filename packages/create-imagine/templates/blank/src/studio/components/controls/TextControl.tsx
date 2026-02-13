import { Input } from '../ui';
import { ControlField } from './ControlField';

export type TextControlProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
};

export function TextControl({ label, value, onChange, placeholder, maxLength }: TextControlProps) {
  const meta = maxLength ? `${value.length}/${maxLength}` : `${value.length}`;
  return (
    <ControlField label={label} meta={meta}>
      <Input
        aria-label={label}
        type="text"
        placeholder={placeholder}
        value={value}
        maxLength={maxLength}
        clearable
        onClear={() => onChange('')}
        onChange={(e) => onChange(e.target.value)}
      />
    </ControlField>
  );
}

