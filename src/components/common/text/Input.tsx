'use client';

import { useId, useRef, type ComponentProps } from 'react';

import CloseCircle from '@/components/Icon/input/Close';
import CheckCircle from '@/components/Icon/input/Check';
import ErrorCircle from '@/components/Icon/input/Error';

import {
  FIELD_BOX,
  FIELD_BOX_DISABLED,
  FIELD_BOX_ENABLED,
  FIELD_HELPER,
  FIELD_TEXT,
  FIELD_TEXT_COLOR,
  cx,
  type FieldTextColor,
  setRef,
} from '../text/Fieldstyles';

export type InputStatus = 'normal' | 'negative' | 'positive';

export type InputProps = Omit<ComponentProps<'input'>, 'size' | 'width' | 'height'> & {
  status?: InputStatus;
  helperText?: string;
  /** 값이 있고 포커스일 때 보이는 지우기 버튼 동작. 없으면 버튼을 그리지 않음 */
  onClear?: () => void;
  /** 입력 글자색. 기본 black */
  textColor?: FieldTextColor;
  /** 바깥 래퍼(박스 + helper)에 적용 */
  className?: string;
  /** 전체 너비. 숫자는 px, 문자열은 그대로(예: '50%'). 기본은 부모 너비 100% */
  width?: number | string;
  /** 입력 박스 높이. 숫자는 px. 기본 48px(Figma Large) */
  height?: number | string;
};

// TODO: Figma Dev Mode로 Negative/Positive 테두리 변수명과 두께(1.5px) 확인
const BORDER_DEFAULT = 'border-neutral-40';

const BOX_BY_STATUS: Record<InputStatus, string> = {
  normal: `${BORDER_DEFAULT} focus-within:border-periwinkle-400`,
  negative: 'border-cinnabar-300',
  positive: 'border-twilight-indigo-300',
};

export default function Input({
  status = 'normal',
  helperText,
  onClear,
  disabled,
  textColor = 'black',
  className,
  width,
  height,
  ref,
  id,
  value,
  ...props
}: InputProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const helperId = `${inputId}-helper`;
  const innerRef = useRef<HTMLInputElement | null>(null);

  const hasValue = value != null && String(value).length > 0;
  const showClear = !disabled && status === 'normal' && !!onClear && hasValue;

  const handleClear = () => {
    onClear?.();
    innerRef.current?.focus();
  };

  return (
    <div
      className={cx('gap-field-message-gap-max flex w-full flex-col', className)}
      style={{ width }}
    >
      <div
        style={{ height }}
        onClick={() => innerRef.current?.focus()}
        className={cx(
          'px-field-padding-x-max flex h-12 w-full items-center gap-3',
          FIELD_BOX,
          disabled ? FIELD_BOX_DISABLED : cx(FIELD_BOX_ENABLED, BOX_BY_STATUS[status]),
        )}
      >
        <input
          ref={(node) => {
            innerRef.current = node;
            setRef(ref, node);
          }}
          id={inputId}
          value={value}
          disabled={disabled}
          aria-invalid={status === 'negative' || undefined}
          aria-describedby={helperText ? helperId : undefined}
          className={cx(
            'min-w-0 flex-1 bg-transparent text-ellipsis outline-none',
            FIELD_TEXT,
            FIELD_TEXT_COLOR[textColor],
          )}
          {...props}
        />

        {/* 20px 아이콘 자리는 항상 확보 (패딩 16 + gap 12 + 아이콘 20 = Figma 오른쪽 48) */}
        <span className="flex size-5 shrink-0 items-center justify-center">
          {showClear && (
            <button
              type="button"
              tabIndex={-1}
              aria-label="입력값 지우기"
              onMouseDown={(e) => e.preventDefault()}
              onClick={handleClear}
              className="flex"
            >
              <CloseCircle aria-hidden />
            </button>
          )}
          {!disabled && status === 'negative' && <ErrorCircle aria-hidden />}
          {!disabled && status === 'positive' && <CheckCircle aria-hidden />}
        </span>
      </div>

      {helperText && (
        <p
          id={helperId}
          role={status === 'negative' ? 'alert' : undefined}
          className={cx(FIELD_HELPER, 'text-neutral-60/73 line-clamp-1 text-ellipsis')}
        >
          {helperText}
        </p>
      )}
    </div>
  );
}
