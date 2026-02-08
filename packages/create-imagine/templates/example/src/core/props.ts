export function mergeProps(
  defaults: Record<string, unknown> | undefined,
  overrides: Record<string, unknown> | undefined
): Record<string, unknown> {
  return { ...(defaults ?? {}), ...(overrides ?? {}) };
}

