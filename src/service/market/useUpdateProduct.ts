import { useMutation, useQueryClient } from '@tanstack/react-query';
import { snackbar } from '@/components';
import { MARKET_MESSAGES } from '@/constants/market';
import { fetchApi } from '@/service/api';
import type { MarketItem, UpdateMarketItemInput } from '@/types/market/types';
import { parseMarketError } from './marketError';
import { marketKeys } from './marketKeys';

interface IUseUpdateProductOptions {
  onSuccess?: (updated: MarketItem) => void;
  onError?: (message: string) => void;
}

export function useUpdateProduct(options?: IUseUpdateProductOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ itemId, request, image }: UpdateMarketItemInput) => {
      const body = new FormData();
      const payload: Record<string, unknown> = {};

      if (request.name !== undefined) payload.name = request.name.trim();
      if (request.price !== undefined) payload.price = request.price;
      if (request.description !== undefined) payload.description = request.description;
      if (request.purchaseMessage !== undefined) {
        payload.purchaseMessage =
          request.purchaseMessage === null ? null : request.purchaseMessage.trim() || null;
      }

      body.append('request', new Blob([JSON.stringify(payload)], { type: 'application/json' }));
      if (image) {
        body.append('image', image);
      }

      const response = await fetchApi<{ data: MarketItem }>(`/api/v1/market/items/${itemId}`, {
        method: 'PATCH',
        data: body,
      });
      return response.data.data;
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(marketKeys.detail(updated.itemId), updated);
      void queryClient.invalidateQueries({ queryKey: marketKeys.all });
      snackbar(MARKET_MESSAGES.toast.updateSuccess, { message: true, position: 'bottom-center' });
      options?.onSuccess?.(updated);
    },
    onError: (mutationError) => {
      const { message } = parseMarketError(mutationError);
      options?.onError?.(message);
      snackbar(message, { message: false, position: 'bottom-center' });
    },
  });
}
