'use client';
import { WeekSelector, MonthSelector } from '@/components';
import type { IDatePickerProps } from '@/types/date-picker';

export default function DatePicker({ type = 'week', initialDate, onChangeDate }: IDatePickerProps) {
  return (
    <div className="flex w-full flex-col items-center">
      {type === 'week' ? (
        <WeekSelector initialDate={initialDate} onChangeDate={onChangeDate} />
      ) : (
        <MonthSelector initialDate={initialDate} onChangeDate={onChangeDate} />
      )}
    </div>
  );
}
