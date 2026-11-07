import type { Dayjs } from 'dayjs';

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
}

export interface IWeekSelectorProps {
  initialDate?: Dayjs;
  onChangeDate?: (date: Dayjs) => void;
}

export interface IMonthSelectorProps {
  initialDate?: Dayjs;
  onChangeDate?: (date: Dayjs) => void;
}

