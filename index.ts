/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/prefer-optional-chain */

export function isNode(): boolean {
  return typeof process !== 'undefined' && !!(process.versions && process.versions.node);
}
function getNow(){
  return (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now()
}

const SYMBOLS = ['      🐳', '    🐳  ', '  🐳    ', '🐳      '];
const PROGRESS_TIMEOUT = 250;

interface Options {
  scope: string;
}

export default function createLogger(options: Options) {
  let debugEnabled = false;

  const scope = `[${options.scope}]`;
  /**
   * Enables or disables debugging messages.
   *
   * @param enabled Whether debugging messages should be logged.
   */
  function setDebug(enabled: boolean) {
    info(enabled ? 'Debug is enabled' : 'Debug is disabled');
    debugEnabled = enabled;
  }
  /**
   * Logs a debug message to the console if debugging is enabled.
   *
   * @param message The message.
   * @param args other args
   */
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  function debug(message: string, ...args: any[]) {
    if (debugEnabled) {
      console.log(`⚪ ${scope}: ${message}`, ...args);
    }
  }
  /**
   * Logs an informative message to the console.
   *
   * @param message The message.
   * @param args other args
   */
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  function info(message: string, ...args: any[]) {
    console.log(`🔵 ${scope}: ${message}`, ...args);
  }
  /**
   * Logs a success to the console.
   *
   * @param message The message.
   * @param args other args
   */
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  function success(message: string, ...args: any[]) {
    console.log(`🟢 ${scope}: ${message}`, ...args);
  }
  /**
   * Logs a warning message to the console.
   *
   * @param message The message.
   * @param args other args
   */
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  function warn(message: string, ...args: any[]) {
    console.log(`🟡 ${scope}: ${message}`, ...args);
  }
  /**
   * Logs an error message to the console.
   *
   * @param message The message.
   * @param args other args
   */
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  function error(message: string, ...args: any[]) {
    console.log(`🔴 ${scope}: ${message}`, ...args);
  }

  function _browserLoading<T>(comment: string, promise: Promise<T>): Promise<T> {
    const start = getNow()

    const getMs = () => {
      const end = getNow()

      return Math.round(end - start);
    }

    return promise.then(
      (res) => {

        console.log(`🟢 ${scope}: ${comment} (${getMs()}ms)`);

        return res;
      },
      (err: unknown) => {
        console.error(`🔴 ${scope}: ${comment} (${getMs()}ms)`);

        throw err;
      },
    );
  }

  function _nodeLoading<T>(comment: string, promise: Promise<T>): Promise<T> {
    if (!process.stdout.isTTY) {
      // Simple stdout without animations
      process.stdout.write(comment);
      promise.then(
        () => process.stdout.write(`   🟢 Success\n`),
        () => process.stdout.write(`   🔴 Failure\n`),
      );

      return promise;
    }
    let symbolIndex = 0;

    const interval = setInterval(() => {

      process.stdout.write(`\r🔄${scope}: ${SYMBOLS[symbolIndex]}`);
      symbolIndex = (symbolIndex + 1) % SYMBOLS.length;
    }, PROGRESS_TIMEOUT);

    const onSuccess = () => {
      clearInterval(interval);
      process.stdout.write(`\r🟢 ${scope}: ${comment}\n`);
    };

    const onReject = () => {
      clearInterval(interval);
      process.stdout.write(`\r🔴 ${scope}: ${comment}\n`);
    };

    promise.then(onSuccess, onReject);

    return promise;
  }

  /**
   * Shows a loading indicator for a Promise until it resolves.
   *
   * @param comment Comment to display.
   * @param promise The promise to watch.
   * @returns The promise passed in parameter. Useful for decorating without using a buffer variable.
   */

  function loading<T>(comment: string, promise: Promise<T>): Promise<T> {
    return isNode() ? _nodeLoading(comment, promise) : _browserLoading(comment, promise)
  }

  return {
    loading,
    setDebug,
    info,
    error,
    warn,
    debug,
    success,
  };
}
