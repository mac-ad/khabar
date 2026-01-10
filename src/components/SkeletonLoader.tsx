import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface SkeletonItemProps {
  delay?: number;
}

const SkeletonItem: React.FC<SkeletonItemProps> = ({ delay = 0 }) => {
  const { theme, isDark } = useTheme();
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1200,
        easing: Easing.ease,
        useNativeDriver: true,
        delay,
      })
    );
    animation.start();
    return () => animation.stop();
  }, [shimmerAnim, delay]);

  const shimmerOpacity = shimmerAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 0.6, 0.3],
  });

  const baseColor = isDark ? '#333333' : '#E0E0E0';
  const highlightColor = isDark ? '#444444' : '#F0F0F0';

  return (
    <View style={[styles.item, { backgroundColor: theme.background }]}>
      {/* Source placeholder */}
      <Animated.View
        style={[
          styles.source,
          { backgroundColor: baseColor, opacity: shimmerOpacity },
        ]}
      />

      {/* Title placeholder - 2 lines */}
      <Animated.View
        style={[
          styles.titleLine,
          { backgroundColor: baseColor, opacity: shimmerOpacity },
        ]}
      />
      <Animated.View
        style={[
          styles.titleLine,
          styles.titleLineShort,
          { backgroundColor: baseColor, opacity: shimmerOpacity },
        ]}
      />

      {/* Tags placeholder */}
      <View style={styles.tagsRow}>
        <Animated.View
          style={[
            styles.tag,
            { backgroundColor: baseColor, opacity: shimmerOpacity },
          ]}
        />
        <Animated.View
          style={[
            styles.tag,
            styles.tagShort,
            { backgroundColor: baseColor, opacity: shimmerOpacity },
          ]}
        />
      </View>

      {/* Timestamp placeholder */}
      <Animated.View
        style={[
          styles.timestamp,
          { backgroundColor: baseColor, opacity: shimmerOpacity },
        ]}
      />
    </View>
  );
};

export const SkeletonLoader: React.FC = () => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <SkeletonItem delay={0} />
      <View style={[styles.separator, { backgroundColor: theme.separator }]} />
      <SkeletonItem delay={100} />
      <View style={[styles.separator, { backgroundColor: theme.separator }]} />
      <SkeletonItem delay={200} />
      <View style={[styles.separator, { backgroundColor: theme.separator }]} />
      <SkeletonItem delay={300} />
      <View style={[styles.separator, { backgroundColor: theme.separator }]} />
      <SkeletonItem delay={400} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  source: {
    width: 80,
    height: 12,
    borderRadius: 4,
    marginBottom: 12,
  },
  titleLine: {
    height: 18,
    borderRadius: 4,
    marginBottom: 8,
    width: '100%',
  },
  titleLineShort: {
    width: '70%',
    marginBottom: 14,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  tag: {
    width: 60,
    height: 24,
    borderRadius: 4,
  },
  tagShort: {
    width: 45,
  },
  timestamp: {
    width: 100,
    height: 12,
    borderRadius: 4,
  },
  separator: {
    height: 1,
    marginHorizontal: 20,
  },
});

