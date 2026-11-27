import type { MarketItemsParams } from '@/types/market/types';

export const marketKeys = {
  all: ['marketItems'] as const,
  list: (params: MarketItemsParams = {}) => ['marketItems', params] as const,
  detail: (itemId: number) => ['marketItem', itemId] as const,
};
