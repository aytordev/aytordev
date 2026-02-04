export interface ThemeColors {
  // Backgrounds
  bg: string;
  bgTuft: string; // Lighter background for UI elements
  bgDark: string; // Darker background for status bars

  // Foreground (Text)
  text: string;
  textMuted: string;
  textSecondary: string;

  // UI Elements
  border: string;
  selection: string;

  // Palette (Kanagawa colors)
  fujiWhite: string;
  fujiGray: string;
  oldWhite: string;
  sumiInk0: string;
  sumiInk1: string;
  sumiInk2: string;
  sumiInk3: string;
  sumiInk4: string;
  waveBlue1: string;
  waveBlue2: string;
  winterGreen: string;
  winterYellow: string;
  winterRed: string;
  winterBlue: string;
  autumnGreen: string;
  autumnRed: string;
  autumnYellow: string;
  samuraiRed: string;
  roninYellow: string;
  springViolet1: string;
  springViolet2: string;
  springBlue: string;
  springGreen: string;
  carpYellow: string;
  sakuraPink: string;
  waveRed: string;
  peachRed: string;
  surimiOrange: string;
  crystalBlue: string;
  oniViolet: string;
  dragonBlue: string;
  springCyan: string; // Added for completeness if needed, or map from others
}

export interface ThemeEffects {
  glow: boolean;
  gradient: boolean;
}

export interface Theme {
  name: string;
  colors: ThemeColors;
  effects?: ThemeEffects;
}
