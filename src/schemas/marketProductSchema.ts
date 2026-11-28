import { z } from 'zod';
import { MARKET_CONSTRAINTS } from '@/types/market/types';

const ACCEPTED_MIME_TYPES: readonly string[] = MARKET_CONSTRAINTS.IMAGE_ACCEPTED_MIME_TYPES;

export const marketImageFileSchema = z
  .custom<File>((value) => value instanceof File, '올바른 이미지 파일이 아니에요.')
  .refine(
    (file) => ACCEPTED_MIME_TYPES.includes(file.type),
    'JPEG, PNG, WebP 형식의 사진만 업로드할 수 있어요.',
  )
  .refine(
    (file) => file.size > 0,
    '빈 파일은 업로드할 수 없어요. 다른 사진을 선택해 주세요.',
  )
  .refine(
    (file) => file.size <= MARKET_CONSTRAINTS.IMAGE_MAX_BYTES,
    '사진 용량은 최대 5MB까지 업로드할 수 있어요.',
  );

export const marketProductFormSchema = z.object({
  name: z
    .string()
    .refine((value) => value.trim().length > 0, '상품명을 입력해 주세요.')
    .refine(
      (value) => value.trim().length <= MARKET_CONSTRAINTS.NAME_MAX_LENGTH,
      `상품명은 최대 ${MARKET_CONSTRAINTS.NAME_MAX_LENGTH}자까지 입력할 수 있어요.`,
    ),
  priceText: z
    .string()
    .min(1, '포인트를 입력해 주세요.')
    .refine((value) => {
      const parsed = Number(value);
      return Number.isInteger(parsed) && parsed >= MARKET_CONSTRAINTS.PRICE_MIN;
    }, '포인트는 1 이상의 정수로 입력해 주세요.')
    .refine(
      (value) => Number(value) <= MARKET_CONSTRAINTS.PRICE_MAX,
      `포인트는 최대 ${MARKET_CONSTRAINTS.PRICE_MAX.toLocaleString()}P까지 설정할 수 있어요.`,
    ),
  purchaseMessage: z
    .string()
    .max(
      MARKET_CONSTRAINTS.PURCHASE_MESSAGE_MAX_LENGTH,
      `메시지는 최대 ${MARKET_CONSTRAINTS.PURCHASE_MESSAGE_MAX_LENGTH}자까지 입력할 수 있어요.`,
    ),
  imageUrl: z.string().min(1, '상품 사진을 등록해 주세요.'),
  imageFile: z.custom<File | undefined>(
    (value) => value === undefined || value instanceof File,
  ),
});

export type MarketProductFormSchemaValues = z.infer<typeof marketProductFormSchema>;
