'use client';
import { useState } from 'react';
import dayjs, { type Dayjs } from 'dayjs';
import 'dayjs/locale/ko';
import DatePickerHeader from './DatePickerHeader';

dayjs.locale('ko');

interface WeekSelectorProps {
  initialDate?: Dayjs;
  onChangeDate?: (date: Dayjs) => void;
}

export default function WeekSelector({ initialDate = dayjs(), onChangeDate }: WeekSelectorProps) {
  const [currentWeek, setCurrentWeek] = useState(initialDate);
  const [selectedDate, setSelectedDate] = useState(initialDate);

  const handleNext = () => {
    const next = currentWeek.add(1, 'week');
    const newSelected = next.startOf('week');
    setCurrentWeek(next);
    setSelectedDate(newSelected);
    onChangeDate?.(newSelected);
  };

  const handlePrev = () => {
    const prev = currentWeek.subtract(1, 'week');
    const newSelected = prev.startOf('week');
    setCurrentWeek(prev);
    setSelectedDate(newSelected);
    onChangeDate?.(newSelected);
  };

  const handleSelectDay = (idx: number) => {
    const newSelected = currentWeek.startOf('week').add(idx, 'day');
    setSelectedDate(newSelected);
    onChangeDate?.(newSelected);
  };

  const startOfWeek = currentWeek.startOf('week');
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const cur = startOfWeek.add(i, 'day');
    return {
      label: cur.format('ddd'),
      date: cur.date(),
    };
  });

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <DatePickerHeader
        type="week"
        month={currentWeek.month() + 1}
        next={handleNext}
        prev={handlePrev}
      />

      <div className="flex gap-1">
        {weekDays.map(({ label, date: dayNumber }, idx) => {
          const active = selectedDate.day() === idx;

          return (
            <button
              onClick={() => handleSelectDay(idx)}
              key={idx}
              className={`${
                active ? 'bg-primary-normal' : 'bg-transparent'
              } inline-flex flex-col items-center gap-1 rounded-full p-1 transition-all duration-300 ease-in-out`}
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
                {dayNumber}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
