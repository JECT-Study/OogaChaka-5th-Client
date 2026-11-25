'use client';

import { useState, type ReactNode } from 'react';
import { cx, ChevronDown } from '@/components';

export type DropdownVariant = 'neutral' | 'positive' | 'negative';

export interface DropdownItem {
  id: string | number;
  label: string;
}

export interface IDropdownProps {
  active?: boolean;
  variant?: DropdownVariant;
  label?: string;
  list?: DropdownItem[];
  value?: string | number;
  onChange?: (value: string) => void;
  icon?: ReactNode;
}

const VARIANT_STYLES: Record<DropdownVariant, string> = {
  neutral: 'text-label-neutral border-line-normal-normal',
  positive: 'text-label-neutral border-line-solid-primary',
  negative: 'text-label-neutral border-status-border-danger',
};

export default function Dropdown({
  active = false,
  variant = 'neutral',
  label = '진행중',
  list = [],
  value,
  onChange,
  icon,
  ...props
}: IDropdownProps) {
  const [internalSelected, setInternalSelected] = useState<string | number>(
    value ?? list[0]?.id ?? '',
  );

  const selectedValue = value !== undefined ? value : internalSelected;
  const currentLabel =
    list.find((item) => String(item.id) === String(selectedValue))?.label ?? label;

  const handleChange = (newVal: string) => {
    setInternalSelected(newVal);
    onChange?.(newVal);
  };

  return (
    <div
      data-focus={active ? 'True' : 'False'}
      className={cx(
        'text-body-1-reading bg-static-white shadow-ds-xsmall relative inline-flex h-10 min-w-24 items-center justify-between gap-3 rounded-md border-[1.5px] px-3 py-2',
        !active ? 'text-label-disabled border-line-normal-alternative' : VARIANT_STYLES[variant],
      )}
      {...props}
    >
      <span className="line-clamp-1">{currentLabel}</span>
      <span className="flex size-6 shrink-0 items-center justify-center">
        {icon ?? (
          <ChevronDown
            size={14}
            className={cx(
              !active ? 'text-label-disabled' : 'text-label-alternative',
              'transition-transform',
            )}
          />
        )}
      </span>

      {/*  네이티브 피커용 투명 select */}
      {list.length > 0 && (
        <select
          value={selectedValue}
          onChange={(e) => handleChange(e.target.value)}
          disabled={!active}
          className="absolute inset-0 size-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
          aria-label="선택"
        >
          {list.map(({ id, label }) => (
            <option key={id} value={id}>
              {label}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
