import StackLayout from '@/components/layout/StackLayout';

export default function ParentStackLayout({ children }: { children: React.ReactNode }) {
  return <StackLayout>{children}</StackLayout>;
}
