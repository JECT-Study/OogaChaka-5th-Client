import type { ComponentProps } from 'react';

export type TextButtonVariant = 'neutral' | 'primary';
export type TextButtonSize = 'large' | 'medium' | 'small' | 'inline';

export type TextButtonProps = Omit<ComponentProps<'button'>, 'color'> & {
  variant?: TextButtonVariant;
  size?: TextButtonSize;
};

const VARIANT: Record<TextButtonVariant, string> = {
  neutral: 'text-label-neutral',
  primary: 'text-primary-strong',
};

const SIZE: Record<TextButtonSize, string> = {
  large: 'h-10 px-4 rounded-md text-body-1-normal',
  medium: 'h-9 px-[14.008px] rounded-[10.506px] text-label-1-normal',
  small: 'h-8 px-[12.219px] rounded-[9.165px] text-caption-1 tracking-[0.036px]',
  inline: 'h-6 px-1 text-body-1-normal tracking-[-0.352px]',
};

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export default function TextButton({
  variant = 'neutral',
  size = 'large',
  type = 'button',
  className,
  children,
  ...props
}: TextButtonProps) {
  return (
    <button
      type={type}
      className={cx(
        'inline-flex shrink-0 items-center justify-center bg-transparent whitespace-nowrap',
        "font-pretendard [font-feature-settings:'ss10']",
        VARIANT[variant],
        SIZE[size],
        'disabled:text-label-disabled disabled:cursor-not-allowed',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
