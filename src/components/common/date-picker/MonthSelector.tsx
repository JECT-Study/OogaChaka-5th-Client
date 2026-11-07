'use client';
import { useMemo } from 'react';
import DatePickerHeader from './DatePickerHeader';
import { useDatePicker } from '@/hook/useDatePicker';
import { WEEKDAYS, type IMonthSelectorProps } from '@/types/date-picker';

const getDayStyle = (isSelected: boolean, isCurrentMonth: boolean) => {
  if (isSelected) {
    return 'border-primary-subtle bg-primary-subtle text-primary-heavy font-semibold';
  }
  if (isCurrentMonth) {
    return 'border-transparent text-label-neutral hover:bg-periwinkle-50 hover:text-label-normal';
  }
  return 'border-transparent text-label-alternative/30 hover:bg-periwinkle-50/50 hover:text-label-neutral';
};

export default function MonthSelector({ initialDate, onChangeDate }: IMonthSelectorProps) {
  const { viewDate, selectedDate, next, prev, selectDate } = useDatePicker({
    type: 'month',
    initialDate,
    onChangeDate,
  });

  const calendarDays = useMemo(() => {
    const startOfCalendar = viewDate.startOf('month').startOf('week');
    return Array.from({ length: 42 }, (_, i) => {
      const date = startOfCalendar.add(i, 'day');
      return {
        date,
        day: date.date(),
        isCurrentMonth: date.month() === viewDate.month(),
        isSelected: date.isSame(selectedDate, 'day'),
      };
    });
  }, [viewDate, selectedDate]);

  return (
    <div className="border-line-normal-normal flex w-[320px] flex-col items-center justify-center gap-5 rounded-md border px-5 pt-6 pb-5">
      <DatePickerHeader
        type="month"
        year={viewDate.year()}
        month={viewDate.month() + 1}
        next={next}
        prev={prev}
      />

      <div className="flex w-full flex-col gap-2">
        {/* 요일 헤더 */}
        <div className="grid grid-cols-7 text-center">
          {WEEKDAYS.map((day) => (
            <div
              key={day}
              className="text-label-2 text-label-neutral flex h-9 w-full items-center justify-center font-features-['ss10']"
            >
              {day}
            </div>
          ))}
        </div>

        {/* 6x7 고정 일자 그리드 (총 42칸) */}
        <div className="grid grid-cols-7 text-center">
          {calendarDays.map(({ date, day, isCurrentMonth, isSelected }, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => selectDate(date)}
              className={`text-body-1-normal mx-auto flex h-9 w-9 items-center justify-center gap-1 rounded-md border-2 p-1.5 font-features-['ss10'] ${getDayStyle(
                isSelected,
                isCurrentMonth,
              )}`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
