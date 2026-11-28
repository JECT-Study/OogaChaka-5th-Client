import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '@/service/api';
import type { MarketItem, MarketItemsPage, MarketItemsParams } from '@/types/market/types';
import { marketKeys } from './marketKeys';

export function useGetProduct(params: MarketItemsParams = {}) {
  const { page = 0, size = 20, isActive = true } = params;

  return useQuery({
    queryKey: marketKeys.list({ page, size, isActive }),
    queryFn: async () => {
      const response = await fetchApi<{ data: MarketItemsPage }>('/api/v1/market/items', {
        method: 'GET',
        headers: { Accept: 'application/json' },
        params: { page, size, isActive },
      });
      return response.data.data;
    },
  });
}

export function useGetProductDetail(itemId: number | null) {
  return useQuery({
    queryKey: itemId !== null ? marketKeys.detail(itemId) : ['marketItem', 'invalid'],
    queryFn: async () => {
      const response = await fetchApi<{ data: MarketItem }>(`/api/v1/market/items/${itemId}`, {
        method: 'GET',
      });
      return response.data.data;
    },
    enabled: itemId !== null && Number.isInteger(itemId) && itemId >= 1,
    retry: false,
  });
}
