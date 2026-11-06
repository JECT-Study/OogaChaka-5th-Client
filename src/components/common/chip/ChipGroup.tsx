'use client';

import type { ReactNode } from 'react';

import Chip, { type ChipColors, type ChipLength, type ChipSize, type ChipVariant } from './Chip';
import { cx } from '../text/Fieldstyles';

export type ChipOption = {
  value: string;
  label: ReactNode;
  disabled?: boolean;
  width?: ChipLength;
  height?: ChipLength;
};

type ChipGroupBaseProps = {
  options: ChipOption[];
  size?: ChipSize;
  variant?: ChipVariant;
  selectedVariant?: ChipVariant;
  outlined?: boolean;
  colors?: ChipColors;
  chipWidth?: ChipLength;
  chipHeight?: ChipLength;
  label?: string;
  className?: string;
};

type SingleProps = ChipGroupBaseProps & {
  multiple?: false;
  value: string | null;
  onChange: (value: string | null) => void;
};

type MultipleProps = ChipGroupBaseProps & {
  multiple: true;
  value: string[];
  onChange: (value: string[]) => void;
};

export type ChipGroupProps = SingleProps | MultipleProps;

export default function ChipGroup(props: ChipGroupProps) {
  const {
    options,
    size,
    variant = 'neutral',
    selectedVariant = 'primary',
    outlined,
    colors,
    chipWidth,
    chipHeight,
    label,
    className,
  } = props;

  const isSelected = (value: string) =>
    props.multiple ? props.value.includes(value) : props.value === value;

  const toggle = (value: string) => {
    if (props.multiple) {
      props.onChange(
        props.value.includes(value)
          ? props.value.filter((item) => item !== value)
          : [...props.value, value],
      );
      return;
    }
    props.onChange(props.value === value ? null : value);
  };

  return (
    <div role="group" aria-label={label} className={cx('flex flex-wrap gap-2', className)}>
      {options.map((option) => {
        const selected = isSelected(option.value);
        return (
          <Chip
            key={option.value}
            size={size}
            outlined={outlined}
            colors={colors}
            width={option.width ?? chipWidth}
            height={option.height ?? chipHeight}
            variant={selected ? selectedVariant : variant}
            selected={selected}
            disabled={option.disabled}
            onClick={() => toggle(option.value)}
          >
            {option.label}
          </Chip>
        );
      })}
    </div>
  );
}
