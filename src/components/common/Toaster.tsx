'use client';

import type { ComponentProps } from 'react';
import { Toaster as SonnerToaster } from 'sonner';
import CheckCircle from '@/components/Icon/input/Check';
import ErrorCircle from '@/components/Icon/input/Error';
import WarningCircle from '@/components/Icon/input/Warning';

export type ToasterProps = ComponentProps<typeof SonnerToaster>;

export default function Toaster({ toastOptions, icons, ...props }: ToasterProps) {
  return (
    <SonnerToaster
      position="top-center"
      icons={{
        success: <CheckCircle size={20} />,
        error: <ErrorCircle size={20} />,
        warning: <WarningCircle size={20} />,
        ...icons,
      }}
      toastOptions={{
        ...toastOptions,
        classNames: {
          toast:
            "!rounded-md data-[mounted=true]:!opacity-[0.84] !bg-cool-neutral-90 !text-static-white !border-transparent font-features-['ss10']",
          info: '[&>[data-icon]]:!text-primary-normal',
          ...toastOptions?.classNames,
        },
      }}
      {...props}
    />
  );
}
