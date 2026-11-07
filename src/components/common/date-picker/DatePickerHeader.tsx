'use client';
import { ChevronLeft, ChevronRight, IconButton } from '@/components';

export interface IDatePickerHeaderProps {
  type: 'month' | 'week';
  month: number;
  year?: number;
  next: () => void;
  prev: () => void;
  className?: string;
}

export default function DatePickerHeader({
  type,
  month,
  year,
  next,
  prev,
  className = '',
}: IDatePickerHeaderProps) {
  return (
    <div className={`flex h-[30px] w-[258px] items-center justify-between ${className}`}>
      <IconButton icon={ChevronLeft} label="이전" iconSize={14} onClick={prev} />
      <div className="text-heading-1 text-label-normal text-right font-features-['ss10']">
        {type === 'month' && year && `${year}년 `}
        {month}월
      </div>
      <IconButton icon={ChevronRight} label="다음" iconSize={14} onClick={next} />
    </div>
  );
}
