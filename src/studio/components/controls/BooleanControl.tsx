import { Switch } from '../ui';

export type BooleanControlProps = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export function BooleanControl({ label, checked, onChange }: BooleanControlProps) {
  return <Switch checked={checked} onCheckedChange={onChange} label={label} />;
}

