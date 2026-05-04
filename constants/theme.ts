export const colors = {
  background: "#131313",
  backgroundDim: "#131313",
  surface: "#1c1b1b",
  surfaceRaised: "#20201f",
  surfaceHigh: "#2a2a2a",
  surfaceHighest: "#353535",
  text: "#e5e2e1",
  textMuted: "#bdcab8",
  outline: "#3a3a3a",
  outlineStrong: "#5a5a5a",
  primary: "#6bde71",
  primaryStrong: "#36ab45",
  primaryDark: "#00390c",
  secondary: "#98d862",
  info: "#4ea1ff",
  danger: "#ffb4ab",
  modalBackdrop: "rgba(8, 9, 8, 0.8)",
  modalBackdropSoft: "rgba(19, 19, 19, 0.94)",
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radii = {
  sm: 4,
  md: 6,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

export const fonts = {
  regular: "SpaceGrotesk_400Regular",
  medium: "SpaceGrotesk_500Medium",
  bold: "SpaceGrotesk_700Bold",
} as const;

export const typography = {
  headline: {
    fontFamily: fonts.bold,
    letterSpacing: -0.8,
  },
  body: {
    fontFamily: fonts.regular,
  },
  labelMono: {
    fontFamily: fonts.medium,
    letterSpacing: 1.4,
    textTransform: "uppercase" as const,
  },
} as const;
