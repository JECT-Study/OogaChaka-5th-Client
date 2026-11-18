'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NavCharacter, NavHome, NavMarket, NavMission, NavSettings } from '@/components';

const NAV_ITEM = [
  { href: '/', label: '홈', Icon: NavHome },
  { href: '/mission', label: '미션', Icon: NavMission },
  { href: '/character', label: '캐릭터', Icon: NavCharacter },
  { href: '/market', label: '마켓', Icon: NavMarket },
  { href: '/settings', label: '설정', Icon: NavSettings },
];

export default function Footer() {
  const pathname = usePathname();

  return (
    <nav className="relative z-10 -mt-6.25 shrink-0">
      <div
        aria-hidden="true"
        className="h-6.25 bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,#fcfcfc_90%)]"
      />
      <div className="pb-safe bg-[#fcfcfc]">
        <div className="flex items-center justify-evenly py-3">
          {NAV_ITEM.map(({ href, label, Icon }) => {
            const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
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
