import { createContext, useContext, useEffect, useState } from "react";
import { AccentColor, accentColors } from "../lib/colors";

type Theme = "dark" | "light" | "system";

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
  const colorSet = accentColors[color][isDark ? "dark" : "light"];
  const root = document.documentElement;

  // Set the base accent color variables that our CSS system uses
  root.style.setProperty("--accent-base", colorSet.base);
  root.style.setProperty("--accent-base-foreground", colorSet.foreground);

  // Set primary color directly (this is what shadcn uses)
  root.style.setProperty("--primary", colorSet.base);
  root.style.setProperty("--primary-foreground", colorSet.foreground);
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
