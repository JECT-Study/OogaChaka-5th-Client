'use client';
import { useState, type ReactNode } from 'react';
import { cx, ChevronDown } from '@/components';

export type DropdownVariant = 'neutral' | 'positive' | 'negative';

export interface IDropdownProps {
  active?: boolean;
  variant?: DropdownVariant;
  label?: string;
  children?: ReactNode;
}

const VARIANT_STYLES: Record<DropdownVariant, string> = {
  neutral: 'text-label-neutral border-line-normal-normal',
  positive: 'text-label-neutral border-line-solid-primary',
  negative: 'text-label-neutral  border-status-border-danger',
};

export default function Dropdown({
  active = false,
  variant = 'neutral',
  label,
  children,
  ...props
}: IDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-flex flex-col">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        type="button"
        data-focus={active ? 'True' : 'False'}
        className={cx(
          'text-body-1-reading bg-static-white shadow-ds-xsmall relative inline-flex h-10 min-w-24 items-center justify-between gap-3 rounded-md border-[1.5px] px-3 py-2',
          !active ? 'text-label-disabled border-line-normal-alternative' : VARIANT_STYLES[variant],
        )}
        {...props}
      >
        <span className="line-clamp-1">{label}</span>
        <span className="flex size-6 shrink-0 items-center justify-center">
          <ChevronDown
            size={14}
            className={cx(
              !active ? 'text-label-disabled' : 'text-label-alternative',
              'transition-transform',
              isOpen && 'rotate-180',
            )}
          />
        </span>
      </button>
      {isOpen && <div>{children}</div>}
    </div>
  );
}
