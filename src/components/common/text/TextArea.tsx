'use client';

import { useId, useRef, type ChangeEvent, type ComponentProps } from 'react';

import { useAutoGrow } from '@/hook/useAutoGrow';
import { useCharCount } from '@/hook/Usecharcount';

import TextButton from '../button/TextButton';
import {
  FIELD_BOX,
  FIELD_BOX_DISABLED,
  FIELD_BOX_ENABLED,
  FIELD_HELPER,
  FIELD_TEXT,
  FIELD_TEXT_COLOR,
  cx,
  setRef,
  type FieldTextColor,
} from './Fieldstyles';

export type TextAreaStatus = 'normal' | 'negative' | 'positive';

const LINE_HEIGHT = 24; // FIELD_TEXT의 leading-6

export type TextAreaProps = Omit<ComponentProps<'textarea'>, 'cols' | 'style'> & {
  status?: TextAreaStatus;
  helperText?: string;
  /** 하단 오른쪽 텍스트 버튼. 라벨이 있을 때만 그림 (예: "등록", "지우기") */
  actionLabel?: string;
  onAction?: () => void;
  actionType?: 'button' | 'submit';
  /** 기본값: disabled이거나 status가 negative일 때 비활성 (Figma 기준) */
  actionDisabled?: boolean;
  /** 입력 글자색. 기본 black */
  textColor?: FieldTextColor;
  /** 바깥 래퍼(박스 + helper)에 적용 */
  className?: string;
  /** 전체 너비. 숫자는 px, 문자열은 그대로. 기본은 부모 너비 100% */
  width?: number | string;
  /** 박스 높이를 고정. 없으면 내용에 따라 maxRows까지 자동으로 늘어남 */
  height?: number | string;
  /** 자동 늘어남의 최대 줄 수 (height를 지정하면 무시) */
  maxRows?: number;
};

// TODO: Figma Dev Mode로 상태별 테두리 변수명 확인 (스크린샷 + 토큰 기준 추정값)
const BOX_BY_STATUS: Record<TextAreaStatus, string> = {
  normal: 'border-line-solid-normal focus-within:border-periwinkle-400',
  negative: 'border-cinnabar-300 focus-within:border-cinnabar-400',
  positive: 'border-twilight-indigo-300',
};

// TODO: helper 색 토큰 확인 (스크린샷 기준: 기본 검정 / 포커스 보라 / 에러 빨강, positive는 미확인)
const HELPER_BY_STATUS: Record<TextAreaStatus, string> = {
  normal: 'text-label-normal group-focus-within:text-primary-strong',
  negative: 'text-cinnabar-600',
  positive: 'text-label-normal',
};

export default function TextArea({
  status = 'normal',
  helperText,
  actionLabel,
  onAction,
  actionType = 'button',
  actionDisabled,
  disabled,
  textColor = 'black',
  className,
  width,
  height,
  maxRows = 6,
  rows = 1,
  maxLength,
  ref,
  id,
  value,
  defaultValue,
  onChange,
  ...props
}: TextAreaProps) {
  const autoId = useId();
  const areaId = id ?? autoId;
  const helperId = `${areaId}-helper`;
  const innerRef = useRef<HTMLTextAreaElement | null>(null);

  const { text, count, track } = useCharCount({ value, defaultValue });

  const fixedHeight = height != null;
  const showFooter = maxLength != null || !!actionLabel;
  const isActionDisabled = actionDisabled ?? (disabled || status === 'negative');

  useAutoGrow(innerRef, text, { enabled: !fixedHeight, maxHeight: maxRows * LINE_HEIGHT });

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    track(e.target.value);
    onChange?.(e);
  };

  return (
    <div
      className={cx('group gap-field-message-gap-max flex w-full flex-col', className)}
      style={{ width }}
    >
      {/* Figma Large: 박스 padding 12, radius 12, 내용은 위/아래로 space-between */}
      <div
        style={{ height }}
        onClick={(e) => {
          // 박스의 빈 곳을 눌러도 입력되게. 버튼 클릭은 제외
          if ((e.target as HTMLElement).closest('button')) return;
          innerRef.current?.focus();
        }}
        className={cx(
          'flex w-full flex-col justify-between p-3',
          FIELD_BOX,
          disabled ? FIELD_BOX_DISABLED : cx(FIELD_BOX_ENABLED, BOX_BY_STATUS[status]),
        )}
      >
        {/* 안쪽 래퍼: padding 0 4px, 입력 영역과 하단 줄 사이 gap 16 */}
        <div className="flex min-h-0 flex-1 flex-col gap-4 px-1">
          <textarea
            ref={(node) => {
              innerRef.current = node;
              setRef(ref, node);
            }}
            id={areaId}
            rows={rows}
            value={value}
            defaultValue={defaultValue}
            maxLength={maxLength}
            disabled={disabled}
            onChange={handleChange}
            aria-invalid={status === 'negative' || undefined}
            aria-describedby={helperText ? helperId : undefined}
            className={cx(
              'w-full resize-none overflow-y-auto bg-transparent outline-none',
              fixedHeight && 'min-h-0 flex-1',
              FIELD_TEXT,
              FIELD_TEXT_COLOR[textColor],
            )}
            {...props}
          />

          {showFooter && (
            <div className="flex h-6 shrink-0 items-center justify-between gap-1">
              {maxLength != null ? (
                // TODO: 카운터 글자 스타일 Figma 값 확인 (임시: Label 2)
                <span
                  className={cx(
                    'font-pretendard text-label-2',
                    disabled ? 'text-label-disabled' : 'text-interaction-inactive',
                  )}
                >
                  {count}/{maxLength}
                </span>
              ) : (
                <span />
              )}
              {actionLabel && (
                <TextButton
                  variant="primary"
                  size="inline"
                  type={actionType}
                  disabled={isActionDisabled}
                  onClick={onAction}
                >
                  {actionLabel}
                </TextButton>
              )}
            </div>
          )}
        </div>
      </div>

      {helperText && (
        <p
          id={helperId}
          role={status === 'negative' ? 'alert' : undefined}
          className={cx(FIELD_HELPER, HELPER_BY_STATUS[status])}
        >
          {helperText}
        </p>
      )}
    </div>
  );
}
