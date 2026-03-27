import { ConsoleTransport } from './console-transport';
import { LoggerInstance } from './logger-instance';

import type { FactoryOptions, LoggerProvider } from './provider-interface';
import type { LogLevel } from './types';

/**
 * LoggerFactory manages global logging configuration and creates Logger instances.
 */
export class LoggerFactory implements LoggerProvider {
  private options: Required<FactoryOptions>;

  constructor(options: FactoryOptions = {}) {
    this.options = {
      level: options.level ?? 'info',
      debugEnabled: options.debugEnabled ?? false,
      transports: options.transports ?? [new ConsoleTransport()],
      useTimestamps: options.useTimestamps ?? false,
    };
  }

  /**
   * Creates a new Logger instance with a specific scope.
   *
   * @param options Configuration for the new logger.
   * @returns A new Logger instance.
   */
  public createLogger(options: { scope: string }): LoggerInstance {
    return new LoggerInstance(this, options.scope);
  }

  /**
   * Globally enables or disables debug logging.
   *
   * @param enabled Whether debug logging should be enabled.
   */
  public setDebug(enabled: boolean, triggeringScope?: string): void {
    this.options.debugEnabled = enabled;
    const message = `Debug is ${enabled ? 'enabled' : 'disabled'}`;
    this.logInternal('info', triggeringScope ?? 'System', message);
  }

  /**
   * Sets the global minimum log level.
   *
   * @param level The new minimum log level.
   */
  public setLevel(level: LogLevel): void {
    this.options.level = level;
  }

  /**
   * Gets the current factory options.
   */
  public getSettings(): Required<FactoryOptions> {
    return { ...this.options };
  }

  /**
   * Internal logging helper for factory-level messages.
   */
  private logInternal(level: LogLevel, scope: string, message: string): void {
    const entry = {
      level,
      scope,
      message,
      additionalData: [],
      timestamp: this.options.useTimestamps ? Date.now() : undefined,
    };

    this.options.transports.forEach((transport) => transport.send(entry));
  }
}
