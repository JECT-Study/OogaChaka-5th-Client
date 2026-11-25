import axios from 'axios';
import { fetchApi } from './api';
import type {
  CreateMarketItemInput,
  MarketItem,
  MarketItemsPage,
  MarketItemsParams,
  MarketProblemDetail,
  UpdateMarketItemInput,
} from '@/types/market/types';

export async function fetchMarketItems(params: MarketItemsParams = {}): Promise<MarketItemsPage> {
  const response = await fetchApi<{ data: MarketItemsPage }>('/api/v1/market/items', {
    method: 'GET',
    params,
  });
  return response.data.data;
}

export async function fetchMarketItemDetail(itemId: number): Promise<MarketItem> {
  const response = await fetchApi<{ data: MarketItem }>(`/api/v1/market/items/${itemId}`, {
    method: 'GET',
  });
  return response.data.data;
}

export async function createMarketItem({
  request,
  image,
}: CreateMarketItemInput): Promise<MarketItem> {
  const body = new FormData();
  const normalized = {
    name: request.name.trim(),
    price: request.price,
    description: request.description ?? null,
    purchaseMessage: request.purchaseMessage?.trim() || null,
  };
  body.append(
    'request',
    new Blob([JSON.stringify(normalized)], {
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

export async function updateMarketItem({
  itemId,
  request,
  image,
}: UpdateMarketItemInput): Promise<MarketItem> {
  const body = new FormData();
  const payload: Record<string, unknown> = {};

  if (request.name !== undefined) payload.name = request.name.trim();
  if (request.price !== undefined) payload.price = request.price;
  if (request.description !== undefined) payload.description = request.description;
  if (request.purchaseMessage !== undefined) {
    payload.purchaseMessage =
      request.purchaseMessage === null ? null : request.purchaseMessage.trim() || null;
  }

  body.append(
    'request',
    new Blob([JSON.stringify(payload)], {
      type: 'application/json',
    }),
  );
  if (image) {
    body.append('image', image);
  }

  const response = await fetchApi<{ data: MarketItem }>(`/api/v1/market/items/${itemId}`, {
    method: 'PATCH',
    data: body,
  });
  return response.data.data;
}

// [삭제 기능 보류]
// export async function deleteMarketItem(itemId: number): Promise<void> {
  // await fetchApi(`/api/v1/market/items/${itemId}`, {
    // method: 'DELETE',
  // });
// }

const ERROR_MESSAGES: Record<string, string> = {
  INVALID_ITEM_ID: '유효하지 않은 상품 정보예요.',
  INVALID_PRODUCT_REQUEST: '입력한 상품 정보를 다시 확인해 주세요.',
  INVALID_IMAGE: '올바른 이미지 파일이 아니에요. 다른 사진을 선택해 주세요.',
  IMAGE_TOO_LARGE: '사진 용량은 최대 5MB까지 업로드할 수 있어요.',
  UNSUPPORTED_MEDIA_TYPE: 'JPEG, PNG, WebP 형식의 사진만 업로드할 수 있어요.',
  MARKET_ITEM_NOT_FOUND: '상품을 찾을 수 없어요.',
  MAX_ITEMS_EXCEEDED: '상품은 최대 12개까지 등록할 수 있어요. 기존 상품을 삭제한 뒤 다시 시도해 주세요.',
  UNAUTHENTICATED: '로그인이 필요해요. 다시 로그인해 주세요.',
  FORBIDDEN: '이 상품에 접근할 권한이 없어요.',
  INTERNAL_SERVER_ERROR: '서버에 일시적인 오류가 발생했어요. 잠시 후 다시 시도해 주세요.',
};

export function parseMarketError(error: unknown): {
  status?: number;
  code?: string;
  message: string;
} {
  if (axios.isAxiosError<MarketProblemDetail>(error)) {
    const problem = error.response?.data;
    const status = problem?.status ?? error.response?.status;
    const code = problem?.code;
    const message =
      (code && ERROR_MESSAGES[code]) ||
      problem?.detail ||
      '요청을 처리하지 못했어요. 잠시 후 다시 시도해 주세요.';
    return { status, code, message };
  }
  return {
    message: '네트워크 오류가 발생했어요. 연결 상태를 확인한 뒤 다시 시도해 주세요.',
  };
}
