import { KanagawaTheme } from "./kanagawa";
import { KanagawaDragonTheme } from "./kanagawa-dragon";
import { KanagawaLotusTheme } from "./kanagawa-lotus";
import type { Theme } from "./types";

export const themes: Record<string, Theme> = {
  "kanagawa-wave": KanagawaTheme,
  "kanagawa-dragon": KanagawaDragonTheme,
  "kanagawa-lotus": KanagawaLotusTheme,
};

export function registerTheme(theme: Theme): void {
  themes[theme.name] = theme;
}

export function getTheme(name: string): Theme {
  return themes[name] || KanagawaTheme;
}

export * from "./kanagawa";
export * from "./types";
