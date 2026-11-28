'use client';

import { useEffect, type MouseEvent, type ReactNode } from 'react';
import Button from '@/components/common/button/Button';

interface IConfirmSheetShellProps {
  open: boolean;
  dimmed?: boolean;
  title: string;
  cancelLabel: string;
  confirmLabel: string;
  cancelTextClassName: string;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
  children: ReactNode;
}

export default function ConfirmSheetShell({
  open,
  dimmed = false,
  title,
  cancelLabel,
  confirmLabel,
  cancelTextClassName,
  loading,
  onClose,
  onConfirm,
  children,
}: IConfirmSheetShellProps) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !loading) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, loading, onClose]);

  if (!open) return null;

  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (loading) return;
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      role="presentation"
      onClick={handleBackdropClick}
      className={`fixed inset-0 z-50 flex items-end justify-center ${
        dimmed ? 'bg-common-100/84' : ''
      }`.trim()}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-sheet-title"
        aria-describedby="confirm-sheet-desc"
        className="font-pretendard bg-static-white flex w-full flex-col rounded-t-[20px] shadow-[0_-8px_10px_-4px_rgba(143,143,143,0.08),0_-12px_24px_-6px_rgba(143,143,143,0.04)] [font-feature-settings:'ss10']"
      >
        <div className="flex flex-col items-center gap-6 py-3">
          <span aria-hidden="true" className="bg-cool-neutral-10 h-1 w-[74px] rounded-xs" />
          <h2
            id="confirm-sheet-title"
            className="text-label-normal text-center text-[24px] leading-[1.25] font-bold tracking-[-0.1944px]"
          >
            {title}
          </h2>
        </div>

        <div className="flex flex-col items-center justify-center gap-5 px-6 pt-6">{children}</div>

        <div className="bg-gradient-to-b from-transparent to-static-white to-20% px-5 pt-10 pb-[calc(20px+env(safe-area-inset-bottom,0px))]">
          <div className="flex w-full items-center gap-5">
            <button
              type="button"
              disabled={loading}
              onClick={onClose}
              className={`text-label-neutral active:bg-neutral-5 inline-flex h-[60px] shrink-0 items-center justify-center rounded-md px-4 py-3 font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${cancelTextClassName}`}
            >
              {cancelLabel}
            </button>

            <Button
              size="large"
              variant="primary"
              appearance="filled"
              disabled={loading}
              className="flex-1"
              onClick={onConfirm}
            >
              {confirmLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
