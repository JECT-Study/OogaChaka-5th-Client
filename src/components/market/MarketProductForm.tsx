'use client';

import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { ChevronLeft, Header, IconButton, Thumbnail } from '@/components';
import Button from '@/components/common/button/Button';
import Input from '@/components/common/text/Input';
import TextArea from '@/components/common/text/TextArea';
import ConfirmDialog from './ConfirmDialog';
import MarketKebabMenu from './MarketKebabMenu';
import { MARKET_CONSTRAINTS } from '@/types/market/types';

export type MarketProductFormValues = {
  name: string;
  price: number;
  purchaseMessage: string | null;
  imageFile?: File;
};

type MarketProductFormInitialValues = {
  name: string;
  price: number;
  purchaseMessage: string | null;
  imageUrl: string;
};

type MarketProductFormProps = {
  mode: 'create' | 'edit';
  initialValues?: MarketProductFormInitialValues;
  isSubmitting: boolean;
  submitError?: string | null;
  onClearSubmitError?: () => void;
  onBack: () => void;
  onSubmit: (values: MarketProductFormValues) => Promise<void> | void;
};

type ImageUploadState = 'empty' | 'loading' | 'ready' | 'error';

function decodeImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => resolve(objectUrl);
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('INVALID_IMAGE'));
    };
    img.src = objectUrl;
  });
}

function validateImageBeforeDecode(file: File): string | null {
  const accepted: readonly string[] = MARKET_CONSTRAINTS.IMAGE_ACCEPTED_MIME_TYPES;
  if (!accepted.includes(file.type)) {
    return 'JPEG, PNG, WebP 형식의 사진만 업로드할 수 있어요.';
  }
  if (file.size === 0) {
    return '빈 파일은 업로드할 수 없어요. 다른 사진을 선택해 주세요.';
  }
  if (file.size > MARKET_CONSTRAINTS.IMAGE_MAX_BYTES) {
    return '사진 용량은 최대 5MB까지 업로드할 수 있어요.';
  }
  return null;
}

export default function MarketProductForm({
  mode,
  initialValues,
  isSubmitting,
  submitError,
  onClearSubmitError,
  onBack,
  onSubmit,
}: MarketProductFormProps) {
  const [name, setName] = useState(initialValues?.name ?? '');
  const [priceText, setPriceText] = useState(
    initialValues ? String(initialValues.price) : '',
  );
  const [purchaseMessage, setPurchaseMessage] = useState(
    initialValues?.purchaseMessage ?? '',
  );

  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialValues?.imageUrl ?? null);
  const [imageState, setImageState] = useState<ImageUploadState>(
    initialValues?.imageUrl ? 'ready' : 'empty',
  );
  const [imageError, setImageError] = useState<string | null>(null);
  const [lastAttemptedFile, setLastAttemptedFile] = useState<File | null>(null);

  const [touched, setTouched] = useState({
    name: false,
    price: false,
    image: false,
  });
  const [isConfirmPreview, setIsConfirmPreview] = useState(false);
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const submittingRef = useRef(false);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  const trimmedName = name.trim();
  const parsedPrice = priceText.length > 0 ? Number(priceText) : NaN;
  const trimmedMessage = purchaseMessage.trim();

  const nameError = useMemo(() => {
    if (trimmedName.length === 0) return '상품명을 입력해 주세요.';
    if (trimmedName.length > MARKET_CONSTRAINTS.NAME_MAX_LENGTH) {
      return `상품명은 최대 ${MARKET_CONSTRAINTS.NAME_MAX_LENGTH}자까지 입력할 수 있어요.`;
    }
    return null;
  }, [trimmedName]);

  const priceError = useMemo(() => {
    if (priceText.length === 0) return '포인트를 입력해 주세요.';
    if (!Number.isInteger(parsedPrice) || parsedPrice < MARKET_CONSTRAINTS.PRICE_MIN) {
      return '포인트는 1 이상의 정수로 입력해 주세요.';
    }
    if (parsedPrice > MARKET_CONSTRAINTS.PRICE_MAX) {
      return `포인트는 최대 ${MARKET_CONSTRAINTS.PRICE_MAX.toLocaleString()}P까지 설정할 수 있어요.`;
    }
    return null;
  }, [priceText, parsedPrice]);

  const messageError = useMemo(() => {
    if (purchaseMessage.length > MARKET_CONSTRAINTS.PURCHASE_MESSAGE_MAX_LENGTH) {
      return `메시지는 최대 ${MARKET_CONSTRAINTS.PURCHASE_MESSAGE_MAX_LENGTH}자까지 입력할 수 있어요.`;
    }
    return null;
  }, [purchaseMessage]);

  const hasValidImage =
    mode === 'create'
      ? Boolean(imageFile) && imageState === 'ready'
      : Boolean(previewUrl) && imageState === 'ready';

  const isDirty = useMemo(() => {
    if (mode === 'create') {
      return (
        trimmedName.length > 0 ||
        priceText.length > 0 ||
        trimmedMessage.length > 0 ||
        Boolean(imageFile)
      );
    }
    if (!initialValues) return false;
    const initialMsg = (initialValues.purchaseMessage ?? '').trim();
    return (
      trimmedName !== initialValues.name.trim() ||
      parsedPrice !== initialValues.price ||
      trimmedMessage !== initialMsg ||
      Boolean(imageFile)
    );
  }, [mode, initialValues, trimmedName, priceText, parsedPrice, trimmedMessage, imageFile]);

  const isFormValid = !nameError && !priceError && !messageError && hasValidImage;
  const isEditSubmitDisabled =
    isSubmitting || imageState === 'loading' || !isFormValid || !isDirty;
  const isCreateSubmitDisabled = isSubmitting || imageState === 'loading';
  const isSubmitDisabled = mode === 'edit' ? isEditSubmitDisabled : isCreateSubmitDisabled;

  useEffect(() => {
    if (!isDirty || isSubmitting) return;
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty, isSubmitting]);

  async function processSelectedFile(file: File) {
    setTouched((prev) => ({ ...prev, image: true }));
    setLastAttemptedFile(file);
    setImageError(null);
    onClearSubmitError?.();

    const preError = validateImageBeforeDecode(file);
    if (preError) {
      setImageFile(undefined);
      setImageState('error');
      setImageError(preError);
      return;
    }

    setImageState('loading');
    try {
      const nextUrl = await decodeImageFile(file);
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
      objectUrlRef.current = nextUrl;
      setPreviewUrl(nextUrl);
      setImageFile(file);
      setImageState('ready');
      setImageError(null);
    } catch {
      setImageFile(undefined);
      setImageState('error');
      setImageError('사진을 불러오지 못했어요. 올바른 이미지 파일인지 확인 후 다시 시도해 주세요.');
    }
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    void processSelectedFile(file);
  }

  function handleImageRetry() {
    if (lastAttemptedFile && !validateImageBeforeDecode(lastAttemptedFile)) {
      void processSelectedFile(lastAttemptedFile);
      return;
    }
    fileInputRef.current?.click();
  }

  function handleBackClick() {
    if (isSubmitting) return;
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

  async function executeSubmit() {
    setTouched({ name: true, price: true, image: true });
    if (!isFormValid || isSubmitDisabled || submittingRef.current) return;

    submittingRef.current = true;
    try {
      await onSubmit({
        name: trimmedName,
        price: parsedPrice,
        purchaseMessage: trimmedMessage.length > 0 ? trimmedMessage : null,
        imageFile,
      });
    } finally {
      submittingRef.current = false;
    }
  }

  function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTouched({ name: true, price: true, image: true });
    if (!isFormValid || isSubmitDisabled) return;

    if (mode === 'create' && !isConfirmPreview) {
      setIsConfirmPreview(true);
      return;
    }
    void executeSubmit();
  }

  // 보상 등록 버튼 클릭 시 보여지는 최종 확인/미리보기 화면 (Figma 981:33022)
  if (mode === 'create' && isConfirmPreview) {
    return (
      <div className="relative flex min-h-0 flex-1 flex-col bg-static-white">
        <div className="shrink-0 -mx-5 bg-static-white px-5">
          <Header
            type="detail"
            title={trimmedName}
            leading={
              <IconButton
                icon={ChevronLeft}
                label="뒤로가기"
                iconSize={16}
                className="-ml-3"
                onClick={handleBackClick}
              />
            }
            trailing={
              <MarketKebabMenu
                items={[
                  {
                    id: 'cancel',
                    label: '삭제하기',
                    tone: 'danger',
                    disabled: isSubmitting,
                    onSelect: () => setLeaveDialogOpen(true),
                  },
                  {
                    id: 'edit',
                    label: '수정하기',
                    disabled: isSubmitting,
                    onSelect: () => setIsConfirmPreview(false),
                  },
                ]}
              />
            }
          />
        </div>

        <div className="-mx-5 min-h-0 flex-1 overflow-y-auto px-5 pt-3 pb-10">
          <div className="relative overflow-hidden rounded-lg">
            <Thumbnail
              src={previewUrl}
              loading="eager"
              alt={trimmedName}
              height={315}
              width="100%"
              className="aspect-auto rounded-lg"
            />
          </div>

          <section className="mt-4 flex flex-col items-center">
            <div className="flex items-center justify-center gap-2 py-3">
              <h2 className="text-[18px] font-semibold leading-[1.445] tracking-[-0.0072px] text-label-normal">
                {trimmedName}
              </h2>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="rounded-sm bg-primary-subtle px-2 py-0.5 text-[14px] font-medium leading-[1.429] text-primary-strong">
                포인트
              </span>
              <span className="text-[20px] font-semibold leading-[1.5] tracking-[-0.4px] text-label-neutral">
                {parsedPrice.toLocaleString()}P
              </span>
            </div>
          </section>

          <section className="mt-6 flex items-center gap-[9px] rounded-md bg-neutral-5 px-4 py-4">
            <span className="shrink-0 text-[16px] font-semibold leading-[1.5] tracking-[-0.352px] text-label-neutral">
              보호자
            </span>
            <span aria-hidden className="h-5 w-[1.5px] shrink-0 bg-line-normal-normal" />
            <p className="min-w-0 flex-1 text-[16px] font-normal leading-[1.5] tracking-[0.0144px] break-words whitespace-pre-line text-label-neutral">
              {trimmedMessage || '등록된 메시지가 없어요.'}
            </p>
          </section>

          {submitError && (
            <div
              role="alert"
              className="flex flex-col gap-2.5 rounded-md border border-status-border-danger bg-status-background-danger p-3.5"
            >
              <p className="text-[14px] font-medium text-cinnabar-700">{submitError}</p>
              <div className="flex gap-2">
                <Button
                  size="small"
                  variant="primary"
                  appearance="filled"
                  disabled={isSubmitting}
                  onClick={() => void executeSubmit()}
                >
                  다시 시도
                </Button>
                <Button
                  size="small"
                  variant="neutral"
                  appearance="outlined"
                  disabled={isSubmitting}
                  onClick={() => setIsConfirmPreview(false)}
                >
                  입력 수정하기
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="relative z-10 -mx-5 -mt-10 shrink-0 bg-[linear-gradient(180deg,rgba(252,252,252,0)_0%,var(--color-static-white)_19%)] px-5 pt-10 pb-[calc(20px+env(safe-area-inset-bottom,0px))]">
          <Button
            type="button"
            size="large"
            variant="neutral"
            appearance="filled"
            width="100%"
            disabled={isSubmitting}
            className="enabled:bg-lavender-grey-900!"
            onClick={() => void executeSubmit()}
          >
            {isSubmitting ? '저장 중...' : '저장하기'}
          </Button>
        </div>

        <ConfirmDialog
          open={leaveDialogOpen}
          title="변경된 사항이 있어요"
          description={
            '작성 중인 상품 정보가 있어요. 지금 이\n페이지를 떠나면 입력한 내용을 잃게 돼요.'
          }
          secondaryLabel="등록 그만두기"
          primaryLabel="계속 작성하기"
          onSecondary={() => {
            setLeaveDialogOpen(false);
            onBack();
          }}
          onPrimary={() => setLeaveDialogOpen(false)}
        />
      </div>
    );
  }

  const headerTitle = mode === 'create' ? '상품 등록' : '상품 수정';
  const ctaLabel =
    mode === 'create'
      ? '등록하기'
      : isSubmitting
        ? '저장 중...'
        : '저장하기';

  return (
    <div className="relative flex min-h-0 flex-1 flex-col bg-static-white">
      {/* Figma 981:33021 / 1198:10376: 좌측 '<' + 타이틀 정렬 헤더 */}
      <div className="shrink-0 -mx-5 bg-static-white px-5">
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
          {/* 상단 타이틀 + 안내 문구 (Figma gap: 8px) */}
          <section className="flex flex-col gap-2">
            <h2 className="text-[18px] font-semibold leading-[1.445] tracking-[-0.0072px] text-label-normal">
              상품을 등록해주세요.
            </h2>
            <p className="flex items-center gap-0.5 text-[14px] leading-[1.429] tracking-[0.028px] text-label-alternative">
              <strong className="font-bold">자녀</strong>
              <span className="font-medium">가 미션을 달성해 받은 포인트로 상품을 받아요.</span>
            </p>
          </section>

          {/* 입력 필드 스택 (Figma 상단 여백 28px, 필드 간 gap 16px) */}
          <div className="mt-7 flex flex-col gap-4">
          {/* 상품 사진 * (라벨-썸네일 gap 16px) */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-1">
              <label
                htmlFor="market-image-input"
                className="text-[18px] font-semibold leading-[1.445] tracking-[-0.0072px] text-label-normal"
              >
                상품 사진
              </label>
              <span aria-hidden className="text-[18px] font-semibold text-cinnabar-500">
                *
              </span>
            </div>

            <input
              ref={fileInputRef}
              id="market-image-input"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              disabled={isSubmitting}
              onChange={handleFileChange}
            />

            <button
              type="button"
              disabled={isSubmitting || imageState === 'loading'}
              onClick={() => fileInputRef.current?.click()}
              aria-label={previewUrl ? '상품 사진 편집' : '상품 사진 등록'}
              className={`relative flex size-[162px] shrink-0 overflow-hidden rounded-md transition-opacity active:opacity-90 ${
                imageState === 'error' || (touched.image && !hasValidImage)
                  ? 'ring-[1.5px] ring-cinnabar-400'
                  : ''
              }`}
            >
              <Thumbnail
                src={imageState === 'empty' ? null : previewUrl}
                loading="eager"
                alt={trimmedName || '상품 사진'}
                className="size-full rounded-md"
              />
              {previewUrl && imageState !== 'empty' && (
                <>
                  <span className="absolute inset-0 bg-black/64" />
                  <span className="absolute inset-0 flex items-center justify-center text-[14px] font-bold tracking-[0.028px] text-white">
                    {imageState === 'loading' ? '불러오는 중...' : '사진 편집'}
                  </span>
                </>
              )}
              {imageState === 'loading' && !previewUrl && (
                <span className="absolute inset-0 flex items-center justify-center bg-black/30 text-[13px] font-semibold text-white">
                  사진 확인 중...
                </span>
              )}
            </button>

            {(imageError || (touched.image && !hasValidImage)) && (
              <div className="flex flex-col items-start gap-2">
                <p role="alert" className="text-[13px] font-medium text-cinnabar-600">
                  {imageError ?? '상품 사진을 등록해 주세요.'}
                </p>
                {imageState === 'error' && (
                  <Button
                    size="small"
                    variant="neutral"
                    appearance="outlined"
                    onClick={handleImageRetry}
                  >
                    사진 다시 선택 / 재시도
                  </Button>
                )}
              </div>
            )}
          </section>

          {/* 상품명 * */}
          <section className="flex flex-col gap-2">
            <div className="flex items-center gap-1">
              <label
                htmlFor="market-name-input"
                className="text-[18px] font-semibold leading-[1.445] tracking-[-0.0072px] text-label-neutral"
              >
                상품명
              </label>
              <span aria-hidden className="text-[18px] font-semibold text-cinnabar-500">
                *
              </span>
            </div>
            <Input
              id="market-name-input"
              value={name}
              maxLength={MARKET_CONSTRAINTS.NAME_MAX_LENGTH}
              placeholder="상품명을 입력해주세요."
              disabled={isSubmitting}
              status={touched.name && nameError ? 'negative' : 'normal'}
              className={
                touched.name && nameError
                  ? '[&_p]:text-cinnabar-600'
                  : '[&>div]:border-line-normal-normal [&_p]:font-normal'
              }
              helperText={
                touched.name && nameError
                  ? nameError
                  : '상품명은 짧고 간단하게 적어주시면 좋아요.'
              }
              onClear={() => {
                setName('');
                setTouched((prev) => ({ ...prev, name: true }));
                onClearSubmitError?.();
              }}
              onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
              onChange={(event) => {
                setName(event.target.value);
                onClearSubmitError?.();
              }}
            />
          </section>

          {/* 포인트 * */}
          <section className="flex flex-col gap-2">
            <div className="flex items-center gap-1">
              <label
                htmlFor="market-price-input"
                className="text-[18px] font-semibold leading-[1.445] tracking-[-0.0072px] text-label-normal"
              >
                포인트
              </label>
              <span aria-hidden className="text-[18px] font-semibold text-cinnabar-500">
                *
              </span>
            </div>
            <Input
              id="market-price-input"
              type="text"
              inputMode="numeric"
              value={priceText}
              placeholder="포인트 수량을 설정해주세요."
              disabled={isSubmitting}
              status={touched.price && priceError ? 'negative' : 'normal'}
              className={
                touched.price && priceError
                  ? '[&_p]:text-cinnabar-600'
                  : '[&>div]:border-line-normal-normal'
              }
              helperText={touched.price && priceError ? priceError : undefined}
              onClear={() => {
                setPriceText('');
                setTouched((prev) => ({ ...prev, price: true }));
                onClearSubmitError?.();
              }}
              onBlur={() => setTouched((prev) => ({ ...prev, price: true }))}
              onChange={(event) => {
                const digitsOnly = event.target.value.replace(/[^\d]/g, '');
                setPriceText(digitsOnly);
                onClearSubmitError?.();
              }}
            />
          </section>

          {/* 자녀에게 메시지 */}
          <section className="flex flex-col gap-2">
            <label
              htmlFor="market-message-input"
              className="text-[18px] font-semibold leading-[1.445] tracking-[-0.0072px] text-label-normal"
            >
              자녀에게 메시지
            </label>
            <TextArea
              id="market-message-input"
              value={purchaseMessage}
              rows={1}
              maxLength={MARKET_CONSTRAINTS.PURCHASE_MESSAGE_MAX_LENGTH}
              placeholder="자녀에게 전할 메시지를 입력해주세요."
              disabled={isSubmitting}
              status={messageError ? 'negative' : 'normal'}
              className="[&>div]:border-line-normal-normal [&_p]:font-normal [&_p]:text-label-alternative"
              helperText={messageError ?? '덧붙일 내용이 있다면 적어주세요.'}
              onChange={(event) => {
                setPurchaseMessage(event.target.value);
                onClearSubmitError?.();
              }}
            />
          </section>

          {/* 제출 실패 배너 + 재시도 */}
          {submitError && (
            <div
              role="alert"
              className="flex flex-col gap-2.5 rounded-md border border-status-border-danger bg-status-background-danger p-3.5"
            >
              <p className="text-[14px] font-medium text-cinnabar-700">{submitError}</p>
              <Button
                size="small"
                variant="primary"
                appearance="filled"
                disabled={isSubmitting}
                className="self-start"
                onClick={() => void executeSubmit()}
              >
                다시 시도
              </Button>
            </div>
          )}
          </div>
        </div>

        {/* 하단 CTA (Figma Button+Gradient Scrim: pt 40px, px 20px, pb 20px + safe-area) */}
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

      <ConfirmDialog
        open={leaveDialogOpen}
        title="변경된 사항이 있어요"
        description={
          mode === 'edit'
            ? '수정하면서 변경된 사항이 있어요. 지금 이\n페이지를 떠나면 수정한 사항을 잃게 돼요.'
            : '작성하면서 변경된 사항이 있어요. 지금 이\n페이지를 떠나면 작성한 내용을 잃게 돼요.'
        }
        secondaryLabel={mode === 'edit' ? '수정 그만두기' : '등록 그만두기'}
        primaryLabel={mode === 'edit' ? '계속 수정하기' : '계속 작성하기'}
        onSecondary={() => {
          setLeaveDialogOpen(false);
          onBack();
        }}
        onPrimary={() => setLeaveDialogOpen(false)}
      />
    </div>
  );
}
