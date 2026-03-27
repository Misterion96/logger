import type { LogEntry } from './types';

/**
 * Transport represents an output destination for logs (e.g., Console, File, Sentry).
 */
export interface Transport {
  /**
   * Sends a log entry to the destination.
   *
   * @param entry The log entry to send.
   */
  send(entry: LogEntry): void;
}
