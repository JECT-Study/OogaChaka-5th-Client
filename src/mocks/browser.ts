import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';
export const worker = setupWorker(...handlers);

// @ts-expect-error Webpack provides module.hot in development.
if (module.hot) {
  // @ts-expect-error Webpack provides module.hot in development.
  module.hot.accept('./handlers', () => worker.resetHandlers(...handlers));
}

// React Strict Mode에서도 같은 시작 작업을 공유한다.
let startPromise: ReturnType<typeof worker.start> | undefined;
export function startMocking() {
  return (startPromise ??= worker.start());
}
