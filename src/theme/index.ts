import { KanagawaTheme } from "./kanagawa";
import type { Theme } from "./types";

export const themes: Record<string, Theme> = {
  "kanagawa-wave": KanagawaTheme,
};

export function registerTheme(theme: Theme): void {
  themes[theme.name] = theme;
}

export function getTheme(name: string): Theme {
  return themes[name] || KanagawaTheme;
}

export * from "./kanagawa";
export * from "./types";
