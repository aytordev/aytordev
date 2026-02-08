import type { LoggerPort } from "../../domain/ports/logger.port";

export const createConsoleLoggerAdapter = (): LoggerPort => ({
  log: (message: string) => console.log(message),
  error: (message: string) => console.error(message),
});
