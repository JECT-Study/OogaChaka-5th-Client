import {
  useState,
  type ComponentProps,
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
} from 'react';

import { cx } from '../text/Fieldstyles';

export type ButtonSize = 'large' | 'medium' | 'small';
export type ButtonVariant = 'primary' | 'neutral';
export type ButtonAppearance = 'filled' | 'outlined';
export type ButtonState = 'normal' | 'pressed' | 'focused' | 'disabled';

export type ButtonLength = number | string;

export type ButtonProps = Omit<ComponentProps<'button'>, 'color'> & {
  size?: ButtonSize;
  variant?: ButtonVariant;
  appearance?: ButtonAppearance;

  leftCheckbox?: boolean;
  rightCheckbox?: boolean;

  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  state?: ButtonState;
  width?: ButtonLength;
  height?: ButtonLength;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  iconGap?: number;
};

const token = (name: string) => `var(--color-${name})`;

const toCssLength = (value: ButtonLength) => (typeof value === 'number' ? `${value}px` : value);

const PALETTE = {
  primary: {
    filled: {
      normal: {
        bg: token('primary-strong'),
        text: token('static-white'),
        border: 'transparent',
      },
      pressed: {
        bg: token('primary-heavy'),
        text: token('static-white'),
        border: 'transparent',
      },
      disabled: {
        bg: token('interaction-disabled'),
        text: token('label-disabled'),
        border: 'transparent',
      },
    },
    outlined: {
      normal: {
        bg: token('primary-subtle'),
        text: token('primary-strong'),
        border: token('periwinkle-300'),
      },
      pressed: {
        bg: token('periwinkle-100'),
        text: token('primary-strong'),
        border: token('periwinkle-300'),
      },
      disabled: {
        bg: 'transparent',
        text: token('label-disabled'),
        border: token('cool-neutral-10'),
      },
    },
  },
  neutral: {
    filled: {
      normal: {
        bg: token('cool-neutral-50'),
        text: token('static-white'),
        border: 'transparent',
      },
      pressed: {
        bg: token('cool-neutral-80'),
        text: token('static-white'),
        border: 'transparent',
      },
      disabled: {
        bg: token('interaction-disabled'),
        text: token('label-disabled'),
        border: 'transparent',
      },
    },
    outlined: {
      normal: {
        bg: 'transparent',
        text: token('label-normal'),
        border: token('line-normal-strong'),
      },
      pressed: {
        bg: token('neutral-5'),
        text: token('label-normal'),
        border: token('line-normal-strong'),
      },
      disabled: {
        bg: 'transparent',
        text: token('label-disabled'),
        border: token('cool-neutral-10'),
      },
    },
  },
} as const;

const SIZE = {
  large: {
    box: 'text-heading-2 font-semibold leading-[1.4] tracking-[-0.048px]',
    padding: 'px-4 py-4',
    radius: 'rounded-md',
  },
  medium: {
    box: 'h-10 text-body-1-normal font-semibold leading-[1.5] tracking-[-0.352px]',
    padding: 'px-2 py-[10px]',
    radius: 'rounded-sm',
  },
  small: {
    box: 'text-label-1-normal font-bold leading-[1.429] tracking-[0.028px]',
    padding: 'px-3 py-2',
    radius: 'rounded-sm',
  },
} as const;

const BASE =
  "inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap font-pretendard [font-feature-settings:'ss10'] transition-colors [-webkit-tap-highlight-color:transparent] disabled:cursor-not-allowed disabled:bg-(color:--button-disabled-bg) disabled:text-(color:--button-disabled-text)";

function getButtonStyle(
  variant: ButtonVariant,
  appearance: ButtonAppearance,
  width?: ButtonLength,
  height?: ButtonLength,
  iconGap = 5,
): CSSProperties {
  const palette = PALETTE[variant][appearance];

  return {
    '--button-bg': palette.normal.bg,
    '--button-text': palette.normal.text,
    '--button-border': palette.normal.border,

    '--button-pressed-bg': palette.pressed.bg,
    '--button-pressed-text': palette.pressed.text,
    '--button-pressed-border': palette.pressed.border,

    '--button-disabled-bg': palette.disabled.bg,
    '--button-disabled-text': palette.disabled.text,
    '--button-disabled-border': palette.disabled.border,

    width: width !== undefined ? toCssLength(width) : undefined,
    height: height !== undefined ? toCssLength(height) : undefined,
    gap: `${iconGap}px`,
  } as CSSProperties;
}

/** 제공된 Shape_default.svg의 형태를 currentColor로 표현 */
function ButtonCheckbox({ checked }: { checked: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      {checked ? (
        <path
          d="M4 10.5L8 14.5L16 5.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <>
          <rect
            x="2.5"
            y="2.5"
            width="15"
            height="15"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="2 2"
          />
        </>
      )}
    </svg>
  );
}

export default function Button({
  size = 'large',
  variant = 'primary',
  appearance = 'filled',

  leftCheckbox = false,
  rightCheckbox = false,

  checked,
  defaultChecked = false,
  onCheckedChange,

  state = 'normal',

  width,
  height,
  iconGap = 5,

  leftIcon,
  rightIcon,

  type = 'button',
  disabled,
  className,
  style,
  children,
  onClick,
  ...props
}: ButtonProps) {
  const [internalChecked, setInternalChecked] = useState(defaultChecked);

  const isControlled = checked !== undefined;
  const isChecked = isControlled ? checked : internalChecked;

  const isDisabled = disabled || state === 'disabled';
  const checkable = leftCheckbox || rightCheckbox;

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);

    if (event.defaultPrevented || isDisabled || !checkable) {
      return;
    }

    const next = !isChecked;

    if (!isControlled) {
      setInternalChecked(next);
    }

    onCheckedChange?.(next);
  };

  const forcedState = state === 'normal' && isDisabled ? 'disabled' : state;

  const buttonStyle = {
    ...getButtonStyle(variant, appearance, width, height, iconGap),
    ...style,
  } as CSSProperties;

  return (
    <button
      {...props}
      type={type}
      disabled={isDisabled}
      aria-pressed={checkable ? isChecked : undefined}
      data-state={forcedState}
      data-variant={variant}
      data-appearance={appearance}
      onClick={handleClick}
      style={buttonStyle}
      className={cx(
        BASE,
        SIZE[size].box,
        SIZE[size].padding,
        SIZE[size].radius,

        'bg-(color:--button-bg)',
        'text-(color:--button-text)',

        appearance === 'outlined' && 'border border-(color:--button-border)',

        'enabled:active:bg-(color:--button-pressed-bg)',
        'enabled:active:text-(color:--button-pressed-text)',

        appearance === 'outlined' && 'enabled:active:border-(color:--button-pressed-border)',

        'focus-visible:outline-2',
        'focus-visible:outline-offset-2',
        'focus-visible:outline-(color:--color-primary-normal)',

        'data-[state=pressed]:bg-(color:--button-pressed-bg)',
        'data-[state=pressed]:text-(color:--button-pressed-text)',

        state === 'focused' && 'outline-2 outline-offset-2 outline-(color:--color-primary-normal)',

        'disabled:bg-(color:--button-disabled-bg)',
        'disabled:text-(color:--button-disabled-text)',

        appearance === 'outlined' && 'disabled:border-(color:--button-disabled-border)',

        className,
      )}
    >
      {(leftCheckbox || leftIcon) && (
        <span className="inline-flex shrink-0 items-center justify-center">
          {leftCheckbox ? <ButtonCheckbox checked={isChecked} /> : leftIcon}
        </span>
      )}

      {children}

      {(rightCheckbox || rightIcon) && (
        <span className="inline-flex shrink-0 items-center justify-center">
          {rightCheckbox ? <ButtonCheckbox checked={isChecked} /> : rightIcon}
        </span>
      )}
    </button>
  );
}
