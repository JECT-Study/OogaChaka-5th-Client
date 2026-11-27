import { useMutation, useQueryClient } from '@tanstack/react-query';
import { snackbar } from '@/components';
import { MARKET_MESSAGES } from '@/constants/market';
import { fetchApi } from '@/service/api';
import type { CreateMarketItemInput, MarketItem } from '@/types/market/types';
import { parseMarketError } from './marketError';
import { marketKeys } from './marketKeys';

interface IUseCreateProductOptions {
  onSuccess?: (created: MarketItem) => void;
  onMaxItemsExceeded?: () => void;
  onError?: (message: string) => void;
}

export function useCreateProduct(options?: IUseCreateProductOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ request, image }: CreateMarketItemInput) => {
      const body = new FormData();
      const normalized = {
        name: request.name.trim(),
        price: request.price,
        description: request.description ?? null,
        purchaseMessage: request.purchaseMessage?.trim() || null,
      };
      body.append('request', new Blob([JSON.stringify(normalized)], { type: 'application/json' }));
      body.append('image', image);

      const response = await fetchApi<{ data: MarketItem }>('/api/v1/market/items', {
        method: 'POST',
        data: body,
      });
      return response.data.data;
    },
    onSuccess: (created) => {
      queryClient.setQueryData(marketKeys.detail(created.itemId), created);
      void queryClient.invalidateQueries({ queryKey: marketKeys.all });
      snackbar(MARKET_MESSAGES.toast.createSuccess, { message: true, position: 'bottom-center' });
      options?.onSuccess?.(created);
    },
    onError: (mutationError) => {
      const { code, message } = parseMarketError(mutationError);
      if (code === 'MAX_ITEMS_EXCEEDED' && options?.onMaxItemsExceeded) {
        options.onMaxItemsExceeded();
        return;
      }
      options?.onError?.(message);
      snackbar(message, { message: false, position: 'bottom-center' });
    },
  });
}
