import TabLayout from '@/components/layout/TabLayout';

export default function ParentTabsLayout({ children }: { children: React.ReactNode }) {
  return <TabLayout role="parent">{children}</TabLayout>;
}
