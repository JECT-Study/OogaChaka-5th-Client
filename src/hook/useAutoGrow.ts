import { useEffect, type RefObject } from 'react';

export function useAutoGrow(
  ref: RefObject<HTMLTextAreaElement | null>,
  text: string,
  { enabled = true, maxHeight }: { enabled?: boolean; maxHeight: number },
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!enabled) {
      el.style.height = '';
      return;
    }
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`;
  }, [ref, text, enabled, maxHeight]);
}
