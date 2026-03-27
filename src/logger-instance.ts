import type { LoggerProvider } from './provider-interface';
import type { LogLevel, LogEntry } from './types';

const LOADING_SYMBOLS = ['      🐳', '    🐳  ', '  🐳    ', '🐳      '];
const PROGRESS_TIMEOUT_MILLISECONDS = 250;

/**
 * LoggerInstance provides the logging API for a specific scope.
 */
export class LoggerInstance {
  constructor(
    private readonly provider: LoggerProvider,
    private readonly scope: string,
  ) {}

  /**
   * Logs a debug message if debug is enabled globally.
   */
  public debug(message: string, ...additionalData: unknown[]): void {
    if (this.provider.getSettings().debugEnabled) {
      this.emit('debug', message, additionalData);
    }
  }

  /**
   * Logs an informative message.
   */
  public info(message: string, ...additionalData: unknown[]): void {
    this.emit('info', message, additionalData);
  }

  /**
   * Logs a success message.
   */
  public success(message: string, ...additionalData: unknown[]): void {
    this.emit('success', message, additionalData);
  }

  /**
   * Logs a warning message.
   */
  public warn(message: string, ...additionalData: unknown[]): void {
    this.emit('warn', message, additionalData);
  }

  /**
   * Logs an error message.
   */
  public error(message: string, ...additionalData: unknown[]): void {
    this.emit('error', message, additionalData);
  }

  /**
   * Enables or disables debug logging globally via the factory.
   */
  public setDebug(enabled: boolean): void {
    this.provider.setDebug(enabled, this.scope);
  }

  /**
   * Logic for displaying a loading indicator for a Promise.
   * This method remains standalone and doesn't use transports for its animation,
   * as agreed in the refactoring plan.
   */
  public loading<T>(comment: string, promise: Promise<T>): Promise<T> {
    return this.isNode() 
      ? this.nodeLoading(comment, promise) 
      : this.browserLoading(comment, promise);
  }

  private emit(level: LogLevel, message: string, additionalData: unknown[]): void {
    const settings = this.provider.getSettings();
    const isDebugOverride = level === 'debug' && settings.debugEnabled;
    
    if (isDebugOverride || this.shouldLog(level, settings.level)) {
      const entry: LogEntry = {
        level,
        scope: this.scope,
        message,
        additionalData,
        timestamp: settings.useTimestamps ? Date.now() : undefined,
      };

      settings.transports.forEach((transport) => transport.send(entry));
    }
  }

  private shouldLog(level: LogLevel, minimumLevel: LogLevel): boolean {
    const levels: LogLevel[] = ['debug', 'info', 'success', 'warn', 'error', 'none'];
    const currentPriority = levels.indexOf(level);
    const minimumPriority = levels.indexOf(minimumLevel);
    
    return currentPriority >= minimumPriority;
  }

  private isNode(): boolean {
    return !!process.versions.node;
  }

  private browserLoading<T>(comment: string, promise: Promise<T>): Promise<T> {
    const startTimeMilliseconds = Date.now();

    return promise.then(
      (result) => {
        const durationMilliseconds = Date.now() - startTimeMilliseconds;
        this.success(`${comment} (${durationMilliseconds}ms)`);

        return result;
      },
      (error: unknown) => {
        const durationMilliseconds = Date.now() - startTimeMilliseconds;
        this.error(`${comment} (${durationMilliseconds}ms)`);

        throw error;
      },
    );
  }

  private nodeLoading<T>(comment: string, promise: Promise<T>): Promise<T> {
    if (!process.stdout.isTTY) {
      process.stdout.write(comment);
      promise.then(
        () => process.stdout.write(`   🟢 Success\n`),
        () => process.stdout.write(`   🔴 Failure\n`),
      );

      return promise;
    }

    let symbolIndex = 0;
    const interval = setInterval(() => {
      process.stdout.write(`\r🔄 [${this.scope}]: ${LOADING_SYMBOLS[symbolIndex]}`);
      symbolIndex = (symbolIndex + 1) % LOADING_SYMBOLS.length;
    }, PROGRESS_TIMEOUT_MILLISECONDS);

    const onResolve = () => {
      clearInterval(interval);
      process.stdout.write(`\r🟢 [${this.scope}]: ${comment}\n`);
    };

    const onError = () => {
      clearInterval(interval);
      process.stdout.write(`\r🔴 [${this.scope}]: ${comment}\n`);
    };

    promise.then(onResolve, onError);

    return promise;
  }
}
