'use client';

import { useEffect, type MouseEvent } from 'react';
import Button from '@/components/common/button/Button';
import { MARKET_MESSAGES } from '@/constants/market';

type DeleteConfirmSheetProps = {
  open: boolean;
  title?: string;
  description?: string;
  cancelLabel?: string;
  confirmLabel?: string;
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function DeleteConfirmSheet({
  open,
  title = MARKET_MESSAGES.deleteSheet.title,
  description = MARKET_MESSAGES.deleteSheet.description,
  cancelLabel = MARKET_MESSAGES.deleteSheet.cancelLabel,
  confirmLabel = MARKET_MESSAGES.deleteSheet.confirmLabel,
  loading = false,
  onCancel,
  onConfirm,
}: DeleteConfirmSheetProps) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !loading) {
        onCancel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, loading, onCancel]);

  if (!open) return null;

  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (loading) return;
    if (event.target === event.currentTarget) {
      onCancel();
    }
  };

  return (
    <div
      role="presentation"
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-end justify-center"
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-confirm-sheet-title"
        aria-describedby="delete-confirm-sheet-desc"
        className="font-pretendard bg-static-white flex w-full flex-col rounded-t-[20px] shadow-[0_-8px_10px_-4px_rgba(143,143,143,0.08),0_-12px_24px_-6px_rgba(143,143,143,0.04)] [font-feature-settings:'ss10']"
      >
        <div className="flex flex-col items-center gap-6 py-3">
          <span aria-hidden="true" className="bg-cool-neutral-10 h-1 w-[74px] rounded-xs" />
          <h2
            id="delete-confirm-sheet-title"
            className="text-label-normal text-center text-[24px] leading-[1.25] font-bold tracking-[-0.1944px]"
          >
            {title}
          </h2>
        </div>

        <div className="flex flex-col items-center justify-center px-6 pt-6">
          <p
            id="delete-confirm-sheet-desc"
            className="text-label-alternative max-w-[287px] text-center text-[16px] leading-[1.5] font-normal tracking-[0.0144px] text-pretty whitespace-pre-line"
          >
            {description}
          </p>
        </div>

        <div className="bg-gradient-to-b from-transparent to-static-white to-20% px-5 pt-10 pb-[calc(20px+env(safe-area-inset-bottom,0px))]">
          <div className="flex w-full items-center gap-5">
            <button
              type="button"
              disabled={loading}
              onClick={onCancel}
              className="text-label-neutral active:bg-neutral-5 inline-flex h-[60px] shrink-0 items-center justify-center rounded-md px-4 py-3 text-[22px] leading-[1.364] font-semibold tracking-[-0.0946px] transition-colors disabled:cursor-not-allowed disabled:opacity-40"
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
              {loading ? MARKET_MESSAGES.deleteSheet.loadingLabel : confirmLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
