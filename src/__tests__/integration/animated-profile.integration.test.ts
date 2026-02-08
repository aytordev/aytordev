import { describe, expect, it } from "vitest";
import { renderTerminal } from "../../adapters/presentation/terminal-renderer";
import type { TerminalState } from "../../domain/entities/terminal-state";

describe("Animated Profile Integration", () => {
  const createFullState = (): TerminalState => ({
    themeName: "kanagawa-wave",
    dimensions: { width: 800, height: 400 },
    greeting: "Welcome to my terminal profile!",
    timestamp: new Date("2024-01-01T12:00:00Z"),
    timeOfDay: "afternoon",
    owner: {
      name: "Aytor Developer",
      username: "aytordev",
      title: "Software Engineer",
      location: "Madrid, Spain",
      timezone: "Europe/Madrid",
    },
    session: {
      sessionName: "main",
      windows: [],
      activeWindowIndex: 0,
      currentBranch: "feat/animated-terminal",
      stats: { cpuLoad: 25, memoryUsage: 60, uptime: "2h 30m" },
    },
    prompt: {
      directory: "~/projects/aytordev",
      gitBranch: "feat/animated-terminal",
      gitStatus: "clean",
      nodeVersion: "v20.11.0",
      nixIndicator: true,
      time: "14:30",
    },
    content: {
      developerInfo: {
        name: "Aytor Developer",
        username: "aytordev",
        tagline: "Full-Stack Developer | NixOS Enthusiast",
        location: "Madrid, Spain",
      },
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
          emoji: "✨",
          type: "feat",
          relativeTime: "2 hours ago",
        },
        {
          hash: "e4f5g6h",
          message: "fix: correct scroll behavior",
          emoji: "🐛",
          type: "fix",
          relativeTime: "1 day ago",
        },
        {
          hash: "i7j8k9l",
          message: "docs: update README",
          emoji: "📝",
          type: "docs",
          relativeTime: "3 days ago",
        },
      ],
      stats: { publicRepos: 42, followers: 150, following: 75, totalStars: 500 },
      careerTimeline: [],
      learningJourney: { current: "Diving deep into Rust async programming" },
      todayFocus: null,
      dailyQuote: null,
      contactInfo: [
        { label: "GitHub", value: "https://github.com/aytordev", icon: "github" },
        { label: "Website", value: "https://aytor.dev", icon: "globe" },
        { label: "Email", value: "hello@aytor.dev", icon: "mail" },
      ],
      streak: {
        currentStreak: 42,
        longestStreak: 60,
        lastContributionDate: new Date("2024-01-01T00:00:00Z"),
        isActive: true,
      },
      extraLines: [],
    },
    animation: {
      enabled: true,
      speed: 1,
      initialDelay: 0.5,
    },
  });

  it("should generate complete animated SVG profile", () => {
    const state = createFullState();
    const svg = renderTerminal(state);

    // Verify it's valid SVG
    expect(svg).toContain("<svg");
    expect(svg).toContain("</svg>");
    expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"');

    // Verify dimensions
    expect(svg).toContain('viewBox="0 0 800 400"');
    expect(svg).toContain('width="800"');
    expect(svg).toContain('height="400"');
  });

  it("should include animation-specific elements", () => {
    const state = createFullState();
    const svg = renderTerminal(state);

    // Viewport simulation
    expect(svg).toContain("clipPath");
    expect(svg).toContain('id="terminal-viewport"');
    expect(svg).toContain('clip-path="url(#terminal-viewport)"');
    expect(svg).toContain('id="scrollable-content"');

    // Animation styles
    expect(svg).toContain("@keyframes typewriter");
    expect(svg).toContain("@keyframes fadeIn");
    expect(svg).toContain("--typing-duration:");
    expect(svg).toContain("--fade-duration:");
  });

  it("should include all animated commands", () => {
    const state = createFullState();
    const svg = renderTerminal(state);

    // Verify commands are present
    expect(svg).toContain("terminal-profile --info");
    expect(svg).toContain("terminal-profile --stack");
    expect(svg).toContain("terminal-profile --languages");
    expect(svg).toContain("terminal-profile --commits");
    expect(svg).toContain("terminal-profile --engagement");
    expect(svg).toContain("terminal-profile --contact");
    expect(svg).toContain("terminal-profile --streak");
  });

  it("should include animation classes and delays", () => {
    const state = createFullState();
    const svg = renderTerminal(state);

    // Command animation
    expect(svg).toContain('class="command-line animate');
    expect(svg).toContain('class="command-output animate"');
    expect(svg).toContain("animation-delay:");

    // Multiple delays for sequential commands
    const delayMatches = svg.match(/animation-delay: [\d.]+s/g);
    expect(delayMatches).toBeDefined();
    expect(delayMatches!.length).toBeGreaterThan(5); // Multiple commands
  });

  it("should include scroll keyframes when content is tall", () => {
    const state = createFullState();
    const svg = renderTerminal(state);

    // With full content, scroll should be generated
    expect(svg).toContain("@keyframes scroll-");
    expect(svg).toContain("transform: translateY");
  });

  it("should include tmux bar and footer", () => {
    const state = createFullState();
    const svg = renderTerminal(state);

    // tmux bar
    expect(svg).toContain('id="tmux-bar"');
    expect(svg).toContain(state.session.sessionName);

    // Footer
    expect(svg).toContain("Powered by Terminal Profile");
  });

  it("should include developer info content", () => {
    const state = createFullState();
    const svg = renderTerminal(state);

    expect(svg).toContain("@aytordev");
    expect(svg).toContain("Full-Stack Developer");
    expect(svg).toContain("Madrid, Spain");
  });

  it("should include tech stack content", () => {
    const state = createFullState();
    const svg = renderTerminal(state);

    expect(svg).toContain("TypeScript");
    expect(svg).toContain("Rust");
    expect(svg).toContain("PyTorch");
    expect(svg).toContain("Docker");
  });

  it("should include language stats", () => {
    const state = createFullState();
    const svg = renderTerminal(state);

    expect(svg).toContain("45%"); // TypeScript percentage
    expect(svg).toContain("25%"); // Rust percentage
  });

  it("should include recent commits", () => {
    const state = createFullState();
    const svg = renderTerminal(state);

    expect(svg).toContain("feat: add animation support");
    expect(svg).toContain("fix: correct scroll behavior");
    expect(svg).toContain("2 hours ago");
  });

  it("should include learning journey", () => {
    const state = createFullState();
    const svg = renderTerminal(state);

    expect(svg).toContain("Diving deep into Rust async programming");
  });

  it("should include contact info", () => {
    const state = createFullState();
    const svg = renderTerminal(state);

    expect(svg).toContain("github.com/aytordev");
    expect(svg).toContain("aytor.dev");
  });

  it("should include streak information", () => {
    const state = createFullState();
    const svg = renderTerminal(state);

    expect(svg).toContain("🔥");
    expect(svg).toContain("42 day streak");
  });

  it("should respect animation speed configuration", () => {
    const slowState = { ...createFullState(), animation: { enabled: true, speed: 0.5, initialDelay: 0.5 } };
    const normalState = { ...createFullState(), animation: { enabled: true, speed: 1, initialDelay: 0.5 } };
    const fastState = { ...createFullState(), animation: { enabled: true, speed: 2, initialDelay: 0.5 } };

    const slowSvg = renderTerminal(slowState);
    const normalSvg = renderTerminal(normalState);
    const fastSvg = renderTerminal(fastState);

    // Slow should have longer durations
    expect(slowSvg).toContain("--typing-duration: 4s");
    expect(slowSvg).toContain("--fade-duration: 0.6s");

    // Normal
    expect(normalSvg).toContain("--typing-duration: 2s");
    expect(normalSvg).toContain("--fade-duration: 0.3s");

    // Fast should have shorter durations
    expect(fastSvg).toContain("--typing-duration: 1s");
    expect(fastSvg).toContain("--fade-duration: 0.15s");
  });

  it("should generate valid XML structure", () => {
    const state = createFullState();
    const svg = renderTerminal(state);

    // Basic XML validation checks
    expect(svg).toMatch(/<svg[^>]*>/);
    expect(svg).toMatch(/<\/svg>/);
    expect(svg).toMatch(/<defs[^>]*>[\s\S]*<\/defs>/);
    expect(svg).toMatch(/<g[^>]*>[\s\S]*<\/g>/);

    // No unclosed tags (basic check)
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
