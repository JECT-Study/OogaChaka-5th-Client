'use client';

import { MARKET_MESSAGES } from '@/constants/market';
import { useDeleteProduct } from '@/service/market/useDeleteProduct';
import ConfirmSheetShell from './ConfirmSheetShell';

export interface IDeleteConfirmSheetProps {
  open: boolean;
  itemId: number | null;
  title?: string;
  description?: string;
  cancelLabel?: string;
  confirmLabel?: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function DeleteConfirmSheet({
  open,
  itemId,
  title = MARKET_MESSAGES.deleteSheet.title,
  description = MARKET_MESSAGES.deleteSheet.description,
  cancelLabel = MARKET_MESSAGES.deleteSheet.cancelLabel,
  confirmLabel = MARKET_MESSAGES.deleteSheet.confirmLabel,
  onClose,
  onSuccess,
}: IDeleteConfirmSheetProps) {
  const deleteProduct = useDeleteProduct({
    onSuccess: () => {
      onClose();
      onSuccess?.();
    },
  });

  return (
    <ConfirmSheetShell
      open={open && itemId !== null}
      title={title}
      cancelLabel={cancelLabel}
      confirmLabel={
        deleteProduct.isPending ? MARKET_MESSAGES.deleteSheet.loadingLabel : confirmLabel
      }
      cancelTextClassName="text-[22px] leading-[1.364] tracking-[-0.0946px]"
      loading={deleteProduct.isPending}
      onClose={onClose}
      onConfirm={() => {
        if (itemId !== null && !deleteProduct.isPending) {
          deleteProduct.mutate(itemId);
        }
      }}
    >
      <p
        id="confirm-sheet-desc"
        className="text-label-alternative max-w-[287px] text-center text-[16px] leading-[1.5] font-normal tracking-[0.0144px] text-pretty whitespace-pre-line"
      >
        {description}
      </p>
    </ConfirmSheetShell>
  );
}
