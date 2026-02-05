import type { Theme } from "../theme/types";

export const generateVariables = (theme: Theme): string => {
  const { colors } = theme;
  return `
    :root {
      --bg: ${colors.bg};
      --bg-tmux: ${colors.bgDark};
      --text: ${colors.text};
      --text-muted: ${colors.textMuted};
      --text-secondary: ${colors.textSecondary};
      --border: ${colors.border};
      --selection: ${colors.selection};

      /* Palette */
      --green: ${colors.springGreen};
      --green-muted: ${colors.autumnGreen};
      --blue: ${colors.crystalBlue};
      --violet: ${colors.oniViolet};
      --yellow: ${colors.roninYellow};
      --orange: ${colors.surimiOrange};
      --red: ${colors.samuraiRed};
      --crystal: ${colors.dragonBlue};
    }
  `;
};

export const generateCss = (theme: Theme): string => {
  const variables = generateVariables(theme);

  return `
    ${variables}

    /* Base Styles */
    .background {
      fill: var(--bg);
      stroke: var(--border);
      stroke-width: 2px;
    }

    .terminal-text {
      font-family: 'Monaspace Neon', 'JetBrains Mono', 'Fira Code', monospace;
      font-size: 14px;
      dominant-baseline: middle;
    }

    /* Animations */
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }

    .cursor {
      fill: var(--green);
      animation: blink 1s step-end infinite;
    }

    /* tmux Status Bar */
    .tmux__bg { fill: var(--bg-tmux); }
    .tmux__left { fill: var(--text-muted); }
    .tmux__center { fill: var(--yellow); }
    .tmux__right { fill: var(--blue); }

    /* Starship Prompt */
    .prompt__dir { fill: var(--blue); font-weight: bold; }
    .prompt__arrow { fill: var(--green); }
    .prompt__git { fill: var(--violet); }
    .prompt__node { fill: var(--green-muted); }
    .prompt__nix { fill: var(--crystal); }
    .prompt__time { fill: var(--text-muted); font-size: 12px; }
    .prompt__indicator { fill: var(--green); }

    /* Developer Info */
    .dev__username { fill: var(--text); font-weight: bold; font-size: 16px; }
    .dev__role { fill: var(--text-secondary); }
    .dev__bio { fill: var(--text); }
    .dev__location { fill: var(--text-muted); font-size: 12px; }

    /* Tech Stack */
    .stack__title { fill: var(--border); }
    .stack__item { fill: var(--text); }

    /* Recent Commits */
    .commit__msg { fill: var(--text); }
    .commit__time { fill: var(--text-muted); font-size: 12px; }
    .commit__type--feat { fill: var(--green); }
    .commit__type--fix { fill: var(--red); }
    .commit__type--docs { fill: var(--blue); }
    .commit__type--style { fill: var(--violet); }
    .commit__type--refactor { fill: var(--orange); }
    .commit__type--test { fill: var(--yellow); }
    .commit__type--chore { fill: var(--text-muted); }

    /* Streak */
    .streak__count { fill: var(--orange); font-weight: bold; }

    /* Footer */
    .footer__text { fill: var(--text-muted); font-size: 10px; }
  `;
};
