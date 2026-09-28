import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import * as Icon from 'react-native-feather';
import { colors, radius, spacing, typography } from '../../theme';
import IconContainer from './IconContainer';

// The signature floating glass header. Absolutely positioned over scrollable
// content — never a solid opaque bar. Screens using this must pad their
// scrollable content by `spacing.headerHeight + insets.top` so nothing
// starts out hidden underneath the glass.
//
// `bottomSlot` folds a pinned row (search bar, filter chips) into the SAME
// glass panel rather than a separate static row underneath — a separate row
// has nothing behind it to blur and reads as flat/muddy instead of glass.
export default function GlassHeader({
  title,
  showBack = true,
  onBackPress,
  rightSlot,
  bottomSlot,
  bottomHairline = false,
}) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const handleBack = () => {
    if (onBackPress) return onBackPress();
    if (navigation?.canGoBack?.()) navigation.goBack();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <BlurView intensity={30} tint="light" style={StyleSheet.absoluteFill} />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.tabBarGlassTint }]} />

      <View style={[styles.row, { height: spacing.headerHeight }]}>
        <View style={styles.side}>
          {showBack && (
            <IconContainer variant="header" onPress={handleBack}>
              <Icon.ArrowLeft width={24} height={24} color={colors.textPrimary} strokeWidth={2} />
            </IconContainer>
          )}
        </View>

        <Text numberOfLines={1} style={[typography.headerTitle, styles.title]}>
          {title}
        </Text>

        <View style={[styles.side, styles.sideRight]}>{rightSlot}</View>
      </View>

      {bottomSlot ? <View style={styles.bottomSlot}>{bottomSlot}</View> : null}

      {bottomHairline && <View style={styles.hairline} />}
    </View>
  );
}

const SIDE_WIDTH = spacing.touchTarget;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.space5,
  },
  side: {
    width: SIDE_WIDTH,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  sideRight: {
    alignItems: 'flex-end',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    color: colors.textPrimary,
  },
  bottomSlot: {
    paddingHorizontal: spacing.space5,
    paddingBottom: spacing.space3,
  },
  hairline: {
    height: 1,
    backgroundColor: colors.white,
  },
});
