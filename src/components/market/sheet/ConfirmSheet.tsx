'use client';

import DeleteConfirmSheet, { type IDeleteConfirmSheetProps } from './DeleteConfirmSheet';
import PurchaseConfirmSheet, { type IPurchaseConfirmSheetProps } from './PurchaseConfirmSheet';

type IConfirmSheetProps =
  | ({ type?: 'delete' } & IDeleteConfirmSheetProps)
  | ({ type: 'purchase' } & IPurchaseConfirmSheetProps);

export default function ConfirmSheet(props: IConfirmSheetProps) {
  if (props.type === 'purchase') {
    const { type: _type, ...purchaseProps } = props;
    return <PurchaseConfirmSheet {...purchaseProps} />;
  }

  const { type: _type, ...deleteProps } = props;
  return <DeleteConfirmSheet {...deleteProps} />;
}
