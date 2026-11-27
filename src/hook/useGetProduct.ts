import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { snackbar } from '@/components';
import { MARKET_MESSAGES } from '@/constants/market';
import {
  createMarketItem,
  deleteMarketItem,
  fetchMarketItemDetail,
  fetchMarketItems,
  parseMarketError,
  updateMarketItem,
} from '@/service/market';
import type {
  CreateMarketItemInput,
  MarketItemsPage,
  MarketItemsParams,
  UpdateMarketItemInput,
} from '@/types/market/types';

export const marketKeys = {
  all: ['marketItems'] as const,
  list: (params: MarketItemsParams = {}) => ['marketItems', params] as const,
  detail: (itemId: number) => ['marketItem', itemId] as const,
};

export function useGetProduct(params: MarketItemsParams = {}) {
  return useQuery({
    queryKey: marketKeys.list(params),
    queryFn: () => fetchMarketItems(params),
  });
}

export function useGetProductDetail(itemId: number | null) {
  return useQuery({
    queryKey: itemId !== null ? marketKeys.detail(itemId) : ['marketItem', 'invalid'],
    queryFn: () => fetchMarketItemDetail(itemId as number),
    enabled: itemId !== null && Number.isInteger(itemId) && itemId >= 1,
    retry: false,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateMarketItemInput) => createMarketItem(input),
    onSuccess: (created) => {
      queryClient.setQueryData(marketKeys.detail(created.itemId), created);
      void queryClient.invalidateQueries({ queryKey: marketKeys.all });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateMarketItemInput) => updateMarketItem(input),
    onSuccess: (updated) => {
      queryClient.setQueryData(marketKeys.detail(updated.itemId), updated);
      void queryClient.invalidateQueries({ queryKey: marketKeys.all });
    },
  });
}

type UseDeleteProductOptions = {
  onSuccess?: () => void;
};

export function useDeleteProduct(options?: UseDeleteProductOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: number) => deleteMarketItem(itemId),
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
