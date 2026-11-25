import Image from 'next/image';

import Dropdown, { type DropdownItem } from '../Dropdown';

export type MissionListHeaderProps = {
  filters?: DropdownItem[];
  value?: string | number;
  onFilterChange?: (value: string) => void;
};

const DEFAULT_FILTERS: DropdownItem[] = [{ id: 'all', label: '전체' }];

export default function MissionListHeader({
  filters = DEFAULT_FILTERS,
  value,
  onFilterChange,
}: MissionListHeaderProps) {
  return (
    <div className="flex w-full max-w-[335px] items-center justify-between gap-4">
      <h2 className="text-heading-2 text-label-normal whitespace-nowrap">미션 전체</h2>
      <Dropdown
        active
        label="전체"
        list={filters}
        value={value}
        onChange={onFilterChange}
        icon={<Image src="/figma/mission-filter-chevron.svg" width={24} height={24} alt="" />}
      />
    </div>
  );
}
