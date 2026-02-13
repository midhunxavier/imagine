import type { ReactNode } from 'react';
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { cn } from '../ui';
import { ControlField } from './ControlField';

export type SelectControlOption = { label: string; value: string; group?: string };

type OptionItem = { option: SelectControlOption; index: number };

export type SelectControlProps = {
  label: string;
  value: string;
  options: SelectControlOption[];
  placeholder?: string;
  onChange: (value: string) => void;
  renderOptionLabel?: (opt: SelectControlOption) => ReactNode;
};

export function SelectControl({ label, value, options, placeholder, onChange, renderOptionLabel }: SelectControlProps) {
  const id = useId();
  const listboxId = `${id}-listbox`;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const selected = useMemo(() => options.find((o) => o.value === value) ?? null, [options, value]);

  const filtered: OptionItem[] = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = q
      ? options.filter((opt) => opt.label.toLowerCase().includes(q) || opt.value.toLowerCase().includes(q))
      : options;
    return base.map((opt, idx) => ({ option: opt, index: idx }));
  }, [options, query]);

  const groupEntries = useMemo(() => {
    const hasGroups = filtered.some((item) => Boolean(item.option.group?.trim()));
    if (!hasGroups) return [{ group: null as string | null, items: filtered }];

    const order: Array<string | null> = [];
    const byGroup = new Map<string | null, OptionItem[]>();
    for (const item of filtered) {
      const group = item.option.group?.trim() || null;
      if (!byGroup.has(group)) {
        byGroup.set(group, []);
        order.push(group);
      }
      byGroup.get(group)!.push(item);
    }
    return order.map((group) => ({ group, items: byGroup.get(group)! }));
  }, [filtered]);

  function closeDropdown() {
    setOpen(false);
    setQuery('');
    setActiveIndex(0);
  }

  function openDropdown() {
    if (open) return;
    setOpen(true);
    setQuery('');
    const idx = options.findIndex((o) => o.value === value);
    setActiveIndex(idx >= 0 ? idx : 0);
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  useEffect(() => {
    if (!open) return;
    const onMouseDown = (e: MouseEvent) => {
      const el = containerRef.current;
      if (!el) return;
      if (e.target instanceof Node && !el.contains(e.target)) closeDropdown();
    };
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    setActiveIndex((prev) => {
      if (filtered.length <= 0) return 0;
      return Math.max(0, Math.min(filtered.length - 1, prev));
    });
  }, [filtered.length, open]);

  const activeOptionId = open && filtered[activeIndex] ? `${id}-opt-${activeIndex}` : undefined;

  return (
    <ControlField label={label}>
      <div ref={containerRef}>
        <input
          ref={inputRef}
          role="combobox"
          aria-label={label}
          aria-expanded={open}
          aria-controls={open ? listboxId : undefined}
          aria-activedescendant={activeOptionId}
          readOnly={!open}
          className={cn(
            'w-full rounded-control border border-studio-border bg-white px-2.5 py-2 text-sm shadow-sm outline-none transition-colors duration-80',
            'placeholder:text-studio-subtle/70',
            'focus:border-studio-blue focus:ring-2 focus:ring-studio-blue/30'
          )}
          placeholder={placeholder}
          value={open ? query : selected?.label ?? ''}
          onFocus={() => openDropdown()}
          onClick={() => openDropdown()}
          onChange={(e) => {
            if (!open) openDropdown();
            setQuery(e.target.value);
            setActiveIndex(0);
          }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              if (!open) {
                openDropdown();
                return;
              }
              if (!filtered.length) return;
              setActiveIndex((i) => (i + 1) % filtered.length);
            }
            if (e.key === 'ArrowUp') {
              e.preventDefault();
              if (!open) {
                openDropdown();
                return;
              }
              if (!filtered.length) return;
              setActiveIndex((i) => (i - 1 + filtered.length) % filtered.length);
            }
            if (e.key === 'Enter') {
              if (!open) {
                openDropdown();
                return;
              }
              const item = filtered[activeIndex];
              if (!item) return;
              e.preventDefault();
              onChange(item.option.value);
              closeDropdown();
            }
            if (e.key === 'Escape') {
              if (!open) return;
              e.preventDefault();
              closeDropdown();
            }
            if (e.key === 'Tab') {
              if (!open) return;
              closeDropdown();
            }
          }}
        />

        {open ? (
          <div id={listboxId} role="listbox" className="mt-1 max-h-60 overflow-auto rounded-control border border-studio-border bg-white p-1 shadow-cardHover">
            {filtered.length ? (
              groupEntries.map((entry) => (
                <div key={entry.group ?? '__ungrouped'}>
                  {entry.group ? (
                    <div className="px-2.5 pb-1 pt-2 text-[11px] font-bold uppercase tracking-wider text-gray-500">{entry.group}</div>
                  ) : null}
                  {entry.items.map((item) => {
                    const optIndex = item.index;
                    const isActive = optIndex === activeIndex;
                    const isSelected = item.option.value === value;
                    const optionId = `${id}-opt-${optIndex}`;
                    return (
                      <button
                        key={`${optIndex}:${item.option.value}`}
                        id={optionId}
                        role="option"
                        aria-selected={isSelected}
                        type="button"
                        className={cn(
                          'w-full rounded-control px-2.5 py-2 text-left text-sm hover:bg-studio-panel',
                          isActive ? 'bg-studio-panel' : null
                        )}
                        onMouseEnter={() => setActiveIndex(optIndex)}
                        onClick={() => {
                          onChange(item.option.value);
                          closeDropdown();
                          inputRef.current?.focus();
                        }}
                      >
                        {renderOptionLabel ? renderOptionLabel(item.option) : item.option.label}
                      </button>
                    );
                  })}
                </div>
              ))
            ) : (
              <div className="px-2.5 py-2 text-sm text-studio-subtle">No matches.</div>
            )}
          </div>
        ) : null}
      </div>
    </ControlField>
  );
}
