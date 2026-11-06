import type { ComponentProps, CSSProperties } from 'react';

import { cx } from '../text/Fieldstyles';

export type ChipVariant = 'neutral' | 'primary';
export type ChipSize = 'large' | 'medium' | 'small';
export type ChipLength = number | string;
export type ChipState = 'rest' | 'pressed' | 'selected' | 'disabled';

export type ChipStateColors = {
  background?: string;
  text?: string;
  border?: string;
};

export type ChipColors = Partial<Record<ChipState, ChipStateColors>>;

export type ChipProps = Omit<ComponentProps<'button'>, 'color'> & {
  variant?: ChipVariant;
  size?: ChipSize;
  outlined?: boolean;
  selected?: boolean;
  colors?: ChipColors;
  width?: ChipLength;
  height?: ChipLength;
};

type StateColors = Required<ChipStateColors>;
type Palette = Record<'rest' | 'pressed' | 'disabled', StateColors>;

const toCssLength = (value: ChipLength) => (typeof value === 'number' ? `${value}px` : value);

const token = (name: string) => `var(--color-${name})`;
const colors = (background: string, text: string, border: string): StateColors => ({
  background,
  text,
  border,
});

const TRANSPARENT = token('background-transparent-normal');
const DISABLED_TEXT = token('label-disabled');
const OUTLINED_NEUTRAL_TEXT = 'color-mix(in srgb, var(--color-neutral-60) 74%, transparent)';

const PALETTE: Record<ChipVariant, Record<'filled' | 'outlined', Palette>> = {
  neutral: {
    filled: {
      rest: colors(token('neutral-5'), token('label-neutral'), 'transparent'),
      pressed: colors(token('neutral-10'), token('label-neutral'), 'transparent'),
      disabled: colors(token('interaction-disabled'), DISABLED_TEXT, 'transparent'),
    },
    outlined: {
      rest: colors(TRANSPARENT, OUTLINED_NEUTRAL_TEXT, token('cool-neutral-10')),
      pressed: colors(token('neutral-10'), OUTLINED_NEUTRAL_TEXT, token('cool-neutral-10')),
      disabled: colors(TRANSPARENT, DISABLED_TEXT, token('cool-neutral-10')),
    },
  },
  primary: {
    filled: {
      rest: colors(token('primary-subtle'), token('primary-strong'), 'transparent'),
      pressed: colors(token('periwinkle-100'), token('primary-strong'), 'transparent'),
      disabled: colors(token('interaction-disabled'), DISABLED_TEXT, 'transparent'),
    },
    outlined: {
      rest: colors(token('primary-subtle'), token('primary-strong'), token('periwinkle-300')),
      pressed: colors(token('periwinkle-100'), token('primary-strong'), token('periwinkle-300')),
      disabled: colors(TRANSPARENT, DISABLED_TEXT, token('cool-neutral-10')),
    },
  },
};

const SIZE: Record<ChipSize, { box: string; filled: string; outlined: string }> = {
  large: {
    box: 'h-10 text-body-1-normal tracking-[-0.352px]',
    filled: 'rounded-sm px-3.5',
    outlined: 'rounded-[10px] px-[13px]',
  },
  medium: {
    box: 'h-7 text-[14px] font-medium leading-[1.429] tracking-[0.028px]',
    filled: 'rounded-sm px-2.5',
    outlined: 'rounded-sm px-[9px]',
  },
  small: {
    box: 'h-[23px] text-[12px] font-medium leading-[1.273] tracking-[0.041px]',
    filled: 'rounded-sm px-[7px]',
    outlined: 'rounded-[6px] px-1.5',
  },
};

const BASE =
  "inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap font-pretendard [font-feature-settings:'ss10'] transition-colors [-webkit-tap-highlight-color:transparent] bg-(color:--chip-rest-bg) text-(color:--chip-rest-text) enabled:active:bg-(color:--chip-pressed-bg) enabled:active:text-(color:--chip-pressed-text) disabled:bg-(color:--chip-disabled-bg) disabled:text-(color:--chip-disabled-text) disabled:cursor-not-allowed";

const OUTLINE =
  'border border-(color:--chip-rest-border) enabled:active:border-(color:--chip-pressed-border) disabled:border-(color:--chip-disabled-border)';

function colorVars(
  variant: ChipVariant,
  outlined: boolean,
  selected: boolean,
  custom?: ChipColors,
) {
  const base = PALETTE[variant][outlined ? 'outlined' : 'filled'];
  const merge = (fallback: StateColors, over?: ChipStateColors): StateColors => ({
    background: over?.background ?? fallback.background,
    text: over?.text ?? fallback.text,
    border: over?.border ?? fallback.border,
  });

  const pressed = merge(base.pressed, custom?.pressed);
  const disabled = merge(base.disabled, custom?.disabled);
  const rest = selected ? merge(pressed, custom?.selected) : merge(base.rest, custom?.rest);

  const vars: Record<string, string> = {};
  for (const [name, value] of [
    ['rest', rest],
    ['pressed', pressed],
    ['disabled', disabled],
  ] as const) {
    vars[`--chip-${name}-bg`] = value.background;
    vars[`--chip-${name}-text`] = value.text;
    vars[`--chip-${name}-border`] = value.border;
  }
  return vars as CSSProperties;
}

export default function Chip({
  variant = 'neutral',
  size = 'medium',
  outlined = false,
  selected,
  colors: customColors,
  width,
  height,
  type = 'button',
  className,
  style,
  children,
  ...props
}: ChipProps) {
  return (
    <button
      type={type}
      aria-pressed={selected}
      style={{
        ...colorVars(variant, outlined, !!selected, customColors),
        ...(width !== undefined && { width: toCssLength(width) }),
        ...(height !== undefined && { height: toCssLength(height) }),
        ...style,
      }}
      className={cx(
        BASE,
        SIZE[size].box,
        outlined ? SIZE[size].outlined : SIZE[size].filled,
        outlined && OUTLINE,
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
