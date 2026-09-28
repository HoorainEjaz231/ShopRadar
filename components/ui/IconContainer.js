import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../../theme';

// The three fixed icon-badge shapes from the design system — reuse these
// exact sizes rather than inventing a fourth. Absolutely-positioned or not,
// width/height are always explicit numbers, never aspectRatio.
const VARIANTS = {
  forward: { size: 22, radius: radius.pill, fill: '#F5F8F8', border: false },
  drilldown: { size: 24, radius: radius.sm, fill: '#F5F8F8', border: false },
  header: { size: spacing.touchTarget, radius: radius.pill, fill: colors.backgroundFaf, border: true },
};

export default function IconContainer({ variant = 'forward', children, style, onPress }) {
  const v = VARIANTS[variant] ?? VARIANTS.forward;
  const Wrapper = onPress ? TouchableOpacity : View;

  return (
    <Wrapper
      onPress={onPress}
      hitSlop={onPress ? { top: 8, bottom: 8, left: 8, right: 8 } : undefined}
      style={[
        styles.base,
        {
          width: v.size,
          height: v.size,
          borderRadius: v.radius,
          backgroundColor: v.fill,
          borderWidth: v.border ? 1 : 0,
          borderColor: colors.white,
        },
        style,
      ]}
    >
      {children}
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
