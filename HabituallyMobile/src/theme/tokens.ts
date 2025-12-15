// src/theme/tokens.ts
export const colors = {
  background: "#FFFFFF",
  backgroundAlt: "#F5F5F5",
  surface: "#FFFFFF",
  surfaceAlt: "#F3F4F6",
  primary: "#111827",       
  primaryText: "#FFFFFF",
  mutedText: "#6B7280",
  border: "#E5E7EB",
  success: "#10B981",
  danger: "#EF4444",
};

export const spacing = (n: number) => 8 * n; // 8-pt system

export const radii = {
  sm: 8,
  md: 12,
  lg: 20,
  xl: 28,
  pill: 999,
};

export const type = {
  h1: { fontSize: 24, fontWeight: "700" as const },
  h2: { fontSize: 18, fontWeight: "600" as const },
  body: { fontSize: 16, fontWeight: "400" as const },
  small: { fontSize: 13, fontWeight: "400" as const },
};


