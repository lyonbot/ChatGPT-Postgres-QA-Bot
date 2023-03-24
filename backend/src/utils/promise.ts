/**
 * Delay and resolve
 */
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Retry a function with exponential backoff delay
 * 
 * @param fn The function to retry
 * @param retries The number of times to retry
 * @param delay The delay between retries
 */
export const retry = async <T>(fn: () => Promise<T>, retries = 3, delayMs = 1000): Promise<T> => {
  try {
    return await fn();
  } catch (err) {
    if (retries === 0) throw err;

    await delay(delayMs);
    return retry(fn, retries - 1, delayMs * 2);
  }
}

export type MaybePromise<T> = T | Promise<T>;
