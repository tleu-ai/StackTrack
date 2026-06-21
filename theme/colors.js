// StackTrack — Performance Dark theme tokens
// Central color + font source of truth. Import these everywhere instead of
// hardcoding hex values, so a future theme switch is a one-file change.

export const colors = {
  bg: "#0E0F12",
  surface: "#17191F",
  surfaceAlt: "#1F222A",
  border: "#2A2E38",
  borderSoft: "#23262E",

  text: "#F4F5F7",
  textHi: "#EAECEF",
  textMid: "#D4D7DD",
  textMute: "#8A8F9C",
  textFaint: "#5A5F6B",

  accent: "#C8FF3D",      // electric lime
  accentDim: "#A9D636",
  accentHover: "#B2E62E",
  accentText: "#0E0F12",  // dark text that sits on the lime
  accentSoft: "#1E2410",  // lime-tinted dark (pill backgrounds)
  accentSoftAlt: "#2A3318",

  good: "#4ADE80",
  warn: "#FBBF24",
  bad: "#F87171",
  info: "#60A5FA",
};

// Category accent map (kept lime-forward to match the prototype, but available
// if you want per-type coloring later).
export const categoryPill = {
  bg: colors.accentSoft,
  text: colors.accent,
};

// Font families. These names must match what you load via expo-font (see
// README setup). If you skip custom fonts, RN falls back to system fonts and
// the app still works — just less distinctive.
export const fonts = {
  display: "Archivo_700Bold",
  displaySemi: "Archivo_600SemiBold",
  body: "Inter_400Regular",
  bodyMed: "Inter_500Medium",
  bodySemi: "Inter_600SemiBold",
  bodyBold: "Inter_700Bold",
  mono: "JetBrainsMono_500Medium",
};

// Reusable card style (the prototype's signature: surface + border + shadow)
export const cardStyle = {
  backgroundColor: colors.surface,
  borderWidth: 1,
  borderColor: colors.border,
  borderRadius: 14,
  // RN shadow (iOS) + elevation (Android)
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.4,
  shadowRadius: 12,
  elevation: 4,
};
