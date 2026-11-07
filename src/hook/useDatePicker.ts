import { useCallback, useState } from 'react';
import dayjs, { type Dayjs } from 'dayjs';
import 'dayjs/locale/ko';
import type { IDateState } from '@/types/date-picker';

dayjs.locale('ko');

interface UseDatePickerOptions {
  type: 'month' | 'week';
  initialDate?: Dayjs;
  onChangeDate?: (date: Dayjs) => void;
}

export function useDatePicker({ type, initialDate = dayjs(), onChangeDate }: UseDatePickerOptions) {
  const [{ viewDate, selectedDate }, setDateState] = useState<IDateState>({
    viewDate: initialDate,
    selectedDate: initialDate,
  });

  const next = useCallback(() => {
    setDateState((prev) => {
      const nextView = prev.viewDate.add(1, type);
      const nextSelected = nextView.startOf(type);
      onChangeDate?.(nextSelected);
      return { viewDate: nextView, selectedDate: nextSelected };
    });
  }, [type, onChangeDate]);

  const prev = useCallback(() => {
    setDateState((prev) => {
      const prevView = prev.viewDate.subtract(1, type);
      const prevSelected = prevView.startOf(type);
      onChangeDate?.(prevSelected);
      return { viewDate: prevView, selectedDate: prevSelected };
    });
  }, [type, onChangeDate]);

  const selectDate = useCallback(
    (date: Dayjs) => {
      setDateState({ viewDate: date, selectedDate: date });
      onChangeDate?.(date);
    },
    [onChangeDate],
  );

  return {
    viewDate,
    selectedDate,
    next,
    prev,
    selectDate,
  };
}
