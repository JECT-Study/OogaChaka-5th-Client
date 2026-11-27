'use client';

import Image from 'next/image';
import { MARKET_MESSAGES } from '@/constants/market';
import MarketPointBadge from '../MarketPointBadge';
import ConfirmSheetShell from './ConfirmSheetShell';

export type PurchaseConfirmSheetProps = {
  open: boolean;
  title?: string;
  description?: string;
  points: number;
  cancelLabel?: string;
  confirmLabel?: string;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function PurchaseConfirmSheet({
  open,
  title = '',
  description,
  points,
  cancelLabel = MARKET_MESSAGES.purchaseSheet.cancelLabel,
  confirmLabel = MARKET_MESSAGES.purchaseSheet.confirmLabel,
  loading = false,
  onClose,
  onConfirm,
}: PurchaseConfirmSheetProps) {
  return (
    <ConfirmSheetShell
      open={open}
      dimmed
      title={title}
      cancelLabel={cancelLabel}
      confirmLabel={loading ? MARKET_MESSAGES.purchaseSheet.loadingLabel : confirmLabel}
      cancelTextClassName="text-[20px] leading-[1.4] tracking-[-0.048px]"
      loading={loading}
      onClose={onClose}
      onConfirm={onConfirm}
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
