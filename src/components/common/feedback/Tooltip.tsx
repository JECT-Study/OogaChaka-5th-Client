import type { ComponentProps } from 'react';

const COLOR_CLASS = {
  dark: 'bg-label-neutral text-static-white',
  white: 'bg-cool-neutral-20 text-label-neutral',
};

const ARROW_CLASS = {
  top: '-top-2 left-[calc(50%-6px)]',
  bottom: '-bottom-2 left-[calc(50%-6px)] rotate-180',
  left: 'top-[calc(50%-4px)] -left-2.5 -rotate-90',
  right: 'top-[calc(50%-4px)] -right-2.5 rotate-90',
};

export type TooltipProps = ComponentProps<'div'> & {
  arrowDirection?: keyof typeof ARROW_CLASS;
  colorType?: keyof typeof COLOR_CLASS;
};

export default function Tooltip({
  arrowDirection = 'bottom',
  colorType = 'dark',
  className,
  children,
  ...props
}: TooltipProps) {
  return (
    <div
      role="tooltip"
      className={`text-label-1-normal relative inline-flex flex-col items-center rounded-md px-3 py-2 ${COLOR_CLASS[colorType]} ${className ?? ''}`}
      {...props}
    >
      {children}
      <span
        aria-hidden="true"
        className={`absolute h-2 w-3 bg-inherit [clip-path:polygon(50%_0,0_100%,100%_100%)] ${ARROW_CLASS[arrowDirection]}`}
      />
    </div>
  );
}
