import { useState } from 'react';

type Value = string | number | readonly string[] | undefined;

export function useCharCount({ value, defaultValue }: { value?: Value; defaultValue?: Value }) {
  const [innerValue, setInnerValue] = useState(() => String(defaultValue ?? ''));
  const isControlled = value !== undefined;
  const text = isControlled ? String(value) : innerValue;

  const track = (next: string) => {
    if (!isControlled) setInnerValue(next);
  };

  return { text, count: text.length, track };
}
