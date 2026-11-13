export type RequiredSectionTitleProps = {
  title?: string;
  required?: boolean;
};

export default function RequiredSectionTitle({
  title = '상품 사진',
  required = true,
}: RequiredSectionTitleProps) {
  return (
    <h2 className="text-headline-1-normal text-label-normal flex w-full max-w-[335px] items-center gap-1">
      <span>{title}</span>
      {required && (
        <span className="text-status-foreground-danger" aria-label="필수">
          *
        </span>
      )}
    </h2>
  );
}
