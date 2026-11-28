import axios from 'axios';
import type { MarketProblemDetail } from '@/types/market/types';

const ERROR_MESSAGES: Record<string, string> = {
  INVALID_QUERY_PARAMETER: '페이지 범위 또는 조회 조건이 올바르지 않아요.',
  INVALID_ITEM_ID: '유효하지 않은 상품 정보예요.',
  INVALID_PRODUCT_REQUEST: '입력한 상품 정보를 다시 확인해 주세요.',
  INVALID_PURCHASE_REQUEST: '구매 요청 정보가 올바르지 않아요.',
  INVALID_IMAGE: '올바른 이미지 파일이 아니에요. 다른 사진을 선택해 주세요.',
  IMAGE_TOO_LARGE: '사진 용량은 최대 5MB까지 업로드할 수 있어요.',
  UNSUPPORTED_MEDIA_TYPE: 'JPEG, PNG, WebP 형식의 사진만 업로드할 수 있어요.',
  MARKET_ITEM_NOT_FOUND: '상품을 찾을 수 없어요.',
  ITEM_NOT_FOR_SALE: '현재 판매 중지된 상품이에요.',
  PRICE_CHANGED: '상품 가격이 변경되었어요. 가격을 다시 확인해 주세요.',
  INSUFFICIENT_POINTS: '포인트가 부족해서 구매할 수 없어요...!',
  IDEMPOTENCY_KEY_CONFLICT: '이미 처리된 구매 요청이에요. 다시 시도해 주세요.',
  MAX_ITEMS_EXCEEDED:
    '상품은 최대 12개까지 등록할 수 있어요. 기존 상품을 삭제한 뒤 다시 시도해 주세요.',
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
