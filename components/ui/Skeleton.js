import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { radius } from '../../theme';

// Shape-matched shimmer loading placeholder — never a bare spinner for a
// list/card-shaped area. Two primitives only (circle / rectangle); compose
// real layouts from just these. Deliberately its own fixed palette, not
// theme tokens, so it reads consistently everywhere it's used.
const BASE = '#E7EEF0';
const HIGHLIGHT = '#F6FAFA';

export default function Skeleton({ width, height, shape = 'rect', style }) {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 600, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  const opacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 0.4] });

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          backgroundColor: BASE,
          borderRadius: shape === 'circle' ? width / 2 : radius.xs,
          opacity,
        },
        style,
      ]}
    />
  );
}

// Exported for callers that want the raw shimmer tone (e.g. a highlight
// sweep layered on top) without pulling in the animated primitive itself.
export const skeletonPalette = { base: BASE, highlight: HIGHLIGHT };
