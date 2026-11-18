import { fetchApi } from './api';
import type {
  CreateMarketItemInput,
  MarketItem,
  MarketItemsPage,
  MarketItemsParams,
} from '@/types/market/types';

export async function fetchMarketItems(params: MarketItemsParams = {}): Promise<MarketItemsPage> {
  const response = await fetchApi<{ data: MarketItemsPage }>('/api/v1/market/items', {
    method: 'GET',
    params,
  });
  return response.data.data;
}

export async function createMarketItem({
  request,
  image,
}: CreateMarketItemInput): Promise<MarketItem> {
  const body = new FormData();
  body.append(
    'request',
    new Blob([JSON.stringify({ ...request, name: request.name.trim() })], {
      type: 'application/json',
    }),
  );
  body.append('image', image);
  const response = await fetchApi<{ data: MarketItem }>('/api/v1/market/items', {
    method: 'POST',
    data: body,
  });
  return response.data.data;
}
