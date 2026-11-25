import type { Role } from '@/constants/routes';

const ROLES: readonly Role[] = ['parent', 'child'];

/**
 * 현재 사용자 역할.
 * TODO: 로그인 기능이 생기면 사용자 정보(API)에서 읽도록 교체한다.
 * 지금은 .env.local 의 NEXT_PUBLIC_DEV_ROLE 값을 쓰고, 값이 없거나 잘못되면 parent로 본다.
 */
export function getCurrentRole(): Role {
  const value = process.env.NEXT_PUBLIC_DEV_ROLE;
  return ROLES.includes(value as Role) ? (value as Role) : 'parent';
}
