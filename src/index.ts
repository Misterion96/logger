import { LoggerFactory } from './logger-factory';
import { LoggerInstance } from './logger-instance';

// Re-export core classes and types for advanced users
export { LoggerFactory } from './logger-factory';
export { ConsoleTransport } from './console-transport';
export { LoggerInstance } from './logger-instance';
export type { Transport } from './transport-interface';
export type { LogLevel, LogEntry, ConsoleMethod } from './types';
export type { FactoryOptions, LoggerProvider } from './provider-interface';

// Default singleton factory for backwards compatibility with the createLogger() function
const DEFAULT_FACTORY = new LoggerFactory();

/**
 * Creates a new logger with the specified scope using the default factory.
 *
 * @param options Configuration options for the logger.
 * @returns A LoggerInstance.
 */
export default function createLogger(options: { scope: string }): LoggerInstance {
  return DEFAULT_FACTORY.createLogger(options);
}
