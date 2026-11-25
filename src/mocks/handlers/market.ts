import { http, HttpResponse } from 'msw';
import {
  MARKET_CONSTRAINTS,
  type CreateMarketItemRequest,
  type MarketItem,
  type UpdateMarketItemRequest,
} from '@/types/market/types';

let nextItemId = 14;

const items: MarketItem[] = [
  {
    itemId: 13,
    name: '영화관 데이트',
    description: null,
    imageUrl: '/images/market-reward.png',
    price: 2000,
    purchaseMessage: '보고 싶은 영화 골라 봐!',
    createdAt: '2026-11-05T13:00:00Z',
    updatedAt: null,
  },
  {
    itemId: 12,
    name: '게임 시간 30분',
    description: null,
    imageUrl: '/images/market-reward.png',
    price: 800,
    purchaseMessage: '숙제 끝내고 신나게 하자!',
    createdAt: '2026-11-04T13:00:00Z',
    updatedAt: null,
  },
  {
    itemId: 11,
    name: '치킨 파티',
    description: null,
    imageUrl: '/images/market-reward.png',
    price: 1500,
    purchaseMessage: '오늘 저녁은 치킨이다!',
    createdAt: '2026-11-03T13:00:00Z',
    updatedAt: null,
  },
  {
    itemId: 10,
    name: '늦잠 자기 쿠폰',
    description: null,
    imageUrl: '/images/market-reward.png',
    price: 700,
    purchaseMessage: null,
    createdAt: '2026-11-02T13:00:00Z',
    updatedAt: null,
  },
  {
    itemId: 9,
    name: '원하는 책 한 권',
    description: null,
    imageUrl: '/images/market-reward.png',
    price: 1000,
    purchaseMessage: '읽고 싶은 책 마음껏 골라!',
    createdAt: '2026-11-01T13:00:00Z',
    updatedAt: null,
  },
  {
    itemId: 8,
    name: '공원 자전거 타기',
    description: null,
    imageUrl: '/images/market-reward.png',
    price: 600,
    purchaseMessage: '주말에 같이 달리자!',
    createdAt: '2026-10-31T13:00:00Z',
    updatedAt: null,
  },
  {
    itemId: 7,
    name: '편의점 간식 쿠폰',
    description: null,
    imageUrl: '/images/market-reward.png',
    price: 350,
    purchaseMessage: '고생했어, 맛있는 거 먹자!',
    createdAt: '2026-10-30T13:00:00Z',
    updatedAt: null,
  },
  {
    itemId: 6,
    name: '떡볶이 쿠폰',
    description: '주말에 함께 먹는 떡볶이',
    imageUrl: '/images/market-reward.png',
    price: 500,
    purchaseMessage: '꾸준히 해내서 멋져!',
    createdAt: '2026-10-29T13:00:00Z',
    updatedAt: null,
  },
  {
    itemId: 5,
    name: '놀이공원 데이트',
    description: null,
    imageUrl: '/images/market-reward.png',
    price: 1200,
    purchaseMessage: '이번 주말에 같이 가자!',
    createdAt: '2026-10-28T13:00:00Z',
    updatedAt: null,
  },
  {
    itemId: 4,
    name: '용돈 5,000원 쿠폰',
    description: null,
    imageUrl: '/images/market-reward.png',
    price: 400,
    purchaseMessage: '열심히 모았구나!',
    createdAt: '2026-10-27T13:00:00Z',
    updatedAt: null,
  },
  {
    itemId: 3,
    name: '아이스크림 쿠폰',
    description: null,
    imageUrl: '/images/market-reward.png',
    price: 300,
    purchaseMessage: null,
    createdAt: '2026-10-26T13:00:00Z',
    updatedAt: null,
  },
  {
    itemId: 2,
    name: '보드게임 1시간',
    description: null,
    imageUrl: '/images/market-reward.png',
    price: 600,
    purchaseMessage: '같이 즐겁게 놀자!',
    createdAt: '2026-10-25T13:00:00Z',
    updatedAt: '2026-10-26T09:00:00Z',
  },
];

function problemResponse(
  pathname: string,
  status: number,
  code: string,
  title: string,
  detail: string,
) {
  return HttpResponse.json(
    { type: 'about:blank', title, status, detail, instance: pathname, code },
    { status, headers: { 'Content-Type': 'application/problem+json' } },
  );
}

function parseItemId(raw: string | readonly string[] | undefined): number | null {
  if (typeof raw !== 'string' || !/^\d+$/.test(raw)) return null;
  const id = Number(raw);
  if (!Number.isSafeInteger(id) || id < 1) return null;
  return id;
}

async function readJsonPart<T>(entry: FormDataEntryValue | null): Promise<T | null> {
  if (!entry) return null;
  try {
    const raw = typeof entry === 'string' ? entry : await entry.text();
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

async function fileToDataUrl(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = btoa(binary);
  return `data:${file.type};base64,${base64}`;
}

function validateImageFile(pathname: string, image: FormDataEntryValue | null) {
  if (!(image instanceof File) || image.size === 0) {
    return problemResponse(
      pathname,
      400,
      'INVALID_IMAGE',
      'Bad Request',
      '이미지를 디코딩할 수 없거나 유효한 이미지가 아님',
    );
  }
  if (image.size > MARKET_CONSTRAINTS.IMAGE_MAX_BYTES) {
    return problemResponse(
      pathname,
      413,
      'IMAGE_TOO_LARGE',
      'Payload Too Large',
      '제안한 5 MiB 업로드 상한을 초과함',
    );
  }
  const accepted: readonly string[] = MARKET_CONSTRAINTS.IMAGE_ACCEPTED_MIME_TYPES;
  if (!accepted.includes(image.type)) {
    return problemResponse(
      pathname,
      415,
      'UNSUPPORTED_MEDIA_TYPE',
      'Unsupported Media Type',
      'multipart 파트 또는 이미지 형식이 지원되지 않음',
    );
  }
  return null;
}

export const marketHandlers = [
  http.get('*/api/v1/market/items', ({ request }) => {
    const url = new URL(request.url);
    const pageValue = url.searchParams.get('page') ?? '0';
    const sizeValue = url.searchParams.get('size') ?? '20';
    const page = Number(pageValue);
    const size = Number(sizeValue);

    if (
      !/^\d+$/.test(pageValue) ||
      !/^\d+$/.test(sizeValue) ||
      !Number.isSafeInteger(page) ||
      !Number.isSafeInteger(size) ||
      size < 1 ||
      size > 100
    ) {
      return problemResponse(
        url.pathname,
        400,
        'INVALID_QUERY_PARAMETER',
        'Bad Request',
        '조회 조건이 유효하지 않습니다.',
      );
    }

    return HttpResponse.json({
      data: {
        items: items.slice(page * size, (page + 1) * size),
        page,
        size,
        totalElements: items.length,
      },
    });
  }),

  http.get('*/api/v1/market/items/:id', ({ request, params }) => {
    const url = new URL(request.url);
    const itemId = parseItemId(params.id);
    if (itemId === null) {
      return problemResponse(
        url.pathname,
        400,
        'INVALID_ITEM_ID',
        'Bad Request',
        'id가 1 이상의 정수가 아님',
      );
    }

    const found = items.find((item) => item.itemId === itemId);
    if (!found) {
      return problemResponse(
        url.pathname,
        404,
        'MARKET_ITEM_NOT_FOUND',
        'Not Found',
        '해당 상품이 없음',
      );
    }

    return HttpResponse.json({ data: found });
  }),

  http.post('*/api/v1/market/items', async ({ request }) => {
    const url = new URL(request.url);
    if (items.length >= MARKET_CONSTRAINTS.MAX_ITEMS) {
      return problemResponse(
        url.pathname,
        400,
        'MAX_ITEMS_EXCEEDED',
        'Bad Request',
        '상품은 최대 12개까지 등록할 수 있습니다.',
      );
    }

    const formData = await request.formData();
    const payload = await readJsonPart<CreateMarketItemRequest>(formData.get('request'));
    const image = formData.get('image');

    if (!payload || !image) {
      return problemResponse(
        url.pathname,
        400,
        'INVALID_PRODUCT_REQUEST',
        'Bad Request',
        '이름·가격이 유효하지 않거나 필수 이미지/request 파트가 누락됨',
      );
    }

    const trimmedName = typeof payload.name === 'string' ? payload.name.trim() : '';
    const price = payload.price;
    const purchaseMessage = payload.purchaseMessage ?? null;

    if (
      trimmedName.length < 1 ||
      trimmedName.length > MARKET_CONSTRAINTS.NAME_MAX_LENGTH ||
      typeof price !== 'number' ||
      !Number.isInteger(price) ||
      price < MARKET_CONSTRAINTS.PRICE_MIN ||
      price > MARKET_CONSTRAINTS.PRICE_MAX ||
      (purchaseMessage !== null &&
        purchaseMessage.length > MARKET_CONSTRAINTS.PURCHASE_MESSAGE_MAX_LENGTH)
    ) {
      return problemResponse(
        url.pathname,
        400,
        'INVALID_PRODUCT_REQUEST',
        'Bad Request',
        '이름·가격이 유효하지 않거나 필수 이미지/request 파트가 누락됨',
      );
    }

    const imageError = validateImageFile(url.pathname, image);
    if (imageError) return imageError;

    const imageUrl = await fileToDataUrl(image as File);
    const created: MarketItem = {
      itemId: nextItemId++,
      name: trimmedName,
      description: payload.description ?? null,
      imageUrl,
      price,
      purchaseMessage,
        createdAt: new Date().toISOString(),
      updatedAt: null,
    };
    items.unshift(created);

    return HttpResponse.json(
      { data: created },
      {
        status: 201,
        headers: { Location: `/api/v1/market/items/${created.itemId}` },
      },
    );
  }),

  http.patch('*/api/v1/market/items/:id', async ({ request, params }) => {
    const url = new URL(request.url);
    const itemId = parseItemId(params.id);
    if (itemId === null) {
      return problemResponse(
        url.pathname,
        400,
        'INVALID_ITEM_ID',
        'Bad Request',
        'id가 1 이상의 정수가 아님',
      );
    }

    const index = items.findIndex((item) => item.itemId === itemId);
    if (index === -1) {
      return problemResponse(
        url.pathname,
        404,
        'MARKET_ITEM_NOT_FOUND',
        'Not Found',
        '해당 상품이 없음',
      );
    }

    const formData = await request.formData();
    const payload = await readJsonPart<UpdateMarketItemRequest>(formData.get('request'));
    const image = formData.get('image');

    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
      return problemResponse(
        url.pathname,
        400,
        'INVALID_PRODUCT_REQUEST',
        'Bad Request',
        '필드 누락·금지된 null·이름/가격 범위 위반 또는 실질적인 수정 내용이 없음',
      );
    }

    const supportedKeys = ['name', 'price', 'description', 'purchaseMessage'] as const;
    const providedKeys = Object.keys(payload).filter((key) =>
      (supportedKeys as readonly string[]).includes(key),
    );

    if (providedKeys.length === 0 && !image) {
      return problemResponse(
        url.pathname,
        400,
        'INVALID_PRODUCT_REQUEST',
        'Bad Request',
        '필드 누락·금지된 null·이름/가격 범위 위반 또는 실질적인 수정 내용이 없음',
      );
    }

    const current = items[index];
    let nextName = current.name;
    let nextPrice = current.price;
    let nextDescription = current.description;
    let nextPurchaseMessage = current.purchaseMessage;
    let nextImageUrl = current.imageUrl;

    if ('name' in payload) {
      if (typeof payload.name !== 'string') {
        return problemResponse(
          url.pathname,
          400,
          'INVALID_PRODUCT_REQUEST',
          'Bad Request',
          '상품명은 null일 수 없습니다.',
        );
      }
      const trimmed = payload.name.trim();
      if (trimmed.length < 1 || trimmed.length > MARKET_CONSTRAINTS.NAME_MAX_LENGTH) {
        return problemResponse(
          url.pathname,
          400,
          'INVALID_PRODUCT_REQUEST',
          'Bad Request',
          '상품명은 1~64자여야 합니다.',
        );
      }
      nextName = trimmed;
    }

    if ('price' in payload) {
      if (
        typeof payload.price !== 'number' ||
        !Number.isInteger(payload.price) ||
        payload.price < MARKET_CONSTRAINTS.PRICE_MIN ||
        payload.price > MARKET_CONSTRAINTS.PRICE_MAX
      ) {
        return problemResponse(
          url.pathname,
          400,
          'INVALID_PRODUCT_REQUEST',
          'Bad Request',
          '포인트는 1 이상의 정수여야 합니다.',
        );
      }
      nextPrice = payload.price;
    }

    if ('description' in payload) {
      nextDescription = payload.description ?? null;
    }

    if ('purchaseMessage' in payload) {
      if (
        payload.purchaseMessage !== null &&
        typeof payload.purchaseMessage === 'string' &&
        payload.purchaseMessage.length > MARKET_CONSTRAINTS.PURCHASE_MESSAGE_MAX_LENGTH
      ) {
        return problemResponse(
          url.pathname,
          400,
          'INVALID_PRODUCT_REQUEST',
          'Bad Request',
          '자녀에게 메시지는 최대 255자까지 입력할 수 있습니다.',
        );
      }
      nextPurchaseMessage = payload.purchaseMessage ?? null;
    }

    if (image) {
      const imageError = validateImageFile(url.pathname, image);
      if (imageError) return imageError;
      nextImageUrl = await fileToDataUrl(image as File);
    }

    const updated: MarketItem = {
      ...current,
      name: nextName,
      price: nextPrice,
      description: nextDescription,
      purchaseMessage: nextPurchaseMessage,
      imageUrl: nextImageUrl,
      updatedAt: new Date().toISOString(),
    };
    items[index] = updated;

    return HttpResponse.json({ data: updated });
  }),

  // [삭제 기능 보류]
  // http.delete('*/api/v1/market/items/:id', ({ request, params }) => {
    // const url = new URL(request.url);
    // const itemId = parseItemId(params.id);
    // if (itemId === null) {
      // return problemResponse(
        // url.pathname,
        // 400,
        // 'INVALID_ITEM_ID',
        // 'Bad Request',
        // 'id가 1 이상의 정수가 아님',
      // );
    // }

    // const index = items.findIndex((item) => item.itemId === itemId);
    // if (index === -1) {
      // return problemResponse(
        // url.pathname,
        // 404,
        // 'MARKET_ITEM_NOT_FOUND',
        // 'Not Found',
        // '해당 상품이 없음',
      // );
    // }

    // items.splice(index, 1);
    // return new HttpResponse(null, { status: 204 });
  // }),
];
