import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NewsItem, FeedCategory } from '../types';
import { RSS_FEEDS } from '../constants/feeds';

type TextSize = 'small' | 'medium' | 'large';

interface SourceConfig {
  url: string;
  name: string;
  slug: string;
  enabled: boolean;
  category: FeedCategory;
}

interface AppContextType {
  // Saved articles
  savedArticles: NewsItem[];
  saveArticle: (article: NewsItem) => void;
  unsaveArticle: (articleId: string) => void;
  isArticleSaved: (articleId: string) => boolean;

  // Text size
  textSize: TextSize;
  setTextSize: (size: TextSize) => void;
  getTextScale: () => number;

  // Notifications
  notificationsEnabled: boolean;
  toggleNotifications: () => void;

  // Sources
  sources: SourceConfig[];
  toggleSource: (url: string) => void;
  setSources: (sources: SourceConfig[]) => Promise<void>;
  getEnabledFeeds: () => { url: string; name: string; slug: string }[];

  // Onboarding
  hasCompletedOnboarding: boolean;
  isLoadingOnboarding: boolean;
  completeOnboarding: () => Promise<void>;
}

const STORAGE_KEYS = {
  SAVED_ARTICLES: '@khabar_saved_articles',
  TEXT_SIZE: '@khabar_text_size',
  NOTIFICATIONS: '@khabar_notifications',
  SOURCES: '@khabar_sources',
  ONBOARDING_COMPLETED: '@khabar_onboarding_completed',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [savedArticles, setSavedArticles] = useState<NewsItem[]>([]);
  const [textSize, setTextSizeState] = useState<TextSize>('medium');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [sources, setSourcesState] = useState<SourceConfig[]>(
    RSS_FEEDS.map(feed => ({ ...feed, enabled: true }))
  );
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [isLoadingOnboarding, setIsLoadingOnboarding] = useState(true);

  // Load saved data on mount
  useEffect(() => {
    loadStoredData();
  }, []);

  const loadStoredData = async () => {
    try {
      const [savedArticlesData, textSizeData, notificationsData, sourcesData, onboardingData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.SAVED_ARTICLES),
        AsyncStorage.getItem(STORAGE_KEYS.TEXT_SIZE),
        AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATIONS),
        AsyncStorage.getItem(STORAGE_KEYS.SOURCES),
        AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED),
      ]);

      // Load onboarding state first
      setHasCompletedOnboarding(onboardingData === 'true');
      setIsLoadingOnboarding(false);

      if (savedArticlesData) {
        try {
          setSavedArticles(JSON.parse(savedArticlesData));
        } catch {
          setSavedArticles([]);
        }
      }
      if (textSizeData && ['small', 'medium', 'large'].includes(textSizeData)) {
        setTextSizeState(textSizeData as TextSize);
      }
      if (notificationsData !== null) {
        setNotificationsEnabled(notificationsData === 'true');
      }
      if (sourcesData) {
        try {
          const parsed = JSON.parse(sourcesData);
          if (Array.isArray(parsed)) {
            // Merge stored preferences with current feed list (in case new feeds were added)
            const mergedSources = RSS_FEEDS.map(feed => {
              const stored = parsed.find((s: any) => s.url === feed.url);
              return {
                url: feed.url,
                name: feed.name,
                slug: feed.slug,
                category: feed.category,
                enabled: stored ? (stored.enabled === true || stored.enabled === 'true') : true,
              };
            });
            setSourcesState(mergedSources);
          }
        } catch {
          setSourcesState(RSS_FEEDS.map(feed => ({ ...feed, enabled: true })));
        }
      }
    } catch (error) {
      console.error('Error loading stored data:', error);
      setSourcesState(RSS_FEEDS.map(feed => ({ ...feed, enabled: true })));
    }
  };

  // Save article
  const saveArticle = useCallback(async (article: NewsItem) => {
    const updated = [article, ...savedArticles];
    setSavedArticles(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.SAVED_ARTICLES, JSON.stringify(updated));
  }, [savedArticles]);

  // Unsave article
  const unsaveArticle = useCallback(async (articleId: string) => {
    const updated = savedArticles.filter(a => a.id !== articleId);
    setSavedArticles(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.SAVED_ARTICLES, JSON.stringify(updated));
  }, [savedArticles]);

  // Check if article is saved
  const isArticleSaved = useCallback((articleId: string) => {
    return savedArticles.some(a => a.id === articleId);
  }, [savedArticles]);

  // Set text size
  const setTextSize = useCallback(async (size: TextSize) => {
    setTextSizeState(size);
    await AsyncStorage.setItem(STORAGE_KEYS.TEXT_SIZE, size);
  }, []);

  // Get text scale multiplier
  const getTextScale = useCallback(() => {
    switch (textSize) {
      case 'small': return 0.85;
      case 'large': return 1.15;
      default: return 1;
    }
  }, [textSize]);

  // Toggle notifications
  const toggleNotifications = useCallback(async () => {
    const newValue = !notificationsEnabled;
    setNotificationsEnabled(newValue);
    await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, String(newValue));
  }, [notificationsEnabled]);

  // Toggle source
  const toggleSource = useCallback(async (url: string) => {
    const updated = sources.map(source =>
      source.url === url ? { ...source, enabled: Boolean(!source.enabled) } : source
    );
    setSourcesState(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.SOURCES, JSON.stringify(updated));
  }, [sources]);

  // Set sources (for onboarding)
  const setSourcesConfig = useCallback(async (newSources: SourceConfig[]) => {
    setSourcesState(newSources);
    await AsyncStorage.setItem(STORAGE_KEYS.SOURCES, JSON.stringify(newSources));
  }, []);

  // Get enabled feeds
  const getEnabledFeeds = useCallback(() => {
    return sources
      .filter(s => s.enabled)
      .map(s => ({ url: s.url, name: s.name, slug: s.slug }));
  }, [sources]);

  // Complete onboarding
  const completeOnboarding = useCallback(async () => {
    setHasCompletedOnboarding(true);
    await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, 'true');
  }, []);

  return (
    <AppContext.Provider
      value={{
        savedArticles,
        saveArticle,
        unsaveArticle,
        isArticleSaved,
        textSize,
        setTextSize,
        getTextScale,
        notificationsEnabled,
        toggleNotifications,
        sources,
        toggleSource,
        setSources: setSourcesConfig,
        getEnabledFeeds,
        hasCompletedOnboarding,
        isLoadingOnboarding,
        completeOnboarding,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
