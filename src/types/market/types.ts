export type CreateMarketItemRequest = {
  name: string;
  price: number;
  description?: string | null;
  purchaseMessage?: string | null;
};

export type UpdateMarketItemRequest = {
  name?: string;
  price?: number;
  description?: string | null;
  purchaseMessage?: string | null;
  isActive?: boolean;
};

export type MarketItem = {
  itemId: number;
  name: string;
  description: string | null;
  imageUrl: string;
  price: number;
  purchaseMessage: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
};

export type MarketItemsPage = {
  items: MarketItem[];
  page: number;
  size: number;
  totalElements: number;
};

export type MarketItemsParams = {
  page?: number;
  size?: number;
  isActive?: boolean;
};

export type CreateMarketItemInput = {
  request: CreateMarketItemRequest;
  image: File;
};

export type UpdateMarketItemInput = {
  itemId: number;
  request: UpdateMarketItemRequest;
  image?: File;
};

export type MarketOrderStatus = 'PENDING' | 'FULFILLED';

export type PurchaseMarketItemInput = {
  itemId: number;
  expectedPrice: number;
  idempotencyKey?: string;
};

export type MarketPurchase = {
  orderId: number;
  itemId: number;
  productName: string;
  productImageUrl: string;
  spentPoints: number;
  remainingPoints: number;
  status: MarketOrderStatus;
  purchaseMessage: string | null;
  purchasedAt: string;
  fulfilledAt: string | null;
};

export type MarketApiErrorCode =
  | 'INVALID_QUERY_PARAMETER'
  | 'INVALID_ITEM_ID'
  | 'INVALID_PRODUCT_REQUEST'
  | 'INVALID_PURCHASE_REQUEST'
  | 'INVALID_IMAGE'
  | 'IMAGE_TOO_LARGE'
  | 'UNSUPPORTED_MEDIA_TYPE'
  | 'MARKET_ITEM_NOT_FOUND'
  | 'ITEM_NOT_FOR_SALE'
  | 'PRICE_CHANGED'
  | 'INSUFFICIENT_POINTS'
  | 'IDEMPOTENCY_KEY_CONFLICT'
  | 'MAX_ITEMS_EXCEEDED'
  | 'UNAUTHENTICATED'
  | 'FORBIDDEN'
  | 'INTERNAL_SERVER_ERROR';

export type MarketProblemDetail = {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  code?: MarketApiErrorCode | string;
};

export const MARKET_CONSTRAINTS = {
  MAX_ITEMS: 12,
  NAME_MAX_LENGTH: 64,
  PRICE_MIN: 1,
  PRICE_MAX: 2_147_483_647,
  PURCHASE_MESSAGE_MAX_LENGTH: 255,
  IMAGE_MAX_BYTES: 5 * 1024 * 1024, // 5 MiB
  IMAGE_ACCEPTED_MIME_TYPES: ['image/jpeg', 'image/png', 'image/webp'] as const,
} as const;
