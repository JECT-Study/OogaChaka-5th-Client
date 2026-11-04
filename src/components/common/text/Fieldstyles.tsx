import type { Ref } from 'react';

export function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export function setRef<T>(ref: Ref<T> | undefined, node: T | null) {
  if (typeof ref === 'function') ref(node);
  else if (ref) (ref as { current: T | null }).current = node;
}

export const FIELD_BOX = 'rounded-md border-[1.5px] shadow-ds-xsmall transition-colors';
export const FIELD_BOX_ENABLED = 'bg-transparent';
export const FIELD_BOX_DISABLED = 'bg-interaction-disabled border-transparent';

export const FIELD_TEXT =
  "font-pretendard text-body-1-reading leading-6 tracking-[0.014px] [font-feature-settings:'ss10'] placeholder:text-interaction-inactive disabled:text-interaction-inactive";

export type FieldTextColor = 'black' | 'gray';
export const FIELD_TEXT_COLOR: Record<FieldTextColor, string> = {
  black: 'text-label-normal',
  gray: 'text-neutral-60',
};

export const FIELD_HELPER =
  "font-pretendard text-caption-1 tracking-[0.036px] [font-feature-settings:'ss10'] px-1";
