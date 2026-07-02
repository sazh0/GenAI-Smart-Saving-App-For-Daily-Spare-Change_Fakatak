/**
 * useColors — returns the app palette (light mode only).
 *
 * Usage:
 *   const colors = useColors();
 *   <View style={{ backgroundColor: colors.card, borderColor: colors.border }} />
 */

import { palette, type AppColors } from '@/constants/Colors';

export function useColors(): AppColors {
  return palette;
}

export default useColors;