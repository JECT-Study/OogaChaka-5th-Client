'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { ChevronLeft, Header, IconButton } from '@/components';
import Button from '@/components/common/button/Button';
import {
  marketProductFormSchema,
  type MarketProductFormSchemaValues,
} from '@/schemas/marketProductSchema';
import type {
  ImageUploadState,
  MarketProductFormInitialValues,
  MarketProductFormValues,
} from '@/types/market/types';
import LeaveConfirmDialog from '../dialog/LeaveConfirmDialog';
import ProductFormFields from './ProductFormFields';
import ProductFormPreview from './ProductFormPreview';
import ProductImageField from './ProductImageField';
import SubmitErrorBanner from './SubmitErrorBanner';

interface IMarketProductFormProps {
  mode: 'create' | 'edit';
  initialValues?: MarketProductFormInitialValues;
  isSubmitting: boolean;
  submitError?: string | null;
  onClearSubmitError?: () => void;
  onBack: () => void;
  onSubmit: (values: MarketProductFormValues) => Promise<void> | void;
}

export default function MarketProductForm({
  mode,
  initialValues,
  isSubmitting,
  submitError,
  onClearSubmitError,
  onBack,
  onSubmit,
}: IMarketProductFormProps) {
  const {
    control,
    setValue,
    setError,
    clearErrors,
    handleSubmit,
    formState: { errors, isDirty, isValid, isSubmitting: formIsSubmitting },
  } = useForm<MarketProductFormSchemaValues>({
    resolver: zodResolver(marketProductFormSchema),
    mode: 'onChange',
    defaultValues: {
      name: initialValues?.name ?? '',
      priceText: initialValues ? String(initialValues.price) : '',
      purchaseMessage: initialValues?.purchaseMessage ?? '',
      imageUrl: initialValues?.imageUrl ?? '',
      imageFile: undefined,
    },
  });

  const [imageState, setImageState] = useState<ImageUploadState>(
    initialValues?.imageUrl ? 'ready' : 'empty',
  );
  const [isConfirmPreview, setIsConfirmPreview] = useState(false);
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);

  const submitting = isSubmitting || formIsSubmitting;

  const [name, priceText, purchaseMessage, imageUrl] = useWatch({
    control,
    name: ['name', 'priceText', 'purchaseMessage', 'imageUrl'],
  });

  useEffect(() => {
    if (!isDirty || submitting) return;
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty, submitting]);

  const isSubmitDisabled =
    mode === 'edit'
      ? submitting || imageState === 'loading' || !isValid || !isDirty
      : submitting || imageState === 'loading';

  function handleBackClick() {
    if (submitting) return;
    if (isConfirmPreview) {
      setIsConfirmPreview(false);
      return;
    }
    if (isDirty) {
      setLeaveDialogOpen(true);
      return;
    }
    onBack();
  }

  const executeSubmit = handleSubmit(async (values) => {
    if (submitting) return;
    const trimmedMessage = values.purchaseMessage.trim();
    await onSubmit({
      name: values.name.trim(),
      price: Number(values.priceText),
      purchaseMessage: trimmedMessage.length > 0 ? trimmedMessage : null,
      imageFile: values.imageFile,
    });
  });

  const handleFormSubmit = handleSubmit(() => {
    if (mode === 'create' && !isConfirmPreview) {
      setIsConfirmPreview(true);
      return;
    }
    void executeSubmit();
  });

  if (mode === 'create' && isConfirmPreview) {
    return (
      <ProductFormPreview
        name={name.trim()}
        price={Number(priceText)}
        message={purchaseMessage.trim() || null}
        imageUrl={imageUrl || null}
        isSubmitting={submitting}
        submitError={submitError}
        leaveDialogOpen={leaveDialogOpen}
        onBack={handleBackClick}
        onEdit={() => setIsConfirmPreview(false)}
        onOpenLeaveDialog={() => setLeaveDialogOpen(true)}
        onCloseLeaveDialog={() => setLeaveDialogOpen(false)}
        onLeave={onBack}
        onSubmit={() => void executeSubmit()}
      />
    );
  }

  const headerTitle = mode === 'create' ? '상품 등록' : '상품 수정';
  const ctaLabel = mode === 'create' ? '등록하기' : submitting ? '저장 중...' : '저장하기';

  return (
    <div className="bg-static-white relative flex min-h-0 flex-1 flex-col">
      <div className="bg-static-white -mx-5 shrink-0 px-5">
        <Header
          type="sub"
          title={headerTitle}
          leading={
            <IconButton
              icon={ChevronLeft}
              label="뒤로가기"
              iconSize={16}
              className="-ml-3"
              onClick={handleBackClick}
            />
          }
        />
      </div>

      <form onSubmit={handleFormSubmit} noValidate className="flex min-h-0 flex-1 flex-col">
        <div className="-mx-5 min-h-0 flex-1 overflow-y-auto px-5 pt-5 pb-10">
          <section className="flex flex-col gap-2">
            <h2 className="text-label-normal text-[18px] leading-[1.445] font-semibold tracking-[-0.0072px]">
              상품을 등록해주세요.
            </h2>
            <p className="text-label-alternative flex items-center gap-0.5 text-[14px] leading-[1.429] tracking-[0.028px]">
              <strong className="font-bold">자녀</strong>
              <span className="font-medium">가 미션을 달성해 받은 포인트로 상품을 받아요.</span>
            </p>
          </section>

          <div className="mt-7 flex flex-col gap-4">
            <ProductImageField
              imageUrl={imageUrl}
              productName={name}
              errorMessage={errors.imageUrl?.message}
              disabled={submitting}
              imageState={imageState}
              onImageStateChange={setImageState}
              onClearError={() => {
                clearErrors('imageUrl');
                onClearSubmitError?.();
              }}
              onImageSelected={(file, previewUrl) => {
                setValue('imageFile', file, { shouldDirty: true });
                setValue('imageUrl', previewUrl, { shouldDirty: true, shouldValidate: true });
              }}
              onImageError={(message) => {
                setValue('imageFile', undefined, { shouldDirty: true });
                setValue('imageUrl', '', { shouldDirty: true });
                setError('imageUrl', { message });
              }}
            />

            <ProductFormFields
              control={control}
              disabled={submitting}
              onFieldChange={onClearSubmitError}
            />

            {submitError && (
              <SubmitErrorBanner
                message={submitError}
                isSubmitting={submitting}
                onRetry={() => void executeSubmit()}
              />
            )}
          </div>
        </div>

        <div className="relative z-10 -mx-5 -mt-10 shrink-0 bg-[linear-gradient(180deg,rgba(252,252,252,0)_0%,var(--color-static-white)_19%)] px-5 pt-10 pb-[calc(20px+env(safe-area-inset-bottom,0px))]">
          <Button
            type="submit"
            size="large"
            variant="neutral"
            appearance="filled"
            width="100%"
            disabled={isSubmitDisabled}
            className="enabled:bg-lavender-grey-900!"
          >
            {ctaLabel}
          </Button>
        </div>
      </form>

      <LeaveConfirmDialog
        open={leaveDialogOpen}
        mode={mode}
        onClose={() => setLeaveDialogOpen(false)}
        onLeave={onBack}
      />
    </div>
  );
}
