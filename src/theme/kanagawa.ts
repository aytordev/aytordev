import type { Theme } from "./types";

/**
 * Kanagawa Wave Theme
 * Source: https://github.com/rebelot/kanagawa.nvim
 * Variant: Wave (Default)
 */
export const KanagawaTheme: Theme = {
  name: "kanagawa-wave",
  colors: {
    // Semantic Colors (mapped)
    bg: "#1F1F28", // sumiInk1
    bgTuft: "#2A2A37", // sumiInk2
    bgDark: "#16161D", // sumiInk0

    text: "#DCD7BA", // fujiWhite
    textMuted: "#727169", // fujiGray
    textSecondary: "#C8C093", // oldWhite

    border: "#2A2A37", // sumiInk2
    selection: "#223249", // waveBlue1

    // Palette Definition
    fujiWhite: "#DCD7BA",
    fujiGray: "#727169",
    oldWhite: "#C8C093",

    sumiInk0: "#16161D",
    sumiInk1: "#1F1F28",
    sumiInk2: "#2A2A37",
    sumiInk3: "#363646",
    sumiInk4: "#54546D",

    waveBlue1: "#223249",
    waveBlue2: "#2D4F67",

    winterGreen: "#2B3328",
    winterYellow: "#49443C",
    winterRed: "#43242B",
    winterBlue: "#252535",

    autumnGreen: "#76946A",
    autumnRed: "#C34043",
    autumnYellow: "#DCA561",

    samuraiRed: "#E82424",
    roninYellow: "#FF9E3B",

    springViolet1: "#938AA9",
    springViolet2: "#9CABCA",
    springBlue: "#7FB4CA",
    springGreen: "#98BB6C",
    springCyan: "#7AA89F",

    carpYellow: "#E6C384",
    sakuraPink: "#D27E99",
    waveRed: "#E46876",
    peachRed: "#FF5D62",
    surimiOrange: "#FFA066",
    crystalBlue: "#7E9CD8",
    oniViolet: "#957FB8",
    dragonBlue: "#658594",
  },
  effects: {
    glow: false,
    gradient: true,
  },
};
