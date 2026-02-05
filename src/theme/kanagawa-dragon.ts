import type { Theme } from "./types";

export const KanagawaDragonTheme: Theme = {
  name: "kanagawa-dragon",
  colors: {
    // Semantic Colors
    bg: "#181616", // sumiInk2 (Dragon Black)
    bgTuft: "#1D1C19", // sumiInk3
    bgDark: "#121212", // sumiInk1

    text: "#c5c9c5", // fujiWhite
    textMuted: "#727169", // fujiGray
    textSecondary: "#c8c093", // oldWhite

    border: "#1D1C19", // sumiInk3
    selection: "#2D4F67", // waveBlue2

    // Palette Definition
    fujiWhite: "#c5c9c5",
    fujiGray: "#727169",
    oldWhite: "#c8c093",

    sumiInk0: "#0d0c0c",
    sumiInk1: "#121212",
    sumiInk2: "#181616",
    sumiInk3: "#1D1C19",
    sumiInk4: "#282727",
    sumiInk5: "#393836",
    sumiInk6: "#54546D", // Fallback

    waveBlue1: "#223249",
    waveBlue2: "#2D4F67",

    winterGreen: "#2B3328",
    winterYellow: "#49443C",
    winterRed: "#43242B",
    winterBlue: "#252535",

    autumnGreen: "#76946A",
    autumnRed: "#C34043",
    autumnOrange: "#DCA561",
    autumnYellow: "#DCA561",

    samuraiRed: "#E82424",
    roninYellow: "#FF9E3B",

    springViolet1: "#938AA9",
    springViolet2: "#9CABCA",
    springBlue: "#7FB4CA",
    springGreen: "#98BB6C",
    springCyan: "#7AA89F",

    waveAqua: "#7AA89F",
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
