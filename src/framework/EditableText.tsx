import type { ReactNode, SVGProps } from 'react';

export type EditableTextProps = SVGProps<SVGTextElement> & {
  propKey: string;
  children: ReactNode;
};

export function EditableText({ propKey, children, ...textProps }: EditableTextProps) {
  return (
    <text data-editable-key={propKey} {...textProps}>
      {children}
    </text>
  );
}
