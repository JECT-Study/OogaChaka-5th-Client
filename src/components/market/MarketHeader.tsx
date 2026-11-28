'use client';

import { ChevronLeft, Header, IconButton } from '@/components';
import MarketKebabMenu from '@/components/market/MarketKebabMenu';

interface IMarketHeaderProps {
  title?: string;
  onBack: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
  deleteDisabled?: boolean;
}

export default function MarketHeader({
  title = '상품 상세',
  onBack,
  onDelete,
  onEdit,
  deleteDisabled = false,
}: IMarketHeaderProps) {
  const menuItems = [
    ...(onDelete
      ? [{ id: 'delete', label: '삭제하기', disabled: deleteDisabled, onSelect: onDelete }]
      : []),
    ...(onEdit ? [{ id: 'edit', label: '수정하기', onSelect: onEdit }] : []),
  ];

  return (
    <div className="bg-static-white -mx-5 shrink-0 px-5">
      <Header
        type="detail"
        title={title}
        leading={
          <IconButton
            icon={ChevronLeft}
            label="뒤로가기"
            iconSize={16}
            className="-ml-3"
            onClick={onBack}
          />
        }
        trailing={menuItems.length > 0 ? <MarketKebabMenu items={menuItems} /> : undefined}
      />
    </div>
  );
}
