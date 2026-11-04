import { useCallback, useState, type ChangeEvent } from 'react';

/**
 *
 * const field = useTextField('', 800);
 * <TextArea {...field.props} actionLabel="지우기" onAction={field.clear} />
 * <Input {...field.props} onClear={field.clear} />
 */
export function useTextField(initialValue = '', maxLength?: number) {
  const [value, setValue] = useState(initialValue);

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setValue(e.target.value),
    [],
  );
  const clear = useCallback(() => setValue(''), []);

  return {
    value,
    setValue,
    count: value.length,
    clear,
    props: { value, onChange, maxLength },
  };
}
