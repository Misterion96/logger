# Рецепты и Best Practices

## 1. Типизация логгера

Библиотека экспортирует все необходимые типы для использования в вашем коде.

```ts
import type { LoggerInstance } from '@dolgikh-maks/logger';

class AuthService {
  constructor(private readonly logger: LoggerInstance) {}
  
  login() {
    this.logger.info('User login attempt');
  }
}
```

---

## 2. Глобальная инициализация (Factory Singleton)

Рекомендуется создавать и настраивать фабрику в отдельном файле, чтобы иметь единую точку управления конфигурацией.

```ts
// src/lib/logger.ts
import { LoggerFactory, ConsoleTransport } from '@dolgikh-maks/logger';

const isDev = process.env.NODE_ENV === 'development';

const factory = new LoggerFactory({
  level: isDev ? 'debug' : 'info',
  debugEnabled: process.env.DEBUG === 'true',
  transports: [
    new ConsoleTransport({
      useEmojis: true
    })
  ]
});

export const getLogger = (scope: string) => factory.createLogger({ scope });
```

---

## 3. Использование Custom Transports (например, Sentry)

Вы можете отправлять критические ошибки напрямую во внешние сервисы.

```ts
import type { Transport, LogEntry } from '@dolgikh-maks/logger';
import * as Sentry from "@sentry/node";

class SentryTransport implements Transport {
  send(entry: LogEntry) {
    if (entry.level === 'error') {
      Sentry.captureMessage(`[${entry.scope}] ${entry.message}`, {
        extra: { data: entry.additionalData }
      });
    }
  }
}
```

---

## 4. Группировка логов (Console Table)

Если вы часто логируете массивы объектов, настройте транспорт на использование `console.table`.

```ts
const factory = new LoggerFactory({
  transports: [
    new ConsoleTransport({
      methods: {
        info: 'table'
      }
    })
  ]
});

const logger = factory.createLogger({ scope: 'API' });
logger.info('Users list', [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }]);
```
