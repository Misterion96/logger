# Logger

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

## Philosophy of the instrument
When creating `@dolgikh-maks/logger`, I was guided by the principles:
- Minimalism: No configurations longer than 100 lines
- Predictability: Consistent behavior everywhere
- Performance: Zero overhead when debug is off
- Developer Experience: Easy-to-read logs = faster problem detection

---

## Key advantages
1. Context isolation. Each module has its own scope, which eliminates confusion when components are running in parallel.
2. Visual hierarchy. Colored indicators (🔵 `info`, 🟢 `success`, 🟡 `warning`, 🔴 `error`) allow you to instantly assess the situation.
3. Flexible debugging. The `setDebug()` flag enables detailed logs only when needed, without cluttering production.
4. Timers out of the box. The `loading()` method automatically measures the execution time of asynchronous operations, which is critical for optimization.
5. Cross-platform compatibility. A unified API for browsers and Node.js. The terminal even has an animated spinner for long operations.

---
## Usage

### Importing

```ts
import createLogger from '@dolgikh-maks/logger';

const logger = createLogger({ scope: 'MyApp' });
```

* `scope` — a string to prefix all logs. Helps identify the module or feature producing the logs.

---

## Methods

### `setDebug(enabled: boolean)`

Enables or disables debug messages.

```ts
logger.setDebug(true);
logger.setDebug(false);
```

**Example Output**:

```
🔵 [MyApp]: Debug is enabled
🔵 [MyApp]: Debug is disabled
```

---

### `debug(message: string, ...args: any[])`

Logs a debug message **only if debugging is enabled**.

```ts
logger.setDebug(true);
logger.debug('This is a debug message');
```

**Example Output**:

```
⚪ [MyApp]: This is a debug message
```

---

### `info(message: string, ...args: any[])`

Logs an informative message.

```ts
logger.info('Application started');
```

**Example Output**:

```
🔵 [MyApp]: Application started
```

---

### `success(message: string, ...args: any[])`

Logs a success message.

```ts
logger.success('Data loaded successfully');
```

**Example Output**:

```
🟢 [MyApp]: Data loaded successfully
```

---

### `warn(message: string, ...args: any[])`

Logs a warning message.

```ts
logger.warn('Deprecated API usage');
```

**Example Output**:

```
🟡 [MyApp]: Deprecated API usage
```

---

### `error(message: string, ...args: any[])`

Logs an error message.

```ts
logger.error('Failed to fetch data');
```

**Example Output**:

```
🔴 [MyApp]: Failed to fetch data
```

---

### `loading<T>(comment: string, promise: Promise<T>): Promise<T>`

Shows a loading indicator while a Promise is pending. Automatically logs success or failure when the promise resolves or rejects. Works differently in Node.js and browser environments:

* **Browser** — simple `console.log` with timing.
* **Node.js** — animated spinner in terminal if TTY is available.

```ts
const fetchData = new Promise((resolve) => setTimeout(() => resolve('Done'), 1000));

logger.loading('Fetching data', fetchData).then(result => {
  console.log(`Result: ${result}`);
});
```

**Example Output (Browser)**:

```
🟢 [MyApp]: Fetching data (1002ms)
Result: Done
```

**Example Output (Node.js)**:

```
🔄 [MyApp]🐳
🔄 [MyApp]  🐳
🔄 [MyApp]    🐳
🔄 [MyApp]      🐳
🟢 [MyApp]: Fetching data
Result: Done
```

---

## Example Combined Usage

```ts
const logger = createLogger({ scope: 'App' });

logger.setDebug(true);
logger.info('Starting application...');
logger.debug('Debugging mode is on');

const asyncTask = new Promise((resolve) => setTimeout(resolve, 2000));
await logger.loading('Performing async task', asyncTask);

logger.success('Application finished');
```

**Output (Node.js)**:

```
🔵 [App]: Starting application...
⚪ [App]: Debugging mode is on
🔄 [App] 🐳
🔄 [App]   🐳
🟢 [App]: Performing async task
🟢 [App]: Application finished
```

---

