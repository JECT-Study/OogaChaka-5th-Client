'use client';

import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { ChevronLeft, IconButton } from '@/components';

interface IHeaderProps {
  type?: 'detail' | 'sub';
  title?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
}

export default function Header({ type = 'detail', title, leading, trailing }: IHeaderProps) {
  const router = useRouter();

  if (type === 'detail') {
    return (
      <header className="pt-safe relative z-10 flex min-h-11 items-center justify-between">
        {leading ?? (
          <IconButton
            icon={ChevronLeft}
            label="뒤로가기"
            iconSize={14}
            onClick={() => router.back()}
          />
        )}
        {title && <h1 className="text-heading-2 box-content p-2.5">{title}</h1>}
        {trailing ?? <span className="size-11" />}
      </header>
    );
  }

  return (
    <header className="pt-safe relative z-10 flex min-h-11 items-center justify-between">
      <div className="flex items-center">
        {leading}
        {title && <h1 className="text-heading-2 box-content p-2.5">{title}</h1>}
      </div>
      {trailing}
    </header>
  );
}
