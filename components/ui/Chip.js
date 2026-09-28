import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';

// A single wrapping filter chip. Selected steps up from Medium to SemiBold
// weight AND fills solid at the same time — selection is felt in weight and
// shape, not color alone. Gaps live on the chip itself (margin), not the
// row, so a wrapped row stays evenly spaced in both directions.
export default function Chip({ label, selected = false, onPress, style }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[styles.base, selected ? styles.selected : styles.unselected, style]}
    >
      <Text style={[selected ? typography.chipSelected : typography.chip, selected ? styles.selectedText : styles.unselectedText]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.pill,
    paddingHorizontal: spacing.space4,
    paddingVertical: spacing.space2,
    marginRight: spacing.space2,
    marginBottom: spacing.space2,
  },
  unselected: {
    backgroundColor: colors.backgroundFaf,
  },
  selected: {
    backgroundColor: colors.primary,
  },
  unselectedText: {
    color: colors.textGray,
  },
  selectedText: {
    color: colors.white,
  },
});
