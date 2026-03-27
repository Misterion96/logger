# Logger 🐳

A simple, cross-platform logger with support for debug, info, warning, success, error messages, and Promise loading indicators. Works in both Node.js and browser environments.

---

## Installation

```bash
# Using npm
npm install @dolgikh-maks/logger

# Using yarn
yarn add @dolgikh-maks/logger
```

---

## Quick Start

The simplest way to start is using the default `createLogger` function.

```ts
import createLogger from '@dolgikh-maks/logger';

const logger = createLogger({ scope: 'MyApp' });

logger.info('Application started');
logger.success('Operation completed');
```

---

## Core Principles
When creating `@dolgikh-maks/logger`, I was guided by these principles:
- **Minimalism**: No configurations longer than 100 lines.
- **Context Isolation**: Each module has its own scope to avoid confusion.
- **Predictability**: Consistent behavior across Browser and Node.js.
- **Zero-overhead**: Debug logs have zero impact when disabled.

---

## Methods

### `info(message: string, ...args: any[])`
Logs an informative message (prefix 🔵).
```ts
logger.info('Starting server...');
```

### `success(message: string, ...args: any[])`
Logs a success message (prefix 🟢).
```ts
logger.success('User authenticated');
```

### `warn(message: string, ...args: any[])`
Logs a warning message (prefix 🟡).
```ts
logger.warn('Rate limit approaching');
```

### `error(message: string, ...args: any[])`
Logs an error message (prefix 🔴).
```ts
logger.error('Database connection failed', error);
```

### `debug(message: string, ...args: any[])`
Logs a debug message (prefix ⚪) **only if debugging is enabled**.
```ts
logger.debug('Internal state:', state);
```

### `setDebug(enabled: boolean)`
Enables or disables debug messages globally for the factory.
```ts
logger.setDebug(true);
```

### `loading<T>(comment: string, promise: Promise<T>): Promise<T>`
Shows a loading indicator while a Promise is pending. 
- **Browser**: Shows execution time in ms.
- **Node.js**: Displays an animated spinner in TTY environments.

```ts
const data = await logger.loading('Fetching data', api.getUsers());
```

---

## Advanced Usage

### LoggerFactory
For complex applications, use `LoggerFactory` to centralize configuration.

```ts
import { LoggerFactory, ConsoleTransport } from '@dolgikh-maks/logger';

const factory = new LoggerFactory({
  level: 'info',
  useTimestamps: true,
  transports: [
    new ConsoleTransport({
      methods: {
        info: 'table', // Use console.table for info logs
      }
    })
  ]
});

const logger = factory.createLogger({ scope: 'Database' });
```

### Custom Transports
Implement the `Transport` interface to direct logs to external services (e.g., Sentry, File).

```ts
import type { Transport, LogEntry } from '@dolgikh-maks/logger';

class MyTransport implements Transport {
  send(entry: LogEntry) {
    // entry.level, entry.scope, entry.message, entry.additionalData
  }
}
```

---

## Documentation
For more detailed information, check the `.docs` directory:
- [Architecture & Principles](.docs/index.md)
- [Full API Reference](.docs/api.md)
- [Recipes & Best Practices](.docs/recipes.md)
