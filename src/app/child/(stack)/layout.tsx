import StackLayout from '@/components/layout/StackLayout';

export default function ChildStackLayout({ children }: { children: React.ReactNode }) {
  return <StackLayout>{children}</StackLayout>;
}
