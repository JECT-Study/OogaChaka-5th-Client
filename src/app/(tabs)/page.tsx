'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { snackbar } from '@/components';

const secondaryButtonClassName =
  'border-line-normal-normal bg-background-elevated-normal text-body-1-normal text-label-normal rounded-md border px-4 py-2.5 font-medium transition-opacity active:opacity-80';

export default function Home() {
  const router = useRouter();

  return (
    <section className="flex flex-1 flex-col items-center py-8">
      <div className="mt-auto flex flex-col gap-3">
        <button
          type="button"
          onClick={() => toast.success('성공적으로 저장되었습니다!')}
          className={secondaryButtonClassName}
        >
          성공 토스트 (success)
        </button>

        <button
          type="button"
          onClick={() => toast.error('오류가 발생했습니다.')}
          className={secondaryButtonClassName}
        >
          에러 토스트 (error)
        </button>

        <button
          type="button"
          onClick={() => toast.warning('주의가 필요한 작업입니다.')}
          className={secondaryButtonClassName}
        >
          경고 토스트 (warning)
        </button>

        <button
          type="button"
          onClick={() =>
            snackbar('메시지에 마침표를 찍어요.', {
              message: true,
              action: { label: '바로 가기', onClick: () => router.push('/mission') },
            })
          }
          className={secondaryButtonClassName}
        >
          메시지에 마침표를 찍어요.
        </button>

        <button
          type="button"
          onClick={() => snackbar('메시지', { message: false })}
          className={secondaryButtonClassName}
        >
          메시지
        </button>
      </div>
    </section>
  );
}
