'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_BY_ROLE } from '@/constants/navigation';
import type { Role } from '@/constants/routes';

function normalize(path: string) {
  return path.length > 1 ? path.replace(/\/+$/, '') : path;
}

export default function Footer({ role }: { role: Role }) {
  const pathname = normalize(usePathname());
  const items = NAV_BY_ROLE[role];
  // 첫 번째 탭(홈)은 정확히 일치할 때만, 나머지는 하위 경로까지 활성화한다.
  const homeHref = items[0]?.href;

  return (
    <nav className="relative z-10 -mt-6.25 shrink-0">
      <div
        aria-hidden="true"
        className="h-6.25 bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,#fcfcfc_90%)]"
      />
      <div className="pb-safe bg-[#fcfcfc]">
        {/* Figma Bottom Navigation Bar/Guardian·Child 공통: 좌우 36px + 양 끝 정렬 */}
        <div className="flex items-start justify-between px-9 py-3">
          {items.map(({ href, label, Icon }) => {
            const active =
              href === homeHref
                ? pathname === href
                : pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                aria-label={label}
                aria-current={active ? 'page' : undefined}
              >
                <Icon active={active} />
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
