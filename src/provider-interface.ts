import type { Transport } from './transport-interface';
import type { LogLevel } from './types';

/**
 * Configuration options for the LoggerFactory.
 */
export interface FactoryOptions {
  /**
   * The minimum log level to output.
   * Logs below this level will be ignored.
   */
  level?: LogLevel;

  /**
   * Whether debug logging is globally enabled.
   */
  debugEnabled?: boolean;

  /**
   * List of transports to use for log output.
   */
  transports?: Transport[];

  /**
   * Whether to automatically include timestamps in log entries.
   */
  useTimestamps?: boolean;
}

/**
 * Interface for factory management required by LoggerInstance to avoid circular dependency.
 */
export interface LoggerProvider {
  getSettings(): Required<FactoryOptions>;
  setDebug(enabled: boolean, triggeringScope?: string): void;
}
