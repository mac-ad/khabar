import React from 'react';
import {
  FlatList,
  StyleSheet,
  RefreshControl,
  View,
  Text,
  ActivityIndicator,
} from 'react-native';
import { NewsItem } from '../types';
import { NewsItemCard } from './NewsItem';
import { useTheme } from '../context/ThemeContext';

interface Props {
  items: NewsItem[];
  loading: boolean;
  refreshing: boolean;
  onRefresh: () => void;
  error?: string | null;
}

export const NewsList: React.FC<Props> = ({
  items,
  loading,
  refreshing,
  onRefresh,
  error,
}) => {
  const { theme } = useTheme();

  if (loading && items.length === 0) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="small" color={theme.text} />
        <Text style={[styles.loadingText, { color: theme.textSecondary }]}>Loading...</Text>
      </View>
    );
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
    <NewsItemCard item={item} isFirst={index === 0} />
  );

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
      style={{ backgroundColor: theme.background }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={theme.text}
          colors={[theme.text]}
        />
      }
      ListFooterComponent={
        <View style={styles.listFooter}>
          <Text style={[styles.footerText, { color: theme.textMuted }]}>— End —</Text>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
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
});
