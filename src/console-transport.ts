/* eslint-disable no-console */
import type { Transport } from './transport-interface';
import type { LogEntry, LogLevel, ConsoleMethod } from './types';

/**
 * Configuration options for the ConsoleTransport.
 */
export interface ConsoleTransportOptions {
  /**
   * Mapping from LogLevel to a specific console method (e.g., 'table', 'warn').
   */
  methods?: Partial<Record<LogLevel, ConsoleMethod>>;

  /**
   * Whether to include emojis in the output.
   *
   * @default true
   */
  useEmojis?: boolean;
}

const DEFAULT_EMOJIS: Record<LogLevel, string> = {
  debug: '⚪',
  info: '🔵',
  success: '🟢',
  warn: '🟡',
  error: '🔴',
  none: '',
};

const DEFAULT_LEVEL_METHODS: Record<LogLevel, ConsoleMethod> = {
  error: 'error',
  warn: 'warn',
  debug: 'debug',
  info: 'info',
  success: 'info',
  none: 'log',
};

/**
 * Standard transport that outputs logs to the global console object.
 */
export class ConsoleTransport implements Transport {
  private readonly options: ConsoleTransportOptions;

  constructor(options: ConsoleTransportOptions = {}) {
    this.options = {
      useEmojis: true,
      ...options,
    };
  }

  /**
   * Sends the log entry to the console using the appropriate method.
   *
   * @param entry The log entry to output.
   */
  public send(entry: LogEntry): void {
    const method = this.resolveConsoleMethod(entry.level);
    const prefix = this.formatPrefix(entry);

    // console[method] might be table, log, info, warn, error, debug
    // We cast it slightly here because of the dynamic nature of console methods,
    // but the ConsoleMethod type ensures it's a valid key.
    const consoleFunction = (console[method] as (...argumentsList: unknown[]) => void).bind(console);

    consoleFunction(prefix, ...entry.additionalData);
  }

  /**
   * Determines which console method to use based on the log level and options.
   *
   * @param level The severity level.
   * @returns The name of the console method to call.
   */
  private resolveConsoleMethod(level: LogLevel): ConsoleMethod {
    return this.options.methods?.[level] ?? DEFAULT_LEVEL_METHODS[level];
  }

  /**
   * Formats the prefix of the log message, including emoji and scope.
   *
   * @param entry The log entry.
   * @returns The formatted prefix string.
   */
  private formatPrefix(entry: LogEntry): string {
    const emoji = this.options.useEmojis ? `${DEFAULT_EMOJIS[entry.level]} ` : '';
    const timestamp = entry.timestamp ? `[${new Date(entry.timestamp).toISOString()}] ` : '';
    
    return `${timestamp}${emoji}[${entry.scope}]: ${entry.message}`;
  }
}
