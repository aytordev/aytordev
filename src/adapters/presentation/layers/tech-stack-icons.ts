export interface TechIcon {
  readonly abbr: string;
  readonly color: string;
}

export const TECH_ICONS: Readonly<Record<string, TechIcon>> = {
  typescript: { abbr: "TS", color: "#3178C6" },
  javascript: { abbr: "JS", color: "#F7DF1E" },
  rust: { abbr: "RS", color: "#DEA584" },
  go: { abbr: "GO", color: "#00ADD8" },
  python: { abbr: "PY", color: "#3776AB" },
  nix: { abbr: "NX", color: "#5277C3" },
  nixos: { abbr: "NO", color: "#5277C3" },
  docker: { abbr: "DK", color: "#2496ED" },
  kubernetes: { abbr: "K8", color: "#326CE5" },
  react: { abbr: "RE", color: "#61DAFB" },
  "node.js": { abbr: "NJ", color: "#339933" },
  pytorch: { abbr: "PT", color: "#EE4C2C" },
  tensorflow: { abbr: "TF", color: "#FF6F00" },
  langchain: { abbr: "LC", color: "#1C3C3C" },
};

export const getTechIcon = (name: string): TechIcon | null =>
  TECH_ICONS[name.toLowerCase()] ?? null;
