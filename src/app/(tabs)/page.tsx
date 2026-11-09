'use client';

import { toast } from 'sonner';

export default function Home() {
  return (
    <section className="flex flex-1 flex-col items-center justify-center gap-4 py-8">
      <h2 className="text-heading-2 text-label-normal font-semibold">토스트 스테이터스 테스트</h2>

      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={() => toast('기본 알림 메시지입니다!')}
          className="bg-primary-normal text-common-0 text-body-1-normal rounded-md px-4 py-2.5 font-medium transition-opacity active:opacity-80"
        >
          기본 토스트 (default)
        </button>

        <button
          type="button"
          onClick={() => toast.success('성공적으로 저장되었습니다!')}
          className="border-line-normal-normal bg-background-elevated-normal text-body-1-normal text-label-normal rounded-md border px-4 py-2.5 font-medium transition-opacity active:opacity-80"
        >
          성공 토스트 (success)
        </button>

        <button
          type="button"
          onClick={() => toast.error('오류가 발생했습니다.')}
          className="border-line-normal-normal bg-background-elevated-normal text-body-1-normal text-label-normal rounded-md border px-4 py-2.5 font-medium transition-opacity active:opacity-80"
        >
          에러 토스트 (error)
        </button>

        <button
          type="button"
          onClick={() => toast.warning('주의가 필요한 작업입니다.')}
          className="border-line-normal-normal bg-background-elevated-normal text-body-1-normal text-label-normal rounded-md border px-4 py-2.5 font-medium transition-opacity active:opacity-80"
        >
          경고 토스트 (warning)
        </button>

        <button
          type="button"
          onClick={() => toast.info('안내 정보 메시지입니다.')}
          className="border-line-normal-normal bg-background-elevated-normal text-body-1-normal text-label-normal rounded-md border px-4 py-2.5 font-medium transition-opacity active:opacity-80"
        >
          안내 토스트 (info)
        </button>
      </div>
    </section>
  );
}
