import { useQuery } from '@tanstack/react-query';
import { fetchMarketItems } from '@/service/market';
import type { MarketItemsParams } from '@/types/market/types';

export function useGetProduct(params: MarketItemsParams = {}) {
  return useQuery({
    queryKey: ['marketItems', params],
    queryFn: () => fetchMarketItems(params),
  });
}
