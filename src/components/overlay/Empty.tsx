import type { ComponentProps, CSSProperties } from 'react';

import Button from '../common/button/Button';
import { cx } from '../common/text/Fieldstyles';

export type EmptyLength = number | string;

export type EmptyProps = Omit<ComponentProps<'div'>, 'title'> & {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  width?: EmptyLength;
  height?: EmptyLength;
};

const toCssLength = (value: EmptyLength) => (typeof value === 'number' ? `${value}px` : value);

const ACTION_STYLE = {
  '--button-border': 'var(--color-line-normal-normal)',
  borderWidth: '1.3px',
} as CSSProperties;

export default function Empty({
  title,
  description,
  actionLabel,
  onAction,
  width = '100%',
  height = 'auto',
  className,
  style,
  ...props
}: EmptyProps) {
  return (
    <div
      {...props}
      style={{
        width: toCssLength(width),
        height: toCssLength(height),
        ...style,
      }}
      className={cx(
        'font-pretendard flex flex-col items-center gap-8 self-stretch px-5 py-6 text-center [font-feature-settings:"ss10"]',
        className,
      )}
    >
      <p className="text-heading-2 text-label-normal leading-[1.4] font-semibold tracking-[-0.048px]">
        {title}
      </p>

      {description && (
        <p className="text-body-1-reading text-neutral-60 leading-6 font-normal tracking-[0.014px] text-pretty whitespace-pre-line">
          {description}
        </p>
      )}

      {actionLabel && (
        <Button
          size="medium"
          variant="primary"
          appearance="outlined"
          width="100%"
          style={ACTION_STYLE}
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
