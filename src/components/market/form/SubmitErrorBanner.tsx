'use client';

import Button from '@/components/common/button/Button';

interface ISubmitErrorBannerProps {
  message: string;
  isSubmitting: boolean;
  onRetry: () => void;
  onEdit?: () => void;
}

export default function SubmitErrorBanner({
  message,
  isSubmitting,
  onRetry,
  onEdit,
}: ISubmitErrorBannerProps) {
  return (
    <div
      role="alert"
      className="border-status-border-danger bg-status-background-danger mt-4 flex flex-col gap-2.5 rounded-md border p-3.5"
    >
      <p className="text-cinnabar-700 text-[14px] font-medium">{message}</p>
      <div className="flex gap-2">
        <Button
          size="small"
          variant="primary"
          appearance="filled"
          disabled={isSubmitting}
          onClick={onRetry}
        >
          다시 시도
        </Button>
        {onEdit && (
          <Button
            size="small"
            variant="neutral"
            appearance="outlined"
            disabled={isSubmitting}
            onClick={onEdit}
          >
            입력 수정하기
          </Button>
        )}
      </div>
    </div>
  );
}
