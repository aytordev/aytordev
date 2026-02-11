import { describe, expect, it } from "vitest";
import { renderTerminal } from "../../adapters/presentation/terminal-renderer";
import { terminalStateBuilder } from "../__support__/builders";
import { TEST_ANIMATION } from "../__support__/constants";

describe("Animated Profile Integration", () => {
  const createFullState = () =>
    terminalStateBuilder()
      .withContent({
        neofetchData: {
          owner: {
            name: "Aytor Developer",
            username: "aytordev",
            tagline: "Full-Stack Developer | NixOS Enthusiast",
            location: "Madrid, Spain",
          },
          system: {
            os: "NixOS",
            shell: "zsh",
            editor: "neovim",
            terminal: "ghostty",
            theme: "Kanagawa",
          },
          stats: {
            totalCommits: 1200,
            currentStreak: 42,
            publicRepos: 42,
          },
        },
        journey: [
          { year: 2020, icon: "\u{1F331}", title: "Started coding" },
          { year: 2024, icon: "\u{1F916}", title: "AI Engineering", tags: ["LLMs", "Agents"] },
        ],
        techStack: {
          categories: [
            { name: "Languages", items: ["TypeScript", "Rust", "Python", "Nix"] },
            { name: "AI/ML", items: ["PyTorch", "TensorFlow", "LangChain"] },
            { name: "Infrastructure", items: ["Docker", "Kubernetes", "NixOS"] },
          ],
        },
        languageStats: [
          { name: "TypeScript", percentage: 45, color: "#3178C6", bytes: 125000 },
          { name: "Rust", percentage: 25, color: "#CE422B", bytes: 75000 },
          { name: "Python", percentage: 20, color: "#3776AB", bytes: 60000 },
          { name: "Nix", percentage: 10, color: "#5277C3", bytes: 30000 },
        ],
        recentCommits: [
          {
            hash: "a1b2c3d",
            message: "feat: add animation support",
            emoji: "\u{2728}",
            type: "feat",
            relativeTime: "2 hours ago",
          },
          {
            hash: "e4f5g6h",
            message: "fix: correct scroll behavior",
            emoji: "\u{1F41B}",
            type: "fix",
            relativeTime: "1 day ago",
          },
          {
            hash: "i7j8k9l",
            message: "docs: update README",
            emoji: "\u{1F4DD}",
            type: "docs",
            relativeTime: "3 days ago",
          },
        ],
        featuredRepos: [
          {
            name: "terminal-profile",
            nameWithOwner: "aytordev/terminal-profile",
            description: "Dynamic SVG terminal profile generator",
            stargazerCount: 234,
            primaryLanguage: { name: "TypeScript", color: "#3178C6" },
            updatedAt: "2026-02-10T12:00:00Z",
          },
          {
            name: "system",
            nameWithOwner: "aytordev/system",
            description: "NixOS config for all machines",
            stargazerCount: 89,
            primaryLanguage: { name: "Nix", color: "#5277C3" },
            updatedAt: "2026-02-09T08:00:00Z",
          },
          {
            name: "dotfiles",
            nameWithOwner: "aytordev/dotfiles",
            description: "Personal dev environment",
            stargazerCount: 45,
            primaryLanguage: { name: "Shell", color: "#89e051" },
            updatedAt: "2026-02-07T15:00:00Z",
          },
        ],
        contactInfo: [
          { label: "GitHub", value: "https://github.com/aytordev", icon: "github" },
          { label: "Website", value: "https://aytor.dev", icon: "globe" },
          { label: "Email", value: "hello@aytor.dev", icon: "mail" },
        ],
        contactCta: "Let's connect! \u{1F4AC}",
      })
      .withAnimation({
        enabled: true,
        speed: TEST_ANIMATION.SPEED_NORMAL,
        initialDelay: 0.5,
      })
      .build();

  it("should generate complete animated SVG profile", () => {
    const state = createFullState();
    const svg = renderTerminal(state);

    expect(svg).toContain("<svg");
    expect(svg).toContain("</svg>");
    expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"');

    expect(svg).toContain('viewBox="0 0 800 400"');
    expect(svg).toContain('width="800"');
    expect(svg).toContain('height="400"');
  });

  it("should include animation-specific elements", () => {
    const state = createFullState();
    const svg = renderTerminal(state);

    expect(svg).toContain("clipPath");
    expect(svg).toContain('id="terminal-viewport"');
    expect(svg).toContain('clip-path="url(#terminal-viewport)"');
    expect(svg).toContain('id="scrollable-content"');

    // fadeIn is now handled via SMIL, not CSS keyframes
    expect(svg).not.toContain("@keyframes fadeIn");
    expect(svg).toContain("--typing-duration:");
    expect(svg).toContain("--fade-duration:");

    expect(svg).toContain('clip-path="url(#typing-clip-');
  });

  it("should include animated commands", () => {
    const state = createFullState();
    const svg = renderTerminal(state);

    expect(svg).toContain("neofetch");
    expect(svg).toContain("cat ~/.stack");
    expect(svg).toContain("cat ~/.stack");
    expect(svg).toContain("echo");
  });

  it("should include CSS reveal timing and SMIL typing for commands", () => {
    const state = createFullState();
    const svg = renderTerminal(state);

    expect(svg).toContain('class="command-0 command-line terminal-text"');
    // CSS handles progressive reveal (animation-fill-mode: both)
    expect(svg).toContain("@keyframes reveal");
    expect(svg).toContain('class="prompt-0"');
    expect(svg).toContain(".command-0 { animation: reveal");
    expect(svg).toContain('class="output-0"');
    expect(svg).toContain(".prompt-0 { animation: reveal");
    expect(svg).toContain(".output-0 { animation: reveal");

    // SMIL still used for typing animation (begin= on clipPath/cursor)
    const beginMatches = svg.match(/begin="[\d.]+s"/g);
    expect(beginMatches).toBeDefined();
    expect(beginMatches!.length).toBeGreaterThan(3);
  });

  it("should include scroll keyframes when content is tall", () => {
    const state = createFullState();
    const svg = renderTerminal(state);

    expect(svg).toContain("@keyframes scroll-");
    expect(svg).toContain("transform: translateY");
  });

  it("should include tmux bar and footer", () => {
    const state = createFullState();
    const svg = renderTerminal(state);

    expect(svg).toContain('id="tmux-bar"');
    expect(svg).toContain(state.session.sessionName);

    expect(svg).toContain("powered by @aytordev");
  });

  it("should include developer info content", () => {
    const state = createFullState();
    const svg = renderTerminal(state);

    expect(svg).toContain("@aytordev");
    expect(svg).toContain("Full-Stack Developer");
    expect(svg).toContain("Madrid, Spain");
  });

  it("should render tech stack with horizontal icon grid", () => {
    const state = createFullState();
    const svg = renderTerminal(state);

    expect(svg).toContain("<path");
    expect(svg).toContain('viewBox="0 0 24 24"');

    expect(svg).toContain('fill="#3178C6"'); // TypeScript
    expect(svg).toContain('fill="#326CE5"'); // Kubernetes

    expect(svg).toContain('class="stack__title"');
    expect(svg).not.toContain('class="stack__item"');
  });

  it("should include contact info", () => {
    const state = createFullState();
    const svg = renderTerminal(state);

    expect(svg).toContain("github.com/aytordev");
    expect(svg).toContain("aytor.dev");
  });

  it("should respect animation speed configuration", () => {
    const slowState = {
      ...createFullState(),
      animation: { enabled: true, speed: TEST_ANIMATION.SPEED_SLOW, initialDelay: 0.5 },
    };
    const normalState = {
      ...createFullState(),
      animation: { enabled: true, speed: TEST_ANIMATION.SPEED_NORMAL, initialDelay: 0.5 },
    };
    const fastState = {
      ...createFullState(),
      animation: { enabled: true, speed: TEST_ANIMATION.SPEED_FAST, initialDelay: 0.5 },
    };

    const slowSvg = renderTerminal(slowState);
    const normalSvg = renderTerminal(normalState);
    const fastSvg = renderTerminal(fastState);

    expect(slowSvg).toContain("--typing-duration: 4s");
    expect(slowSvg).toContain("--fade-duration: 0.6s");

    expect(normalSvg).toContain("--typing-duration: 2s");
    expect(normalSvg).toContain("--fade-duration: 0.3s");

    expect(fastSvg).toContain("--typing-duration: 1s");
    expect(fastSvg).toContain("--fade-duration: 0.15s");
  });

  it("should generate valid XML structure", () => {
    const state = createFullState();
    const svg = renderTerminal(state);

    expect(svg).toMatch(/<svg[^>]*>/);
    expect(svg).toMatch(/<\/svg>/);
    expect(svg).toMatch(/<defs[^>]*>[\s\S]*<\/defs>/);
    expect(svg).toMatch(/<g[^>]*>[\s\S]*<\/g>/);

    const openTags = (svg.match(/<(?!\/)[^>]+>/g) || []).length;
    const closeTags = (svg.match(/<\/[^>]+>/g) || []).length;
    expect(openTags).toBeGreaterThan(0);
    expect(closeTags).toBeGreaterThan(0);
  });

  it("should be deterministic (same input produces same output)", () => {
    const state = createFullState();
    const svg1 = renderTerminal(state);
    const svg2 = renderTerminal(state);

    expect(svg1).toBe(svg2);
  });
});
