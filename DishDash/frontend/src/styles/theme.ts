export const theme = {
  colors: {
    bg: "#fcfcfcff",
    panel: "#FAFAFA",
    border: "rgba(255,255,255,0.08)",
    text: "#000000",
    muted: "#000000",
    active: "#3b82f6",
	check: "yellow"
  },
  radius: {
    md: "12px",
  },
} as const;

export type AppTheme = typeof theme;