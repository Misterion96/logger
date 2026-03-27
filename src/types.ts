export type LogLevel = 'debug' | 'info' | 'success' | 'warn' | 'error' | 'none';

export interface LogEntry<T = unknown> {
  /**
   * The severity of the log entry.
   */
  level: LogLevel;

  /**
   * The scope or context of the log entry (e.g., 'Database', 'HTTP').
   */
  scope: string;

  /**
   * The log message.
   */
  message: string;

  /**
   * Additional data or parameters provided to the log call.
   */
  additionalData: T[];

  /**
   * Optional timestamp of the log entry.
   */
  timestamp?: number | undefined;
}

/**
 * Valid methods of the global console object that can be safely used for log output.
 */
export type ConsoleMethod = Extract<keyof Console, 'log' | 'info' | 'warn' | 'error' | 'debug'>;
