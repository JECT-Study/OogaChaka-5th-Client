'use client';

import Button from '@/components/common/button/Button';
import LeaveConfirmDialog from '../dialog/LeaveConfirmDialog';
import MarketGuardianMessage from '../MarketGuardianMessage';
import MarketHeader from '../MarketHeader';
import MarketProductInfo from '../MarketProductInfo';
import MarketProductThumbnail from '../MarketProductThumbnail';
import SubmitErrorBanner from './SubmitErrorBanner';

interface IProductFormPreviewProps {
  name: string;
  price: number;
  message: string | null;
  imageUrl: string | null;
  isSubmitting: boolean;
  submitError?: string | null;
  leaveDialogOpen: boolean;
  onBack: () => void;
  onEdit: () => void;
  onOpenLeaveDialog: () => void;
  onCloseLeaveDialog: () => void;
  onLeave: () => void;
  onSubmit: () => void;
}

export default function ProductFormPreview({
  name,
  price,
  message,
  imageUrl,
  isSubmitting,
  submitError,
  leaveDialogOpen,
  onBack,
  onEdit,
  onOpenLeaveDialog,
  onCloseLeaveDialog,
  onLeave,
  onSubmit,
}: IProductFormPreviewProps) {
  return (
    <div className="bg-static-white relative flex min-h-0 flex-1 flex-col">
      <MarketHeader
        title={name}
        onBack={onBack}
        deleteDisabled={isSubmitting}
        onDelete={onOpenLeaveDialog}
        onEdit={onEdit}
      />

      <div className="-mx-5 min-h-0 flex-1 overflow-y-auto px-5 pt-3 pb-10">
        <MarketProductThumbnail imageUrl={imageUrl} name={name} />
        <MarketProductInfo name={name} price={price} />
        <MarketGuardianMessage message={message} />

        {submitError && (
          <SubmitErrorBanner
            message={submitError}
            isSubmitting={isSubmitting}
            onRetry={onSubmit}
            onEdit={onEdit}
          />
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
          onClick={onSubmit}
        >
          {isSubmitting ? '저장 중...' : '저장하기'}
        </Button>
      </div>

      <LeaveConfirmDialog
        open={leaveDialogOpen}
        mode="create"
        onClose={onCloseLeaveDialog}
        onLeave={onLeave}
      />
    </div>
  );
}
