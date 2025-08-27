
export const withTimeout = (promise, ms = 15000, label = 'request') => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(`${label} timed out after ${ms}ms`), ms);
  return {
    signal: controller.signal,
    exec: promise.finally(() => clearTimeout(timer)),
  };
};
