import React, { useRef, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  RefreshControl,
  View,
  Text,
  Pressable,
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { NewsItem } from '../types';
import { NewsItemCard } from './NewsItem';
import { SkeletonLoader } from './SkeletonLoader';
import { useTheme } from '../context/ThemeContext';
import ArrowUp from '../icons/ArrowUp';

interface Props {
  items: NewsItem[];
  loading: boolean;
  refreshing: boolean;
  onRefresh: () => void;
  error?: string | null;
}

const SCROLL_THRESHOLD = 300;

export const NewsList: React.FC<Props> = ({
  items,
  loading,
  refreshing,
  onRefresh,
  error,
}) => {
  const { theme } = useTheme();
  const flatListRef = useRef<FlatList>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const buttonOpacity = useRef(new Animated.Value(0)).current;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const shouldShow = offsetY > SCROLL_THRESHOLD;

    if (shouldShow !== showScrollTop) {
      setShowScrollTop(shouldShow);
      Animated.timing(buttonOpacity, {
        toValue: shouldShow ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleScrollToTop = () => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    // Trigger refresh after scrolling
    setTimeout(() => {
      onRefresh();
    }, 300);
  };

  if (loading && items.length === 0) {
    return <SkeletonLoader />;
  }

  if (error && items.length === 0) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: theme.background }]}>
        <Text style={[styles.errorTitle, { color: theme.text }]}>Unable to load</Text>
        <Text style={[styles.errorMessage, { color: theme.textSecondary }]}>{error}</Text>
        <Text style={[styles.retryHint, { color: theme.accent }]}>Pull down to retry</Text>
      </View>
    );
  }

  if (items.length === 0) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: theme.background }]}>
        <Text style={[styles.emptyTitle, { color: theme.text }]}>No stories</Text>
        <Text style={[styles.emptyMessage, { color: theme.textSecondary }]}>Pull down to refresh</Text>
      </View>
    );
  }

  const renderItem = ({ item, index }: { item: NewsItem; index: number }) => (
    <NewsItemCard item={item} />
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: theme.background }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.text}
            colors={[theme.text]}
            progressBackgroundColor={theme.background}
          />
        }
        ListFooterComponent={
          <View style={styles.listFooter}>
            <Text style={[styles.footerText, { color: theme.textMuted }]}>— End —</Text>
          </View>
        }
      />

      {/* Scroll to top & refresh button */}
      <Animated.View
        style={[
          styles.scrollTopButton,
          {
            backgroundColor: theme.text,
            opacity: buttonOpacity,
            transform: [{
              translateY: buttonOpacity.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            }],
          },
        ]}
        pointerEvents={showScrollTop ? 'auto' : 'none'}
      >
        <Pressable
          onPress={handleScrollToTop}
          style={styles.scrollTopPressable}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ArrowUp width={24} height={24} color={theme.background} />
          <Text style={[styles.scrollTopText, { color: theme.background }]}>Scroll to top</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryHint: {
    fontSize: 14,
    fontWeight: '500',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
  },
  listFooter: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  footerText: {
    fontSize: 13,
  },
  scrollTopButton: {
    position: 'absolute',
    bottom: 24,
    alignSelf: 'center',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  scrollTopPressable: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  scrollTopText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
