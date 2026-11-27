'use client';

import { useEffect, type MouseEvent, type ReactNode } from 'react';
import { Overlay } from '@/components';

export type ConfirmDialogShellProps = {
  open: boolean;
  overlayType?: 'bright' | 'dark';
  loading?: boolean;
  ariaDescribedBy?: string;
  className?: string;
  onBackdropClose?: () => void;
  children: ReactNode;
};

export default function ConfirmDialogShell({
  open,
  overlayType = 'bright',
  loading = false,
  ariaDescribedBy,
  className = '',
  onBackdropClose,
  children,
}: ConfirmDialogShellProps) {
  useEffect(() => {
    if (!open || !onBackdropClose) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !loading) {
        onBackdropClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, loading, onBackdropClose]);

  if (!open) return null;

  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (loading) return;
    if (event.target === event.currentTarget) {
      onBackdropClose?.();
    }
  };

  return (
    <Overlay
      type={overlayType}
      isOpen={open}
      aria-hidden={undefined}
      onClick={handleBackdropClick}
      className="px-content-safe py-safe"
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby={ariaDescribedBy}
        className={`font-pretendard bg-static-white shadow-ds-medium flex w-full max-w-[335px] flex-col [font-feature-settings:'ss10'] ${className}`.trim()}
      >
        {children}
      </div>
    </Overlay>
  );
}
