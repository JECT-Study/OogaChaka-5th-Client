import { useMutation, useQueryClient } from '@tanstack/react-query';
import { snackbar } from '@/components';
import { fetchApi } from '@/service/api';
import type { MarketPurchase, PurchaseMarketItemInput } from '@/types/market/types';
import { parseMarketError } from './marketError';
import { marketKeys } from './marketKeys';

interface IUsePurchaseProductOptions {
  onSuccess?: (purchase: MarketPurchase) => void;
}

export function usePurchaseProduct(options?: IUsePurchaseProductOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      itemId,
      expectedPrice,
      idempotencyKey = crypto.randomUUID(),
    }: PurchaseMarketItemInput) => {
      const response = await fetchApi<{ data: MarketPurchase }>(
        `/api/v1/market/items/${itemId}/purchases`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Idempotency-Key': idempotencyKey,
          },
          data: { expectedPrice },
        },
      );
      return response.data.data;
    },
    onSuccess: (purchase) => {
      void queryClient.invalidateQueries({ queryKey: marketKeys.all });
      options?.onSuccess?.(purchase);
    },
    onError: (mutationError, variables) => {
      const { code, message } = parseMarketError(mutationError);
      if (code === 'PRICE_CHANGED' || code === 'ITEM_NOT_FOR_SALE') {
        void queryClient.invalidateQueries({ queryKey: marketKeys.detail(variables.itemId) });
        void queryClient.invalidateQueries({ queryKey: marketKeys.all });
      }
      snackbar(message, { message: false, position: 'bottom-center' });
    },
  });
}
