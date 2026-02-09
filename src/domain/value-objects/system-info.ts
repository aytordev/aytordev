import { type Result, err, ok } from "../../shared/result";

export interface SystemInfo {
  readonly os: string;
  readonly shell: string;
  readonly editor: string;
  readonly terminal: string;
  readonly theme: string;
  readonly wm?: string;
}

const validateRequired = (value: string, field: string): string | Error => {
  const trimmed = value.trim();
  if (trimmed === "") {
    return new Error(`System ${field} cannot be empty`);
  }
  return trimmed;
};

export const createSystemInfo = (data: {
  os: string;
  shell: string;
  editor: string;
  terminal: string;
  theme: string;
  wm?: string;
}): Result<SystemInfo, Error> => {
  const fields = ["os", "shell", "editor", "terminal", "theme"] as const;

  for (const field of fields) {
    const result = validateRequired(data[field], field);
    if (result instanceof Error) {
      return err(result);
    }
  }

  if (data.wm !== undefined && data.wm.trim() === "") {
    return err(new Error("System wm cannot be an empty string"));
  }

  return ok({
    os: data.os.trim(),
    shell: data.shell.trim(),
    editor: data.editor.trim(),
    terminal: data.terminal.trim(),
    theme: data.theme.trim(),
    wm: data.wm?.trim(),
  });
};
