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

const LINE_HEIGHT = 24;

export type TextAreaProps = Omit<ComponentProps<'textarea'>, 'cols' | 'style'> & {
  status?: TextAreaStatus;
  helperText?: string;
  actionLabel?: string;
  onAction?: () => void;
  actionType?: 'button' | 'submit';
  actionDisabled?: boolean;
  textColor?: FieldTextColor;
  className?: string;
  width?: number | string;
  height?: number | string;
  maxRows?: number;
};

const BOX_BY_STATUS: Record<TextAreaStatus, string> = {
  normal: 'border-line-solid-normal focus-within:border-periwinkle-400',
  negative: 'border-cinnabar-300 focus-within:border-cinnabar-400',
  positive: 'border-twilight-indigo-300',
};

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
      <div
        style={{ height }}
        onClick={(e) => {
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
