'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ROUTES } from '@/constants/routes';
// 개발용 덮어쓰기
import { getCurrentRole } from '@/lib/role';

// 현재 역할에 맞는 홈(/parent 또는 /child)으로 보낸다.
export default function RootPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace(ROUTES[getCurrentRole()].home);
  }, [router]);
  return null;
}
