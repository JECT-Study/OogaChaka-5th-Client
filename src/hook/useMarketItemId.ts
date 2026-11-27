'use client';

import { useSearchParams } from 'next/navigation';

export function useMarketItemId(): number | null {
  const searchParams = useSearchParams();
  const raw = searchParams.get('itemId');
  if (!raw || !/^\d+$/.test(raw)) return null;
  const parsed = Number(raw);
  return Number.isSafeInteger(parsed) && parsed >= 1 ? parsed : null;
}
