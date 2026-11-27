'use client';

import ActionConfirmDialog, { type ActionConfirmDialogProps } from './ActionConfirmDialog';
import PurchaseCompleteDialog, { type PurchaseCompleteDialogProps } from './PurchaseCompleteDialog';

export type ConfirmDialogProps =
  | ({ type?: 'confirm' } & ActionConfirmDialogProps)
  | ({ type: 'complete' } & PurchaseCompleteDialogProps);

export default function ConfirmDialog(props: ConfirmDialogProps) {
  if (props.type === 'complete') {
    const { type: _type, ...completeProps } = props;
    return <PurchaseCompleteDialog {...completeProps} />;
  }

  const { type: _type, ...confirmProps } = props;
  return <ActionConfirmDialog {...confirmProps} />;
}
