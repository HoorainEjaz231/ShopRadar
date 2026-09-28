import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, radius, spacing, shadows } from '../../theme';

// A generic surface — background-faf fill, radius-lg, 1px white border,
// shadow-card. The border and shadow are a pair; both always ship together,
// the border is what keeps the shadow from reading as muddy against the
// screen background. Content is composed by the caller (product row, order
// row, admin metric tile, ...).
export default function Card({ children, onPress, style, contentStyle }) {
  const Wrapper = onPress ? TouchableOpacity : View;

  return (
    <Wrapper onPress={onPress} activeOpacity={onPress ? 0.85 : undefined} style={[styles.card, style]}>
      <View style={[styles.content, contentStyle]}>{children}</View>
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.backgroundFaf,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.white,
    ...shadows.card,
  },
  content: {
    padding: spacing.space4,
  },
});
