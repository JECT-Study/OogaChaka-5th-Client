import type { ComponentType } from 'react';
import {
  NavCharacter,
  NavHome,
  NavMarket,
  NavMission,
  NavSettings,
  NavVerify,
} from '@/components';
import { ROUTES, type Role } from './routes';

export type NavItem = {
  href: string;
  label: string;
  Icon: ComponentType<{ active?: boolean }>;
};

// Figma 하단 탭바: 부모(Guardian) 4개, 자녀 5개
export const NAV_BY_ROLE: Record<Role, NavItem[]> = {
  parent: [
    { href: ROUTES.parent.home, label: '홈', Icon: NavHome },
    { href: ROUTES.parent.verify, label: '인증', Icon: NavVerify },
    { href: ROUTES.parent.market, label: '마켓', Icon: NavMarket },
    { href: ROUTES.parent.settings, label: '설정', Icon: NavSettings },
  ],
  child: [
    { href: ROUTES.child.home, label: '홈', Icon: NavHome },
    { href: ROUTES.child.mission, label: '미션', Icon: NavMission },
    { href: ROUTES.child.character, label: '캐릭터', Icon: NavCharacter },
    { href: ROUTES.child.market, label: '마켓', Icon: NavMarket },
    { href: ROUTES.child.settings, label: '설정', Icon: NavSettings },
  ],
};
