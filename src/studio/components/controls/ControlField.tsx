import type { ReactNode } from 'react';

export type ControlFieldProps = {
  label: string;
  meta?: ReactNode;
  children: ReactNode;
};

export function ControlField({ label, meta, children }: ControlFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <div className="text-xs font-semibold text-studio-subtle">{label}</div>
        {meta ? <div className="text-xs text-studio-subtle">{meta}</div> : null}
      </div>
      {children}
    </div>
  );
}

