'use client';

import { useState, type ComponentProps, type CSSProperties, type ReactNode } from 'react';

import { cx } from '../text/Fieldstyles';

export type FloatButtonVariant = 'primary' | 'neutral';
export type FloatButtonState = 'rest' | 'pressed' | 'focused' | 'disabled';

export type FloatButtonStateColors = {
  background?: string;
  icon?: string;
  border?: string;
};

export type FloatButtonColors = Partial<Record<FloatButtonState, FloatButtonStateColors>>;

export type FloatButtonLabel = string | { rest: string; focused?: string; disabled?: string };

export type FloatButtonProps = Omit<ComponentProps<'button'>, 'color' | 'children'> & {
  icon: ReactNode;
  label?: FloatButtonLabel;
  variant?: FloatButtonVariant;
  colors?: FloatButtonColors;
};

const DEFAULT_LABEL: FloatButtonLabel = {
  rest: 'floating',
  focused: 'floating focused',
  disabled: 'floating disabled',
};

const STATES: FloatButtonState[] = ['rest', 'pressed', 'focused', 'disabled'];

const tone = (token: string, percent: number) =>
  `color-mix(in srgb, var(--color-${token}) ${percent}%, transparent)`;

const DEFAULT_COLORS: Record<
  FloatButtonVariant,
  Record<FloatButtonState, Required<FloatButtonStateColors>>
> = {
  primary: {
    rest: {
      background: 'var(--color-primary-normal)',
      icon: 'var(--color-common-0)',
      border: 'transparent',
    },
    pressed: {
      background: 'var(--color-primary-heavy)',
      icon: 'var(--color-common-0)',
      border: 'transparent',
    },
    focused: {
      background: 'var(--color-primary-subtle)',
      icon: 'var(--color-primary-normal)',
      border: 'var(--color-primary-normal)',
    },
    disabled: {
      background: 'var(--color-interaction-disabled)',
      icon: tone('neutral-40', 34),
      border: 'transparent',
    },
  },
  neutral: {
    rest: {
      background: 'var(--color-background-normal-alternative)',
      icon: tone('neutral-60', 26),
      border: 'transparent',
    },
    pressed: {
      background: 'var(--color-cool-neutral-20)',
      icon: tone('neutral-60', 26),
      border: 'transparent',
    },
    focused: {
      background: 'var(--color-cool-neutral-20)',
      icon: tone('neutral-60', 73),
      border: 'var(--color-cool-neutral-50)',
    },
    disabled: {
      background: 'var(--color-interaction-disabled)',
      icon: tone('neutral-40', 34),
      border: 'transparent',
    },
  },
};

function colorVars(variant: FloatButtonVariant, colors?: FloatButtonColors) {
  const vars: Record<string, string> = {};
  for (const state of STATES) {
    const base = DEFAULT_COLORS[variant][state];
    const custom = colors?.[state];
    vars[`--fb-${state}-bg`] = custom?.background ?? base.background;
    vars[`--fb-${state}-icon`] = custom?.icon ?? base.icon;
    vars[`--fb-${state}-border`] = custom?.border ?? base.border;
  }
  return vars as CSSProperties;
}

export default function FloatButton({
  icon,
  label = DEFAULT_LABEL,
  variant = 'primary',
  colors,
  type = 'button',
  disabled,
  className,
  style,
  onFocus,
  onBlur,
  ...props
}: FloatButtonProps) {
  const [focused, setFocused] = useState(false);

  const text =
    typeof label === 'string'
      ? label
      : disabled
        ? (label.disabled ?? label.rest)
        : focused
          ? (label.focused ?? label.rest)
          : label.rest;

  return (
    <button
      type={type}
      aria-label={text}
      disabled={disabled}
      onFocus={(e) => {
        setFocused(true);
        onFocus?.(e);
      }}
      onBlur={(e) => {
        setFocused(false);
        onBlur?.(e);
      }}
      style={{ ...colorVars(variant, colors), ...style }}
      className={cx(
        'box-border flex size-15 shrink-0 items-center justify-center rounded-full border p-2.5 transition-colors',
        'border-(color:--fb-rest-border) bg-(color:--fb-rest-bg) text-(color:--fb-rest-icon)',
        'focus-visible:border-(color:--fb-focused-border) focus-visible:bg-(color:--fb-focused-bg) focus-visible:text-(color:--fb-focused-icon)',
        'enabled:active:border-(color:--fb-pressed-border) enabled:active:bg-(color:--fb-pressed-bg) enabled:active:text-(color:--fb-pressed-icon)',
        'disabled:shadow-ds-xsmall disabled:cursor-not-allowed disabled:border-(color:--fb-disabled-border) disabled:bg-(color:--fb-disabled-bg) disabled:text-(color:--fb-disabled-icon)',
        variant === 'neutral' && 'shadow-ds-xsmall',
        className,
      )}
      {...props}
    >
      <span
        aria-hidden
        className="flex h-5 flex-col items-center justify-center [&_svg]:text-inherit!"
      >
        {icon}
      </span>
    </button>
  );
}
