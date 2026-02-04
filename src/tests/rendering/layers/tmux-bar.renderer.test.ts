import { describe, expect, it } from "vitest";
import type { TmuxSession } from "../../../domain/entities/tmux-session";
import { renderTmuxBar } from "../../../rendering/layers/tmux-bar.renderer";
import { KanagawaTheme } from "../../../theme/kanagawa";

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

  it("should render session name", () => {
    const svg = renderTmuxBar(session, KanagawaTheme);
    expect(svg).toContain("dev");
    expect(svg).toContain('class="tmux__left"');
  });

  it("should render windows with active state", () => {
    const svg = renderTmuxBar(session, KanagawaTheme);
    expect(svg).toContain("1:zsh*");
    expect(svg).toContain("2:nvim");
  });

  it("should render git branch", () => {
    const svg = renderTmuxBar(session, KanagawaTheme);
    expect(svg).toContain("main");
    expect(svg).toContain('class="tmux__center"');
  });

  it("should render system stats", () => {
    const svg = renderTmuxBar(session, KanagawaTheme);
    expect(svg).toContain("1.5%"); // CPU
    expect(svg).toContain("2d"); // Uptime
    expect(svg).toContain('class="tmux__right"');
  });
});
