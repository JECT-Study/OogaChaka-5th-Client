export type Role = 'parent' | 'child';

export const ROUTES = {
  parent: {
    home: '/parent',
    verify: '/parent/verify',
    market: '/parent/market',
    marketRegister: '/parent/market/register',
    marketDetail: (itemId: number) => `/parent/market/detail?itemId=${itemId}`,
    marketEdit: (itemId: number) => `/parent/market/edit?itemId=${itemId}`,
    settings: '/parent/settings',
  },
  child: {
    home: '/child',
    mission: '/child/mission',
    character: '/child/character',
    market: '/child/market',
    settings: '/child/settings',
  },
} as const;
