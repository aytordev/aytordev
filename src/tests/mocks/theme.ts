import type { Theme } from "../../theme/types";

export const createMockTheme = (): Theme => ({
  name: "mock-theme",
  colors: {
    // Backgrounds
    bg: "#1F1F28",
    bgTuft: "#2A2A37",
    bgDark: "#16161D",

    // Foreground (Text)
    text: "#DCD7BA",
    textMuted: "#727169",
    textSecondary: "#C8C093",

    // UI Elements
    border: "#54546D",
    selection: "#2D4F67",

    // Palette (Kanagawa colors)
    fujiWhite: "#DCD7BA",
    fujiGray: "#727169",
    oldWhite: "#C8C093",
    sumiInk0: "#16161D",
    sumiInk1: "#1F1F28",
    sumiInk2: "#2A2A37",
    sumiInk3: "#363646",
    sumiInk4: "#54546D",
    sumiInk5: "#717C7C",
    sumiInk6: "#C8C093",
    waveBlue1: "#223249",
    waveBlue2: "#2D4F67",
    winterGreen: "#2B3328",
    winterYellow: "#49443C",
    winterRed: "#43242B",
    winterBlue: "#252535",
    autumnGreen: "#76946A",
    autumnRed: "#C34043",
    autumnOrange: "#DCA561",
    autumnYellow: "#C0A36E",
    samuraiRed: "#E82424",
    roninYellow: "#FF9E3B",
    springViolet1: "#938AA9",
    springViolet2: "#9CABCA",
    springBlue: "#7E9CD8",
    springGreen: "#98BB6C",
    waveAqua: "#7FB4CA",
    carpYellow: "#E6C384",
    sakuraPink: "#D27E99",
    waveRed: "#E46876",
    peachRed: "#FF5D62",
    surimiOrange: "#FFA066",
    crystalBlue: "#7FB4CA",
    oniViolet: "#957FB8",
    dragonBlue: "#658594",
    springCyan: "#7AA89F",
  },
  effects: {
    glow: false,
    gradient: false,
  },
});
