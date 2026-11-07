'use client';
import { useState } from 'react';
import dayjs, { type Dayjs } from 'dayjs';
import 'dayjs/locale/ko';
import DatePickerHeader from './DatePickerHeader';

dayjs.locale('ko');

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

interface MonthSelectorProps {
  initialDate?: Dayjs;
  onChangeDate?: (date: Dayjs) => void;
}

export default function MonthSelector({ initialDate = dayjs(), onChangeDate }: MonthSelectorProps) {
  const [currentDate, setCurrentDate] = useState(initialDate);
  const [selectedDate, setSelectedDate] = useState(initialDate);

  const handleNext = () => {
    const next = currentDate.add(1, 'month');
    setCurrentDate(next);
  };

  const handlePrev = () => {
    const prev = currentDate.subtract(1, 'month');
    setCurrentDate(prev);
  };

  const handleSelectDate = (date: Dayjs) => {
    setSelectedDate(date);
    if (date.month() !== currentDate.month()) {
      setCurrentDate(date);
    }
    onChangeDate?.(date);
  };

  // 6주(6 x 7 = 42일) 완전 고정 그리드 날짜 계산
  const startOfCalendar = currentDate.startOf('month').startOf('week');
  const calendarDays = Array.from({ length: 42 }, (_, i) => {
    const date = startOfCalendar.add(i, 'day');
    const isCurrentMonth = date.month() === currentDate.month();
    const isSelected = date.isSame(selectedDate, 'day');

    return {
      date,
      dayNumber: date.date(),
      isCurrentMonth,
      isSelected,
    };
  });

  return (
    <div className="border-line-normal-normal flex w-[320px] flex-col items-center justify-center gap-5 rounded-md border px-5 pt-6 pb-5">
      <DatePickerHeader
        type="month"
        year={currentDate.year()}
        month={currentDate.month() + 1}
        next={handleNext}
        prev={handlePrev}
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
          {calendarDays.map(({ date, dayNumber, isCurrentMonth, isSelected }, idx) => {
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectDate(date)}
                className={`text-body-1-normal mx-auto flex h-9 w-9 items-center justify-center gap-1 rounded-md border-2 p-1.5 font-features-['ss10'] ${
                  isSelected
                    ? 'border-primary-subtle bg-primary-subtle text-primary-heavy font-semibold'
                    : isCurrentMonth
                      ? 'text-label-neutral hover:bg-periwinkle-50 hover:text-label-normal border-transparent'
                      : 'text-label-alternative/30 hover:bg-periwinkle-50/50 hover:text-label-neutral border-transparent'
                }`}
              >
                {dayNumber}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
