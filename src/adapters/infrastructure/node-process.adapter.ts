import type { ProcessPort } from "../../domain/ports/process.port";

export const createNodeProcessAdapter = (): ProcessPort => ({
  exit: (code: number) => process.exit(code),
  argv: Object.freeze([...process.argv]),
});
