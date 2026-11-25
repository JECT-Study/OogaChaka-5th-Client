'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ROUTES } from '@/constants/routes';

// TODO: 로그인·역할 정보가 생기면 역할에 맞는 홈(/parent 또는 /child)으로 보낸다.
export default function RootPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace(ROUTES.parent.home);
  }, [router]);
  return null;
}
