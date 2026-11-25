import { ChevronLeft, Header, IconButton, MoreVertical } from '@/components';

export default function Home() {
  return (
    <>
      <Header
        type="detail"
        title="메인"
        leading={<IconButton icon={ChevronLeft} label="뒤로가기" />}
        trailing={<IconButton icon={MoreVertical} label="더보기" />}
      />
      <section className="flex flex-1 flex-col items-center justify-between"></section>
    </>
  );
}
