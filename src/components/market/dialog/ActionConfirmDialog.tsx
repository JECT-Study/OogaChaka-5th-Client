'use client';

import type { CSSProperties } from 'react';
import Button from '@/components/common/button/Button';
import ConfirmDialogShell from './ConfirmDialogShell';

export interface IActionConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  /** 상단 회색 보조 버튼 (예: '목록 수정하기', '수정 그만두기') */
  secondaryLabel: string;
  /** 하단 보라색 아웃라인 강조 버튼 (예: '등록 그만두기', '계속 수정하기') */
  primaryLabel: string;
  secondaryTone?: 'neutral' | 'danger';
  loading?: boolean;
  onBackdropClose?: () => void;
  onSecondary: () => void;
  onPrimary: () => void;
}

// Button 기본 팔레트에 없는 모달 전용 색 조합.
// normal / pressed / focused 상태를 모두 덮어써 기본 팔레트 색이 섞이지 않게 한다.
// disabled는 Button 공통 비활성 색을 그대로 쓴다.
const SECONDARY_NEUTRAL_STYLE = {
  '--button-bg': 'var(--color-background-normal-alternative)',
  '--button-text': 'var(--color-label-normal)',
  '--button-pressed-bg': 'var(--color-neutral-10)',
  '--button-pressed-text': 'var(--color-label-normal)',
  '--button-focused-bg': 'var(--color-neutral-10)',
  '--button-focused-text': 'var(--color-label-normal)',
} as CSSProperties;

const SECONDARY_DANGER_STYLE = {
  '--button-bg': 'var(--color-status-background-danger)',
  '--button-text': 'var(--color-cinnabar-600)',
  '--button-pressed-bg': 'var(--color-cinnabar-100)',
  '--button-pressed-text': 'var(--color-cinnabar-700)',
  '--button-focused-bg': 'var(--color-cinnabar-100)',
  '--button-focused-text': 'var(--color-cinnabar-700)',
} as CSSProperties;

const PRIMARY_OUTLINED_STYLE = {
  '--button-bg': 'var(--color-primary-subtle)',
  '--button-text': 'var(--color-primary-normal)',
  '--button-border': 'var(--color-periwinkle-400)',
  '--button-pressed-bg': 'var(--color-periwinkle-100)',
  '--button-pressed-text': 'var(--color-primary-normal)',
  '--button-pressed-border': 'var(--color-periwinkle-400)',
  '--button-focused-bg': 'var(--color-periwinkle-100)',
  '--button-focused-text': 'var(--color-primary-normal)',
  '--button-focused-border': 'var(--color-primary-normal)',
  borderWidth: '1.5px',
} as CSSProperties;

export default function ActionConfirmDialog({
  open,
  title,
  description,
  secondaryLabel,
  primaryLabel,
  secondaryTone = 'neutral',
  loading = false,
  onBackdropClose,
  onSecondary,
  onPrimary,
}: IActionConfirmDialogProps) {
  return (
    <ConfirmDialogShell
      open={open}
      overlayType="bright"
      loading={loading}
      ariaDescribedBy={description ? 'confirm-dialog-desc' : undefined}
      onBackdropClose={onBackdropClose ?? onPrimary}
      className="gap-6 rounded-[24px] px-5 pt-7 pb-6"
    >
      <div className="flex flex-col gap-2.5 text-center">
        <h2
          id="confirm-dialog-title"
          className="text-heading-2 text-label-normal font-semibold break-keep"
        >
          {title}
        </h2>
        {description && (
          <p
            id="confirm-dialog-desc"
            className="text-label-1-reading text-label-alternative break-keep whitespace-pre-line"
          >
            {description}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <Button
          size="large"
          variant="neutral"
          appearance="filled"
          width="100%"
          disabled={loading}
          style={secondaryTone === 'danger' ? SECONDARY_DANGER_STYLE : SECONDARY_NEUTRAL_STYLE}
          onClick={onSecondary}
        >
          {loading ? '처리 중...' : secondaryLabel}
        </Button>

        <Button
          size="large"
          variant="primary"
          appearance="outlined"
          width="100%"
          disabled={loading}
          style={PRIMARY_OUTLINED_STYLE}
          onClick={onPrimary}
        >
          {primaryLabel}
        </Button>
      </div>
    </ConfirmDialogShell>
  );
}
