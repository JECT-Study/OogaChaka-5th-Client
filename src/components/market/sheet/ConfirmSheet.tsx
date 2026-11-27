'use client';

import DeleteConfirmSheet, { type DeleteConfirmSheetProps } from './DeleteConfirmSheet';
import PurchaseConfirmSheet, { type PurchaseConfirmSheetProps } from './PurchaseConfirmSheet';

export type ConfirmSheetProps =
  | ({ type?: 'delete' } & DeleteConfirmSheetProps)
  | ({ type: 'purchase' } & PurchaseConfirmSheetProps);

export default function ConfirmSheet(props: ConfirmSheetProps) {
  if (props.type === 'purchase') {
    const { type: _type, ...purchaseProps } = props;
    return <PurchaseConfirmSheet {...purchaseProps} />;
  }

  const { type: _type, ...deleteProps } = props;
  return <DeleteConfirmSheet {...deleteProps} />;
}
