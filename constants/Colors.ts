/**
 * App color palette for فكّتك — light mode only.
 * Matches the design system in Home.tsx (Almarai + #01a736 green).
 *
 * Colors.light and Colors.dark both point to the same palette so the
 * template's useThemeColor keeps working unchanged.
 */

const primary = '#01a736';
const navy = '#001a6e';

export interface AppColors {
  // — Expo template keys —
  text: string;
  background: string;
  tint: string;
  icon: string;
  tabIconDefault: string;
  tabIconSelected: string;

  // — App semantic keys —
  card: string;
  mutedForeground: string;
  border: string;
  primary: string;
  primaryForeground: string;
  navy: string;
  accent: string;
  success: string;
  warning: string;
  danger: string;
}

export const palette: AppColors = {
  text: '#1f2937',
  background: '#f8fafc',
  tint: primary,
  icon: '#6b7280',
  tabIconDefault: '#6b7280',
  tabIconSelected: primary,

  card: '#ffffff',
  mutedForeground: '#6b7280',
  border: '#e2e8f0',
  primary,
  primaryForeground: '#ffffff',
  navy,
  accent: '#3b82f6', // info blue used in Home's notification popup
  success: '#01a736',
  warning: '#B45309',
  danger: '#ff4757',
};

export const Colors: { light: AppColors; dark: AppColors } = {
  light: palette,
  dark: palette,
};