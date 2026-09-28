import React from 'react';
import { View, ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';

// Equal-width pill-track segmented control for 2-3 options — every slot is
// a fixed-width fraction of the track regardless of label length or
// selection, so selecting one option can never shift the others. Past 3
// options equal-division crushes labels too small to read, so this falls
// back to a horizontally-scrolling row of content-sized chips instead.
export default function SegmentedTabs({ options, selected, onSelect }) {
  if (options.length > 3) {
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollTrack}>
        {options.map((opt) => {
          const isSelected = opt.value === selected;
          return (
            <TouchableOpacity
              key={opt.value}
              onPress={() => onSelect(opt.value)}
              style={[styles.scrollSlot, isSelected && styles.scrollSlotSelected]}
            >
              <Text
                numberOfLines={1}
                style={[
                  isSelected ? typography.chipSelected : typography.chip,
                  { color: isSelected ? colors.white : colors.textGray },
                ]}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    );
  }

  return (
    <View style={styles.track}>
      {options.map((opt) => {
        const isSelected = opt.value === selected;
        return (
          <TouchableOpacity
            key={opt.value}
            onPress={() => onSelect(opt.value)}
            style={[styles.slot, isSelected && styles.slotSelected]}
          >
            <Text
              numberOfLines={1}
              style={[
                isSelected ? typography.chipSelected : typography.chip,
                { color: isSelected ? colors.white : colors.textPrimary },
              ]}
            >
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundFaf,
    borderWidth: 1,
    borderColor: colors.white,
    borderRadius: radius.pill,
    overflow: 'hidden',
    padding: 4,
  },
  slot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.space2,
    borderRadius: radius.pill,
  },
  slotSelected: {
    backgroundColor: colors.primary,
  },
  scrollTrack: {
    gap: spacing.space2,
  },
  scrollSlot: {
    paddingHorizontal: spacing.space4,
    paddingVertical: spacing.space2,
    borderRadius: radius.pill,
    backgroundColor: colors.backgroundFaf,
  },
  scrollSlotSelected: {
    backgroundColor: colors.primary,
  },
});
