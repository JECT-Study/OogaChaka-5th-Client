import { http, HttpResponse } from 'msw';
import type { MarketItem } from '@/types/market/types';

const items: MarketItem[] = Array.from({ length: 6 }, (_, i) => ({
  itemId: 6 - i,
  name: '상품 쿠폰',
  description: null,
  imageUrl: '/images/market-reward.png',
  price: 400,
  purchaseMessage: null,
  isActive: true,
  createdAt: '2026-10-29T13:00:00Z',
  updatedAt: null,
}));

export const marketHandlers = [
  http.get('*/api/v1/market/items', ({ request }) => {
    const url = new URL(request.url);
    const problem = (status: number, code: string, title: string, detail: string) =>
      HttpResponse.json(
        { type: 'about:blank', title, status, detail, instance: url.pathname, code },
        { status, headers: { 'Content-Type': 'application/problem+json' } },
      );

    const pageValue = url.searchParams.get('page') ?? '0';
    const sizeValue = url.searchParams.get('size') ?? '20';
    const activeValue = url.searchParams.get('isActive') ?? 'true';
    const page = Number(pageValue);
    const size = Number(sizeValue);
    if (
      !/^\d+$/.test(pageValue) ||
      !/^\d+$/.test(sizeValue) ||
      !Number.isSafeInteger(page) ||
      !Number.isSafeInteger(size) ||
      size < 1 ||
      size > 100 ||
      !['true', 'false'].includes(activeValue)
    ) {
      return problem(
        400,
        'INVALID_QUERY_PARAMETER',
        'Bad Request',
        '조회 조건이 유효하지 않습니다.',
      );
    }

    const filtered = items.filter((item) => item.isActive === (activeValue === 'true'));
    return HttpResponse.json({
      data: {
        items: filtered.slice(page * size, (page + 1) * size),
        page,
        size,
        totalElements: filtered.length,
      },
    });
  }),
];
