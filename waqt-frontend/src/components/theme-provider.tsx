import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";
type AccentColor =
  | "blue"
  | "green"
  | "red"
  | "purple"
  | "orange"
  | "pink"
  | "yellow"
  | "teal";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  defaultAccentColor?: AccentColor;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  accentColor: AccentColor;
  setAccentColor: (color: AccentColor) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  accentColor: "blue",
  setAccentColor: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

// Helper function to generate CSS variables for an accent color
const generateAccentColorVariables = (color: AccentColor, isDark: boolean) => {
  // You can adjust these values based on your needs
  const colors = {
    blue: { light: "#0066ff", dark: "#3385ff" },
    green: { light: "#10B981", dark: "#34D399" },
    red: { light: "#EF4444", dark: "#F87171" },
    purple: { light: "#8B5CF6", dark: "#A78BFA" },
    orange: { light: "#F97316", dark: "#FB923C" },
    pink: { light: "#EC4899", dark: "#F472B6" },
    yellow: { light: "#EAB308", dark: "#FACC15" },
    teal: { light: "#14B8A6", dark: "#2DD4BF" },
  };

  const baseColor = isDark ? colors[color].dark : colors[color].light;
  const root = document.documentElement;

  // Set the main accent color
  root.style.setProperty("--accent", baseColor);

  // Set different opacity variants
  root.style.setProperty("--accent-foreground", isDark ? "#fff" : "#000");
  root.style.setProperty("--accent-hover", `${baseColor}dd`);
  root.style.setProperty("--accent-muted", `${baseColor}33`);
};

export function ThemeProvider({
  children,
  defaultTheme = "system",
  defaultAccentColor = "blue",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );

  const [accentColor, setAccentColor] = useState<AccentColor>(
    () =>
      (localStorage.getItem(`${storageKey}-accent`) as AccentColor) ||
      defaultAccentColor
  );

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    let effectiveTheme: "light" | "dark";

    if (theme === "system") {
      effectiveTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    } else {
      effectiveTheme = theme;
    }

    root.classList.add(effectiveTheme);
    generateAccentColorVariables(accentColor, effectiveTheme === "dark");

    // Listen for system theme changes
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => {
        const newTheme = mediaQuery.matches ? "dark" : "light";
        root.classList.remove("light", "dark");
        root.classList.add(newTheme);
        generateAccentColorVariables(accentColor, mediaQuery.matches);
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme, accentColor]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
    accentColor,
    setAccentColor: (color: AccentColor) => {
      localStorage.setItem(`${storageKey}-accent`, color);
      setAccentColor(color);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
