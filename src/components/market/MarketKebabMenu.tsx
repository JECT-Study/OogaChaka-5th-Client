'use client';

import { useEffect, useRef, useState } from 'react';
import { IconButton, MoreVertical } from '@/components';
import type { KebabMenuItem } from '@/types/market/types';

interface IMarketKebabMenuProps {
  items: KebabMenuItem[];
  label?: string;
}

export default function MarketKebabMenu({
  items,
  label = '더보기 메뉴',
}: IMarketKebabMenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <IconButton
        icon={MoreVertical}
        label={label}
        iconSize={20}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((prev) => !prev)}
      />

      {open && (
        <div
          role="menu"
          className="font-pretendard bg-static-white shadow-ds-small absolute top-10 right-0 z-30 flex flex-col items-center justify-center rounded-sm p-3 [font-feature-settings:'ss10']"
        >
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              role="menuitem"
              disabled={item.disabled}
              onClick={() => {
                setOpen(false);
                item.onSelect();
              }}
              className="flex w-full items-center justify-center rounded-[4px] bg-transparent px-2 py-1.5 text-[12px] font-medium leading-[1.273] tracking-[0.0408px] whitespace-nowrap text-label-alternative transition-colors hover:bg-primary-subtle hover:text-label-normal active:bg-primary-subtle active:text-label-normal focus-visible:bg-primary-subtle focus-visible:text-label-normal focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
