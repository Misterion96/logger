# Справочник API

Данный раздел содержит описание основных классов и интерфейсов библиотеки.

## `LoggerFactory`

Центральный класс для управления конфигурацией логирования.

### Конструктор
`new LoggerFactory(options?: FactoryOptions)`

**Options**:
- `level?: LogLevel` — Минимальный уровень логирования (по умолчанию `'info'`).
- `debugEnabled?: boolean` — Глобальный флаг режима отладки (по умолчанию `false`).
- `transports?: Transport[]` — Список транспортов для вывода логов.
- `useTimestamps?: boolean` — Добавлять ли ISO-таймштамп к логам (по умолчанию `false`).

### Методы
- `createLogger(options: { scope: string })`: Создает экземпляр `LoggerInstance`.
- `setDebug(enabled: boolean, triggeringScope?: string)`: Глобально переключает режим отладки.

---

## `LoggerInstance`

Класс, предоставляющий методы для записи логов. Создается через фабрику.

### Методы
- `info/success/warn/error/debug(message: string, ...additionalData: T[])`: Методы логирования.
- `setDebug(enabled: boolean)`: Прокси-метод для переключения дебага через фабрику. При вызове передает собственный `scope` для информационного сообщения.
- `loading<T>(comment: string, promise: Promise<T>)`: Ожидание выполнения промиса с визуальной индикацией.

---

## Транспорты

Библиотека поддерживает расширение через систему транспортов.

### `Transport` (interface)
Любой транспорт должен реализовывать метод:
- `send(entry: LogEntry<T>): void`

### `ConsoleTransport` (class)
Стандартный транспорт для вывода в консоль.
**Options**:
- `useEmojis?: boolean` — Использовать ли эмодзи-префиксы (по умолчанию `true`).
- `methods?: Partial<Record<LogLevel, ConsoleMethod>>` — Переопределение нативных методов `console` (например, `info -> table`).

---

## Типы данных

### `LogLevel`
`'debug' | 'info' | 'success' | 'warn' | 'error' | 'none'`

### `LogEntry<T>`
Объект, передаваемый в транспорты:
- `level: LogLevel`
- `scope: string`
- `message: string`
- `additionalData: T[]`
- `timestamp?: number` (UTC milliseconds)
