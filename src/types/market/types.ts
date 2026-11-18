export type CreateMarketItemRequest = {
  name: string;
  price: number;
  description?: string | null;
  purchaseMessage?: string | null;
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
