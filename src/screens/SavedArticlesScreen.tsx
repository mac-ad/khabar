import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  Animated,
} from 'react-native';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { NewsItem } from '../types';
import { RootStackParamList } from '../navigation/types';
import RenderHTML from 'react-native-render-html';

export const SavedArticlesScreen: React.FC = () => {
  const { theme } = useTheme();
  const { savedArticles, unsaveArticle, getTextScale } = useApp();
  const [hasAnimated, setHasAnimated] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const scale = getTextScale();

  // Only animate on initial mount
  useEffect(() => {
    const timer = setTimeout(() => setHasAnimated(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleOpenArticle = (article: NewsItem) => {
    navigation.navigate('ArticleDetail', { article });
  };

  const AnimatedItem = ({ item, index }: { item: NewsItem; index: number }) => {
    const fadeAnim = useRef(new Animated.Value(hasAnimated ? 1 : 0)).current;
    const slideAnim = useRef(new Animated.Value(hasAnimated ? 0 : 30)).current;

    useEffect(() => {
      if (!hasAnimated) {
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            delay: index * 50,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            delay: index * 50,
            useNativeDriver: true,
          }),
        ]).start();
      }
    }, [fadeAnim, slideAnim, index]);

    return (
      <Animated.View
        style={[
          styles.articleRow,
          { borderBottomColor: theme.separator },
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Pressable
          style={styles.articleContent}
          onPress={() => handleOpenArticle(item)}
        >
          <Text style={[styles.source, { color: theme.textSecondary }]}>
            {item.sourceName}
          </Text>
          <RenderHTML
            contentWidth={300}
            source={{ html: item.title }}
            baseStyle={{
              color: theme.text,
              fontSize: 16 * scale,
              lineHeight: 22 * scale,
              fontWeight: '600',
              marginBottom: 8,
            }}
            tagsStyles={{
              body: { color: theme.text, fontSize: 16 * scale, lineHeight: 22 * scale, fontWeight: '600', marginBottom: 8 },
            }}
          />
          {item.pubDate && (
            <Text style={[styles.time, { color: theme.textMuted }]}>
              {item.pubDate}
            </Text>
          )}
        </Pressable>
        <Pressable
          onPress={() => unsaveArticle(item.id)}
          style={styles.removeButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={[styles.removeIcon, { color: theme.textMuted }]}>✕</Text>
        </Pressable>
      </Animated.View>
    );
  };

  const renderItem = ({ item, index }: { item: NewsItem; index: number }) => (
    <AnimatedItem item={item} index={index} />
  );

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <LottieView
        source={require('../assets/animations/empty.json')}
        autoPlay
        loop
        style={styles.emptyAnimation}
        colorFilters={[
          { keypath: 'Paper', color: theme.text },
          { keypath: 'Line 1', color: theme.text },
          { keypath: 'Line 2', color: theme.text },
          { keypath: 'Line 3', color: theme.text },
        ]}
      />
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
  emptyAnimation: {
    width: 150,
    height: 150,
    marginBottom: 16,
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
