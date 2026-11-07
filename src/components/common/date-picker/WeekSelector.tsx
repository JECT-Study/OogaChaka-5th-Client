'use client';
import { useMemo } from 'react';
import DatePickerHeader from './DatePickerHeader';
import { useDatePicker } from '@/hook/useDatePicker';
import type { IWeekSelectorProps } from '@/types/date-picker';

export default function WeekSelector({ initialDate, onChangeDate }: IWeekSelectorProps) {
  const { viewDate, selectedDate, next, prev, selectDate } = useDatePicker({
    type: 'week',
    initialDate,
    onChangeDate,
  });

  const weekDays = useMemo(() => {
    const startOfWeek = viewDate.startOf('week');
    return Array.from({ length: 7 }, (_, idx) => {
      const cur = startOfWeek.add(idx, 'day');
      return {
        label: cur.format('ddd'),
        date: cur.date(),
        active: selectedDate.day() === idx,
      };
    });
  }, [viewDate, selectedDate]);

  const handleSelectDay = (idx: number) => {
    const nextSelected = viewDate.startOf('week').add(idx, 'day');
    selectDate(nextSelected);
  };

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <DatePickerHeader type="week" month={viewDate.month() + 1} next={next} prev={prev} />

      <div className="flex gap-1">
        {weekDays.map(({ label, date, active }, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSelectDay(idx)}
            className={`inline-flex flex-col items-center gap-1 rounded-full p-1 transition-all duration-300 ease-in-out ${
              active ? 'bg-primary-normal' : 'bg-transparent'
            }`}
          >
            <span
              className={`text-body-1-normal text-center font-features-['ss10'] transition-colors duration-300 ${
                active ? 'text-common-0' : 'text-label-alternative'
              }`}
            >
              {label}
            </span>
            <span
              className={`text-body-1-normal flex h-9 w-9 items-center justify-center rounded-full p-1.5 font-features-['ss10'] transition-all duration-300 ${
                active
                  ? 'bg-periwinkle-50 ring-primary-subtle text-label-normal ring-1'
                  : 'text-label-neutral bg-transparent ring-1 ring-transparent'
              }`}
            >
              {date}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
