'use client';

import { Button, Thumbnail } from '@/components';
import { MARKET_MESSAGES } from '@/constants/market';
import ConfirmDialogShell from './ConfirmDialogShell';

export type PurchaseCompleteDialogProps = {
  open: boolean;
  thumbnailSrc?: string | null;
  thumbnailAlt?: string;
  title?: string;
  description?: string;
  actionLabel?: string;
  onBackdropClose?: () => void;
  onAction: () => void;
};

export default function PurchaseCompleteDialog({
  open,
  thumbnailSrc,
  thumbnailAlt = '',
  title = MARKET_MESSAGES.purchaseCompleteDialog.title,
  description = MARKET_MESSAGES.purchaseCompleteDialog.description,
  actionLabel = MARKET_MESSAGES.purchaseCompleteDialog.actionLabel,
  onBackdropClose,
  onAction,
}: PurchaseCompleteDialogProps) {
  return (
    <ConfirmDialogShell
      open={open}
      overlayType="dark"
      ariaDescribedBy={description ? 'confirm-dialog-desc' : undefined}
      onBackdropClose={onBackdropClose ?? onAction}
      className="items-center gap-5 overflow-hidden rounded-[20px] p-5"
    >
      <Thumbnail
        src={thumbnailSrc}
        alt={thumbnailAlt}
        width="100%"
        height={195}
        className="aspect-auto rounded-md"
      />

      <div className="flex w-full flex-col items-center gap-3 text-center">
        <h2
          id="confirm-dialog-title"
          className="text-label-normal text-[22px] leading-[1.364] font-semibold tracking-[-0.0946px] break-keep"
        >
          {title}
        </h2>
        {description && (
          <p
            id="confirm-dialog-desc"
            className="text-body-2-reading text-label-alternative leading-[1.6] break-keep whitespace-pre-line"
          >
            {description}
          </p>
        )}
      </div>

      <Button size="large" variant="primary" appearance="filled" width="100%" onClick={onAction}>
        {actionLabel}
      </Button>
    </ConfirmDialogShell>
  );
}
