import type { Dayjs } from 'dayjs';

export const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'] as const;

export interface IDatePickerProps {
  type?: 'month' | 'week';
  initialDate?: Dayjs;
  onChangeDate?: (date: Dayjs) => void;
}

export interface IDatePickerHeaderProps {
  type: 'month' | 'week';
  month: number;
  year?: number;
  next: () => void;
  prev: () => void;
  className?: string;
}

export interface IWeekSelectorProps {
  initialDate?: Dayjs;
  onChangeDate?: (date: Dayjs) => void;
}

export interface IMonthSelectorProps {
  initialDate?: Dayjs;
  onChangeDate?: (date: Dayjs) => void;
}

export interface IDateState {
  viewDate: Dayjs;
  selectedDate: Dayjs;
}
