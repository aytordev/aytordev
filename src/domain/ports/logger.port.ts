export interface LoggerPort {
  readonly log: (message: string) => void;
  readonly error: (message: string) => void;
}
