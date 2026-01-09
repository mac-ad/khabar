import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
} from 'react-native';
import * as Linking from 'expo-linking';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { NewsItem } from '../types';

export const SavedArticlesScreen: React.FC = () => {
  const { theme } = useTheme();
  const { savedArticles, unsaveArticle, getTextScale } = useApp();

  const scale = getTextScale();

  const handleOpenArticle = (link: string) => {
    if (link) {
      Linking.openURL(link);
    }
  };

  const renderItem = ({ item }: { item: NewsItem }) => (
    <View style={[styles.articleRow, { borderBottomColor: theme.separator }]}>
      <Pressable
        style={styles.articleContent}
        onPress={() => handleOpenArticle(item.link)}
      >
        <Text style={[styles.source, { color: theme.textSecondary }]}>
          {item.source}
        </Text>
        <Text
          style={[styles.articleTitle, { color: theme.text, fontSize: 16 * scale }]}
          numberOfLines={3}
        >
          {item.title}
        </Text>
        {item.pubDate && (
          <Text style={[styles.time, { color: theme.textMuted }]}>
            {item.pubDate}
          </Text>
        )}
      </Pressable>
      <Pressable
        onPress={() => unsaveArticle(item.id)}
        style={styles.removeButton}
        hitSlop={10}
      >
        <Text style={[styles.removeIcon, { color: theme.textMuted }]}>✕</Text>
      </Pressable>
    </View>
  );

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={[styles.emptyIcon, { color: theme.textMuted }]}>☆</Text>
      <Text style={[styles.emptyTitle, { color: theme.text }]}>
        No saved articles
      </Text>
      <Text style={[styles.emptyText, { color: theme.textMuted }]}>
        Tap the bookmark icon on any article to save it for later reading
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {savedArticles.length > 0 && (
        <View style={[styles.summary, { borderBottomColor: theme.separator }]}>
          <Text style={[styles.summaryText, { color: theme.textMuted }]}>
            {savedArticles.length} article{savedArticles.length !== 1 ? 's' : ''} saved
          </Text>
        </View>
      )}

      {savedArticles.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          data={savedArticles}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  summary: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  summaryText: {
    fontSize: 14,
  },
  listContent: {
    paddingBottom: 40,
  },
  articleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  articleContent: {
    flex: 1,
  },
  source: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  articleTitle: {
    fontWeight: '600',
    lineHeight: 22,
  },
  time: {
    fontSize: 12,
    marginTop: 8,
  },
  removeButton: {
    marginLeft: 16,
    padding: 8,
  },
  removeIcon: {
    fontSize: 18,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
});
