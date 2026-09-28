import { Platform } from 'react-native';

// React Native has no CSS box-shadow string — these are the same two shadows
// from the source tokens (`shadow-card` / `shadow-modal`) expressed as
// shadow*/elevation style objects.
const shadow = (color, offsetY, opacity, blurRadius, elevation) =>
  Platform.select({
    android: { elevation },
    default: {
      shadowColor: color,
      shadowOffset: { width: 0, height: offsetY },
      shadowOpacity: opacity,
      shadowRadius: blurRadius,
    },
  });

export const shadows = {
  // Barely-there card lift — colored from primary at 6% opacity, not black.
  // Always paired with a 1px white border, never used alone.
  card: shadow('#0B5A66', 5, 0.06, 12, 3),

  // Alert/modal card elevation over the dimmed backdrop.
  modal: shadow('#000000', 4, 0.25, 10, 8),
};
