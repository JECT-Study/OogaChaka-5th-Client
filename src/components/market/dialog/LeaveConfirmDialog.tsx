'use client';

import { MARKET_MESSAGES } from '@/constants/market';
import ActionConfirmDialog from './ActionConfirmDialog';

interface ILeaveConfirmDialogProps {
  open: boolean;
  mode: 'create' | 'edit';
  onClose: () => void;
  onLeave: () => void;
}

export default function LeaveConfirmDialog({
  open,
  mode,
  onClose,
  onLeave,
}: ILeaveConfirmDialogProps) {
  const copy = MARKET_MESSAGES.leaveDialog[mode];

  return (
    <ActionConfirmDialog
      open={open}
      title={MARKET_MESSAGES.leaveDialog.title}
      description={copy.description}
      secondaryLabel={copy.secondaryLabel}
      primaryLabel={copy.primaryLabel}
      onSecondary={() => {
        onClose();
        onLeave();
      }}
      onPrimary={onClose}
    />
  );
}
