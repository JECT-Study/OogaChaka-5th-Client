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
    <nav className="pb-safe items-cetner flex justify-evenly">
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
    </nav>
  );
}
