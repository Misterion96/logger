/**
 * Vitest tests for createLogger
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import createLogger from './index';

describe('createLogger', () => {
  let logger: ReturnType<typeof createLogger>

  beforeEach(() => {
    logger = createLogger({ scope: 'TEST' });
  })

  describe('common functions', () => {
    // @ts-expect-error: didnt find 'log'
    let consoleLogSpy: ReturnType<typeof vi.spyOn<typeof console, 'log'>>

    beforeEach(() => {
      vi.useFakeTimers();
      consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
      vi.useRealTimers();
      consoleLogSpy.mockRestore();
    });

    it('logs info messages', () => {
      logger.info('hello');
      expect(consoleLogSpy).toHaveBeenCalledWith('🔵 [TEST]: hello');
    });

    it('logs success messages', () => {
      logger.success('ok');
      expect(consoleLogSpy).toHaveBeenCalledWith('🟢 [TEST]: ok');
    });

    it('logs warn messages', () => {
      logger.warn('be careful');
      expect(consoleLogSpy).toHaveBeenCalledWith('🟡 [TEST]: be careful');
    });

    it('logs error messages', () => {
      logger.error('bad');
      expect(consoleLogSpy).toHaveBeenCalledWith('🔴 [TEST]: bad');
    });

    it('does not log debug messages by default', () => {
      logger.debug('secret');
      expect(consoleLogSpy).not.toHaveBeenCalledWith('⚪ [TEST]: secret');
    });

    it('enables debug logging with setDebug(true)', () => {
      logger.setDebug(true);
      expect(consoleLogSpy).toHaveBeenCalledWith('🔵 [TEST]: Debug is enabled');

      logger.setDebug(true);
      logger.debug('now');
      expect(consoleLogSpy).toHaveBeenCalledWith('⚪ [TEST]: now');

      logger.setDebug(false);
      expect(consoleLogSpy).toHaveBeenCalledWith('🔵 [TEST]: Debug is disabled');
    });
  })

  describe('loading', () => {
    describe('browser environment', () => {
      beforeEach(() => {
        vi.stubGlobal('process', {
          versions: { node: 0 },
        });
        vi.spyOn(performance, 'now').mockReturnValueOnce(100).mockReturnValueOnce(200);
      });

      afterEach(() => {
        vi.restoreAllMocks();
      });

      it('should log success message with duration', async () => {
        const successSpy = vi.spyOn(console, 'log');
        const errorSpy = vi.spyOn(console, 'error');

        const promise = Promise.resolve()
        await logger.loading('fetch data', promise);

        expect(successSpy).toHaveBeenCalledWith(expect.stringContaining('🟢 [TEST]: fetch data (100ms)'));
        expect(errorSpy).not.toHaveBeenCalled();
      });

      it('should log error message with duration when rejected', async () => {
        const successSpy = vi.spyOn(console, 'log');
        const errorSpy = vi.spyOn(console, 'error');
        const promise = Promise.reject(new Error('fail'))

        await expect(logger.loading('fetch data', promise)).rejects.toThrow('fail');

        expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('🔴 [TEST]: fetch data (100ms)'));
        expect(successSpy).not.toHaveBeenCalled();
      });
    });

    describe('node environment', () => {
      // @ts-expect-error: didnt find 'write'
      let writeSpy: ReturnType<typeof vi.spyOn<typeof process.stdout, 'write'>>

      const originalIsTTY = process.stdout.isTTY;

      afterEach(() => {
        Object.defineProperty(process.stdout, 'isTTY', { value: originalIsTTY });
      });

      beforeEach(() => {
        vi.stubGlobal('process', {
          versions: { node: '18.0.0' },
          stdout: {
            isTTY: true,
            write: vi.fn()
          },
        });
        vi.useFakeTimers();
        writeSpy = vi.spyOn(process.stdout, 'write');
      });

      afterEach(() => {
        vi.useRealTimers();
        vi.clearAllTimers();
        vi.restoreAllMocks();
      });

      it('shows spinner and success for resolved promise', async () => {
        const promise = Promise.resolve('ok');
        const loadingPromise = logger.loading('doing work', promise);

        const COUNTER = 4;
        vi.advanceTimersByTime(COUNTER * 250);

        await loadingPromise;

        for (let i = 0; i < COUNTER; i++) {
          expect(writeSpy).toHaveBeenCalledWith(expect.stringContaining('🔄[TEST]: 🐳'));
        }
        expect(writeSpy).toHaveBeenCalledWith(expect.stringContaining('🟢 [TEST]: doing work'));
      });

      it('should show spinner and error message for rejected promise', async () => {
        const promise = Promise.reject(new Error('fail'));
        const loadingPromise = logger.loading('doing work', promise)

        const COUNTER = 4;
        vi.advanceTimersByTime(COUNTER * 250);

        await loadingPromise.catch(() => {});

        for (let i = 0; i < COUNTER; i++) {
          expect(writeSpy).toHaveBeenCalledWith(expect.stringContaining('🔄[TEST]: 🐳'));
        }
        expect(writeSpy).toHaveBeenCalledWith(expect.stringContaining('🔴 [TEST]: doing work'));
      });

      it('should skip animation when not TTY', async () => {
        Object.defineProperty(process.stdout, 'isTTY', { value: false });
        const promise = Promise.resolve('ok');

        await logger.loading('simple', promise);

        expect(writeSpy).toHaveBeenCalledWith(expect.stringContaining('simple'));
        expect(writeSpy).toHaveBeenCalledWith(expect.stringContaining('🟢 Success'));
      });

      it('should skip animation when not TTY', async () => {
        Object.defineProperty(process.stdout, 'isTTY', { value: false });
        const promise = Promise.reject(new Error('fail'))

        await logger.loading('simple', promise).catch(() => {});

        expect(writeSpy).toHaveBeenCalledWith(expect.stringContaining('simple'));
        expect(writeSpy).toHaveBeenCalledWith(expect.stringContaining('🔴 Failure'));
      });
    });
  });
});
