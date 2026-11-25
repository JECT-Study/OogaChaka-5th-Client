import TabLayout from '@/components/layout/TabLayout';

export default function ChildTabsLayout({ children }: { children: React.ReactNode }) {
  return <TabLayout role="child">{children}</TabLayout>;
}
