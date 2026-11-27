'use client';

import ActionConfirmDialog, { type IActionConfirmDialogProps } from './ActionConfirmDialog';
import PurchaseCompleteDialog, { type IPurchaseCompleteDialogProps } from './PurchaseCompleteDialog';

type IConfirmDialogProps =
  | ({ type?: 'confirm' } & IActionConfirmDialogProps)
  | ({ type: 'complete' } & IPurchaseCompleteDialogProps);

export default function ConfirmDialog(props: IConfirmDialogProps) {
  if (props.type === 'complete') {
    const { type: _type, ...completeProps } = props;
    return <PurchaseCompleteDialog {...completeProps} />;
  }

  const { type: _type, ...confirmProps } = props;
  return <ActionConfirmDialog {...confirmProps} />;
}
