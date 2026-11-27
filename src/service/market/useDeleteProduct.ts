import { useMutation, useQueryClient } from '@tanstack/react-query';
import { snackbar } from '@/components';
import { MARKET_MESSAGES } from '@/constants/market';
import { fetchApi } from '@/service/api';
import type { MarketItemsPage } from '@/types/market/types';
import { parseMarketError } from './marketError';
import { marketKeys } from './marketKeys';

interface IUseDeleteProductOptions {
  onSuccess?: () => void;
}

export function useDeleteProduct(options?: IUseDeleteProductOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemId: number) => {
      await fetchApi(`/api/v1/market/items/${itemId}`, {
        method: 'DELETE',
      });
    },
    onSuccess: (_, itemId) => {
      // 재조회를 기다리지 않고 목록에서 바로 빼서, 모달이 닫힐 때 삭제된 상품이 잠깐 남아 보이지 않게 한다.
      queryClient.setQueriesData<MarketItemsPage>({ queryKey: marketKeys.all }, (prev) =>
        prev
          ? {
              ...prev,
              items: prev.items.filter((item) => item.itemId !== itemId),
              totalElements: Math.max(0, prev.totalElements - 1),
            }
          : prev,
      );
      queryClient.removeQueries({ queryKey: marketKeys.detail(itemId) });
      void queryClient.invalidateQueries({ queryKey: marketKeys.all });
      snackbar(MARKET_MESSAGES.toast.deleteSuccess, { message: true, position: 'bottom-center' });
      options?.onSuccess?.();
    },
    onError: (mutationError) => {
      const { message } = parseMarketError(mutationError);
      snackbar(message, { message: false, position: 'bottom-center' });
    },
  });
}
