// theme.ts
import { TextStyle, useColorScheme } from "react-native";

export function useThemeColors() {
  const scheme = useColorScheme() || "light";
  const isDark = scheme === "dark";

  return {
    background: isDark ? "#000000" : "#ffffff",
    text: isDark ? "#ffffff" : "#000000",
    secondaryText: isDark ? "#aaaaaa" : "#555555",
    buttonBg: "#007aff",   // iOS blue
    buttonText: "#ffffff", // always white
    border: isDark ? "#444444" : "#cccccc",
    card: isDark ? "#1c1c1e" : "#f9f9f9",
    placeholder: isDark ? "#777777" : "#999999",
  };
}

// HIG-aligned typography scale
export const typography: Record<string, TextStyle> = {
  largeTitle: {
    fontSize: 28,
    fontWeight: "700",
    lineHeight: 34,
  },
  title1: {
    fontSize: 22,
    fontWeight: "600",
    lineHeight: 28,
  },
  title2: {
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 24,
  },
  body: {
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 22,
  },
  caption: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 18,
  },
};

// Spacing scale (HIG 8pt rhythm)
export const spacing = {
  xs: 4,   // tiny adjustments
  sm: 8,   // small gaps
  md: 16,  // default padding/margin
  lg: 24,  // section spacing
  xl: 32,  // large separation
  xxl: 48, // very large gaps
};
