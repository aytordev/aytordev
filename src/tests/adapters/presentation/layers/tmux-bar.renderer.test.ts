import { describe, expect, it } from "vitest";
import type { TmuxSession } from "../../../../domain/entities/tmux-session";
import { renderTmuxBar } from "../../../../adapters/presentation/layers/tmux-bar.renderer";
import { KanagawaTheme } from "../../../../theme/kanagawa";

describe("Tmux Bar Renderer", () => {
  const session: TmuxSession = {
    sessionName: "dev",
    windows: [
      { name: "zsh", index: 1 },
      { name: "nvim", index: 2 },
    ],
    activeWindowIndex: 1,
    currentBranch: "main",
    stats: {
      cpuLoad: 1.5,
      memoryUsage: 4096,
      uptime: "2d",
    },
  };

  it("should render status bar background", () => {
    const svg = renderTmuxBar(session, KanagawaTheme);
    expect(svg).toContain('class="tmux__bg"');
    expect(svg).toContain(`fill="${KanagawaTheme.colors.bgDark}"`);
  });

  it("should render session index segment", () => {
    const svg = renderTmuxBar(session, KanagawaTheme);
    // Segmented bar uses session index "0" in dedicated segment
    expect(svg).toContain("0");
    expect(svg).toContain(`fill="${KanagawaTheme.colors.sumiInk0}"`);
  });

  it("should render active window segment", () => {
    const svg = renderTmuxBar(session, KanagawaTheme);
    // Active window shows as "1 zsh" in its own segment
    expect(svg).toContain("1 zsh");
  });

  it("should render git branch in right segment", () => {
    const svg = renderTmuxBar(session, KanagawaTheme);
    expect(svg).toContain("main");
    expect(svg).toContain(`fill="${KanagawaTheme.colors.springViolet1}"`);
  });

  it("should render CPU stats segment", () => {
    const svg = renderTmuxBar(session, KanagawaTheme);
    expect(svg).toContain("CPU 1.5%");
    expect(svg).toContain(`fill="${KanagawaTheme.colors.autumnOrange}"`);
  });

  it("should render RAM stats segment", () => {
    const svg = renderTmuxBar(session, KanagawaTheme);
    expect(svg).toContain("RAM");
    expect(svg).toContain(`fill="${KanagawaTheme.colors.waveAqua}"`);
  });
});
