export const accentColors = {
  blue: {
    light: { base: "221 83% 53%", foreground: "210 40% 98%" },
    dark: { base: "217 91% 60%", foreground: "210 40% 98%" },
  },
  green: {
    light: { base: "142 71% 45%", foreground: "210 40% 98%" },
    dark: { base: "142 71% 45%", foreground: "210 40% 98%" },
  },
  red: {
    light: { base: "0 84% 60%", foreground: "210 40% 98%" },
    dark: { base: "0 84% 60%", foreground: "210 40% 98%" },
  },
  purple: {
    light: { base: "256 91% 65%", foreground: "210 40% 98%" },
    dark: { base: "256 91% 65%", foreground: "210 40% 98%" },
  },
  orange: {
    light: { base: "24 95% 53%", foreground: "210 40% 98%" },
    dark: { base: "24 95% 53%", foreground: "210 40% 98%" },
  },
  pink: {
    light: { base: "330 81% 60%", foreground: "210 40% 98%" },
    dark: { base: "330 81% 60%", foreground: "210 40% 98%" },
  },
  yellow: {
    light: { base: "48 96% 53%", foreground: "210 40% 98%" },
    dark: { base: "48 96% 53%", foreground: "210 40% 98%" },
  },
  teal: {
    light: { base: "172 66% 50%", foreground: "210 40% 98%" },
    dark: { base: "172 66% 50%", foreground: "210 40% 98%" },
  },
} as const;

export type AccentColor = keyof typeof accentColors;
