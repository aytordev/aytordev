export interface ProcessPort {
  readonly exit: (code: number) => void;
  readonly argv: readonly string[];
}
