'use client';

import { Controller, type Control } from 'react-hook-form';
import Input from '@/components/common/text/Input';
import TextArea from '@/components/common/text/TextArea';
import type { MarketProductFormSchemaValues } from '@/schemas/marketProductSchema';
import { MARKET_CONSTRAINTS } from '@/types/market/types';

interface IProductFormFieldsProps {
  control: Control<MarketProductFormSchemaValues>;
  disabled: boolean;
  onFieldChange?: () => void;
}

export default function ProductFormFields({
  control,
  disabled,
  onFieldChange,
}: IProductFormFieldsProps) {
  return (
    <>
      {/* 상품명 * */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center gap-1">
          <label
            htmlFor="market-name-input"
            className="text-label-neutral text-[18px] leading-[1.445] font-semibold tracking-[-0.0072px]"
          >
            상품명
          </label>
          <span aria-hidden className="text-cinnabar-500 text-[18px] font-semibold">
            *
          </span>
        </div>
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState }) => (
            <Input
              id="market-name-input"
              value={field.value}
              maxLength={MARKET_CONSTRAINTS.NAME_MAX_LENGTH}
              placeholder="상품명을 입력해주세요."
              disabled={disabled}
              status={fieldState.error ? 'negative' : 'normal'}
              className={
                fieldState.error
                  ? '[&_p]:text-cinnabar-600'
                  : '[&>div]:border-line-normal-normal [&_p]:font-normal'
              }
              helperText={fieldState.error?.message ?? '상품명은 짧고 간단하게 적어주시면 좋아요.'}
              onClear={() => {
                field.onChange('');
                field.onBlur();
                onFieldChange?.();
              }}
              onBlur={field.onBlur}
              onChange={(event) => {
                field.onChange(event.target.value);
                onFieldChange?.();
              }}
            />
          )}
        />
      </section>

      {/* 포인트 * */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center gap-1">
          <label
            htmlFor="market-price-input"
            className="text-label-normal text-[18px] leading-[1.445] font-semibold tracking-[-0.0072px]"
          >
            포인트
          </label>
          <span aria-hidden className="text-cinnabar-500 text-[18px] font-semibold">
            *
          </span>
        </div>
        <Controller
          name="priceText"
          control={control}
          render={({ field, fieldState }) => (
            <Input
              id="market-price-input"
              type="text"
              inputMode="numeric"
              value={field.value}
              placeholder="포인트 수량을 설정해주세요."
              disabled={disabled}
              status={fieldState.error ? 'negative' : 'normal'}
              className={
                fieldState.error
                  ? '[&_p]:text-cinnabar-600'
                  : '[&>div]:border-line-normal-normal'
              }
              helperText={fieldState.error?.message}
              onClear={() => {
                field.onChange('');
                field.onBlur();
                onFieldChange?.();
              }}
              onBlur={field.onBlur}
              onChange={(event) => {
                const digitsOnly = event.target.value.replace(/[^\d]/g, '');
                field.onChange(digitsOnly);
                onFieldChange?.();
              }}
            />
          )}
        />
      </section>

      {/* 자녀에게 메시지 */}
      <section className="flex flex-col gap-2">
        <label
          htmlFor="market-message-input"
          className="text-label-normal text-[18px] leading-[1.445] font-semibold tracking-[-0.0072px]"
        >
          자녀에게 메시지
        </label>
        <Controller
          name="purchaseMessage"
          control={control}
          render={({ field, fieldState }) => (
            <TextArea
              id="market-message-input"
              value={field.value}
              rows={1}
              maxLength={MARKET_CONSTRAINTS.PURCHASE_MESSAGE_MAX_LENGTH}
              placeholder="자녀에게 전할 메시지를 입력해주세요."
              disabled={disabled}
              status={fieldState.error ? 'negative' : 'normal'}
              className="[&>div]:border-line-normal-normal [&_p]:text-label-alternative [&_p]:font-normal"
              helperText={fieldState.error?.message ?? '덧붙일 내용이 있다면 적어주세요.'}
              onBlur={field.onBlur}
              onChange={(event) => {
                field.onChange(event.target.value);
                onFieldChange?.();
              }}
            />
          )}
        />
      </section>
    </>
  );
}
