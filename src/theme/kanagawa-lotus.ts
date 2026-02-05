import type { Theme } from "./types";

/**
 * Kanagawa Lotus Theme (Light Variant)
 */
export const KanagawaLotusTheme: Theme = {
  name: "kanagawa-lotus",
  colors: {
    // Semantic Colors (Light Mode)
    bg: "#f2ecbc", // sumiInk1 (Paper color)
    bgTuft: "#e5ddb0", // sumiInk2
    bgDark: "#e5ddb0", // sumiInk4

    text: "#545464", // sumiInk6 (Ink color)
    textMuted: "#716e61", // fujiGray
    textSecondary: "#43436c", // sumiInk4 (Deep blueish ink)

    border: "#9a9aab",
    selection: "#d7d7d7", // waveBlue1 (Light selection)

    // Palette Definition
    sumiInk0: "#f2ecbc", // Base
    sumiInk1: "#e5ddb0",
    sumiInk2: "#d5d5d5",
    sumiInk3: "#c9c9d5",
    sumiInk4: "#aeb6c4",
    sumiInk5: "#9a9aab",
    sumiInk6: "#7e8392",

    fujiWhite: "#545464", // Ink
    fujiGray: "#716e61",
    oldWhite: "#43436c",

    waveBlue1: "#d0d0e0",
    waveBlue2: "#babbc4",

    winterGreen: "#699472",
    winterYellow: "#9a9a83",
    winterRed: "#a65656",
    winterBlue: "#9faacf",

    autumnGreen: "#6F8F72",
    autumnRed: "#C34043",
    autumnOrange: "#DCA561",
    autumnYellow: "#DCA561",

    samuraiRed: "#E82424",
    roninYellow: "#FF9E3B",

    springViolet1: "#938AA9",
    springViolet2: "#9CABCA",
    springBlue: "#4d699b",
    springGreen: "#6693bf", // Lotus Green-Blue
    springCyan: "#597b75",

    waveAqua: "#5e857a",
    carpYellow: "#c4a363",
    sakuraPink: "#b35b79",
    waveRed: "#c84053", // Lotus Pink/Red
    peachRed: "#d95e67",
    surimiOrange: "#cd6d46",
    crystalBlue: "#4d5b8f",
    oniViolet: "#a09cac",
    dragonBlue: "#658594",
  },
  effects: {
    glow: false,
    gradient: true,
  },
};
