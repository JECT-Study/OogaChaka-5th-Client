'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { MARKET_MESSAGES } from '@/constants/market';
import { usePurchaseProduct } from '@/hook/useGetProduct';
import type { MarketPurchase } from '@/types/market/types';
import MarketPointBadge from '../MarketPointBadge';
import ConfirmSheetShell from './ConfirmSheetShell';

export type PurchaseConfirmSheetProps = {
  open: boolean;
  itemId: number | null;
  title?: string;
  description?: string;
  points: number;
  cancelLabel?: string;
  confirmLabel?: string;
  onClose: () => void;
  onSuccess?: (purchase: MarketPurchase) => void;
};

export default function PurchaseConfirmSheet({
  open,
  itemId,
  title = '',
  description,
  points,
  cancelLabel = MARKET_MESSAGES.purchaseSheet.cancelLabel,
  confirmLabel = MARKET_MESSAGES.purchaseSheet.confirmLabel,
  onClose,
  onSuccess,
}: PurchaseConfirmSheetProps) {
  // 같은 구매 시도의 재요청은 동일 Idempotency-Key를 사용하고, 시트를 새로 열면 새 키를 발급한다.
  const idempotencyKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (open) {
      idempotencyKeyRef.current = crypto.randomUUID();
    } else {
      idempotencyKeyRef.current = null;
    }
  }, [open, itemId, points]);

  const purchaseProduct = usePurchaseProduct({
    onSuccess: (purchase) => {
      onClose();
      onSuccess?.(purchase);
    },
  });

  return (
    <ConfirmSheetShell
      open={open && itemId !== null}
      dimmed
      title={title}
      cancelLabel={cancelLabel}
      confirmLabel={
        purchaseProduct.isPending ? MARKET_MESSAGES.purchaseSheet.loadingLabel : confirmLabel
      }
      cancelTextClassName="text-[20px] leading-[1.4] tracking-[-0.048px]"
      loading={purchaseProduct.isPending}
      onClose={onClose}
      onConfirm={() => {
        if (itemId === null || purchaseProduct.isPending) return;
        const key = idempotencyKeyRef.current ?? crypto.randomUUID();
        idempotencyKeyRef.current = key;
        purchaseProduct.mutate({
          itemId,
          expectedPrice: points,
          idempotencyKey: key,
        });
      }}
    >
      <div className="flex flex-col items-center justify-center gap-4">
        <Image
          src="/images/market-point-pouch.svg"
          alt=""
          aria-hidden="true"
          width={100}
          height={122}
          className="h-[122px] w-[100px] shrink-0"
        />
        <MarketPointBadge points={points} prefix="- " />
      </div>
      <p
        id="confirm-sheet-desc"
        className="text-label-alternative max-w-[287px] text-center text-[16px] leading-[1.5] font-normal tracking-[0.0144px] text-pretty whitespace-pre-line"
      >
        {description ?? MARKET_MESSAGES.purchaseSheet.description(points)}
      </p>
    </ConfirmSheetShell>
  );
}
