'use client';
import type { Dayjs } from 'dayjs';
import { WeekSelector, MonthSelector } from '@/components';

interface IDatePicker {
  type?: 'month' | 'week';
  initialDate?: Dayjs;
  onChangeDate?: (date: Dayjs) => void;
}

export default function DatePicker({ type = 'week', initialDate, onChangeDate }: IDatePicker) {
  return (
    <div className="flex w-full flex-col items-center">
      {type === 'week' && <WeekSelector initialDate={initialDate} onChangeDate={onChangeDate} />}
      {type === 'month' && <MonthSelector initialDate={initialDate} onChangeDate={onChangeDate} />}
    </div>
  );
}
