'use client';

import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { Thumbnail } from '@/components';
import Button from '@/components/common/button/Button';
import { marketImageFileSchema } from '@/schemas/marketProductSchema';
import type { ImageUploadState } from '@/types/market/types';

interface IProductImageFieldProps {
  imageUrl: string;
  productName: string;
  errorMessage?: string;
  disabled: boolean;
  imageState: ImageUploadState;
  onImageStateChange: (state: ImageUploadState) => void;
  onImageSelected: (file: File, previewUrl: string) => void;
  onImageError: (message: string) => void;
  onClearError: () => void;
}

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

export default function ProductImageField({
  imageUrl,
  productName,
  errorMessage,
  disabled,
  imageState,
  onImageStateChange,
  onImageSelected,
  onImageError,
  onClearError,
}: IProductImageFieldProps) {
  const [lastAttemptedFile, setLastAttemptedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  async function processSelectedFile(file: File) {
    setLastAttemptedFile(file);
    onClearError();

    const parsed = marketImageFileSchema.safeParse(file);
    if (!parsed.success) {
      onImageStateChange('error');
      onImageError(parsed.error.issues[0]?.message ?? '올바른 이미지 파일이 아니에요.');
      return;
    }

    onImageStateChange('loading');
    try {
      const nextUrl = await decodeImageFile(file);
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
      objectUrlRef.current = nextUrl;
      onImageStateChange('ready');
      onImageSelected(file, nextUrl);
    } catch {
      onImageStateChange('error');
      onImageError('사진을 불러오지 못했어요. 올바른 이미지 파일인지 확인 후 다시 시도해 주세요.');
    }
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    void processSelectedFile(file);
  }

  function handleRetry() {
    if (lastAttemptedFile && marketImageFileSchema.safeParse(lastAttemptedFile).success) {
      void processSelectedFile(lastAttemptedFile);
      return;
    }
    fileInputRef.current?.click();
  }

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center gap-1">
        <label
          htmlFor="market-image-input"
          className="text-label-normal text-[18px] leading-[1.445] font-semibold tracking-[-0.0072px]"
        >
          상품 사진
        </label>
        <span aria-hidden className="text-cinnabar-500 text-[18px] font-semibold">
          *
        </span>
      </div>

      <input
        ref={fileInputRef}
        id="market-image-input"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        disabled={disabled}
        onChange={handleFileChange}
      />

      <button
        type="button"
        disabled={disabled || imageState === 'loading'}
        onClick={() => fileInputRef.current?.click()}
        aria-label={imageUrl ? '상품 사진 편집' : '상품 사진 등록'}
        className={`relative flex size-[162px] shrink-0 overflow-hidden rounded-md transition-opacity active:opacity-90 ${
          imageState === 'error' || errorMessage ? 'ring-cinnabar-400 ring-[1.5px]' : ''
        }`}
      >
        <Thumbnail
          src={imageState === 'empty' || !imageUrl ? null : imageUrl}
          loading="eager"
          alt={productName.trim() || '상품 사진'}
          className="size-full rounded-md"
        />
        {imageUrl && imageState !== 'empty' && (
          <>
            <span className="absolute inset-0 bg-black/64" />
            <span className="absolute inset-0 flex items-center justify-center text-[14px] font-bold tracking-[0.028px] text-white">
              {imageState === 'loading' ? '불러오는 중...' : '사진 편집'}
            </span>
          </>
        )}
        {imageState === 'loading' && !imageUrl && (
          <span className="absolute inset-0 flex items-center justify-center bg-black/30 text-[13px] font-semibold text-white">
            사진 확인 중...
          </span>
        )}
      </button>

      {errorMessage && (
        <div className="flex flex-col items-start gap-2">
          <p role="alert" className="text-cinnabar-600 text-[13px] font-medium">
            {errorMessage}
          </p>
          {imageState === 'error' && (
            <Button size="small" variant="neutral" appearance="outlined" onClick={handleRetry}>
              사진 다시 선택 / 재시도
            </Button>
          )}
        </div>
      )}
    </section>
  );
}
