import React, { useEffect, useState, useCallback, useRef } from 'react';
import { StyleSheet, View, Text, StatusBar, Pressable, Animated, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNetInfo } from '@react-native-community/netinfo';
import { NewsList } from '../components/NewsList';
import { Sidebar } from '../components/Sidebar';
import { fetchAllFeeds } from '../services/feedService';
import { NewsItem } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { RootStackParamList } from '../navigation/types';
import { ThemeIcon } from '../constants/sidebarConfig';
import { Moon } from '../icons';

const { width } = Dimensions.get('window');
const SIDEBAR_WIDTH = width * 0.75;
const SWIPE_THRESHOLD = 50;
const EDGE_WIDTH = 25;

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { theme, isDark, toggleTheme } = useTheme();
  const { getEnabledFeeds } = useApp();
  const netInfo = useNetInfo();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Derive connection status from netInfo
  // null means still determining, so we treat it as potentially connected
  const isConnected = netInfo.isConnected === null ? true : (netInfo.isConnected && netInfo.isInternetReachable !== false);

  const slideAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const isSidebarOpenRef = useRef(false);

  const openSidebar = useCallback(() => {
    isSidebarOpenRef.current = true;
    setSidebarOpen(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [slideAnim]);

  const closeSidebar = useCallback(() => {
    Animated.timing(slideAnim, {
      toValue: -SIDEBAR_WIDTH,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      isSidebarOpenRef.current = false;
      setSidebarOpen(false);
    });
  }, [slideAnim]);

  const navigateTo = useCallback((screen: keyof RootStackParamList) => {
    closeSidebar();
    setTimeout(() => {
      navigation.navigate(screen);
    }, 200);
  }, [closeSidebar, navigation]);

  // Edge swipe gesture for opening sidebar
  const edgePanGesture = Gesture.Pan()
    .onUpdate((event) => {
      const { translationX } = event;
      if (translationX > 0) {
        const newPosition = Math.min(0, -SIDEBAR_WIDTH + translationX);
        slideAnim.setValue(newPosition);
      }
    })
    .onEnd((event) => {
      const { translationX, velocityX } = event;
      if (translationX > SWIPE_THRESHOLD || velocityX > 500) {
        openSidebar();
      } else {
        Animated.timing(slideAnim, {
          toValue: -SIDEBAR_WIDTH,
          duration: 150,
          useNativeDriver: true,
        }).start();
      }
    });

  // Overlay gesture for closing sidebar
  const overlayPanGesture = Gesture.Pan()
    .onUpdate((event) => {
      const { translationX } = event;
      if (translationX < 0) {
        const newPosition = Math.max(-SIDEBAR_WIDTH, translationX);
        slideAnim.setValue(newPosition);
      }
    })
    .onEnd((event) => {
      const { translationX, velocityX } = event;
      if (translationX < -SWIPE_THRESHOLD || velocityX < -500) {
        closeSidebar();
      } else {
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }).start();
      }
    });

  const loadNews = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const enabledFeeds = getEnabledFeeds();

      if (!isConnected) {
        setError('No internet connection. Please check your network and try again.');
        return;
      }

      const items = await fetchAllFeeds(enabledFeeds);

      if (items.length > 0) {
        setNews(items);
      } else {
        setError('Unable to load news. Check your connection or enable more sources.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error('Error loading news:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [getEnabledFeeds, isConnected]);

  // Track if initial load has happened
  const hasLoadedRef = useRef(false);

  // Initial load - wait for network info to be determined
  useEffect(() => {
    // Only load once, and wait for netInfo to be determined (not null)
    if (!hasLoadedRef.current && netInfo.isConnected !== null) {
      hasLoadedRef.current = true;
      loadNews();
    }
  }, [loadNews, netInfo.isConnected]);

  // Only reload when returning from Sources screen (where feeds may have changed)
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Skip if this is the initial mount or if we have news already
      if (hasLoadedRef.current && news.length > 0) {
        return;
      }
      loadNews();
    });
    return unsubscribe;
  }, [navigation, loadNews, news.length]);

  const handleRefresh = useCallback(() => {
    loadNews(true);
  }, [loadNews]);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const overlayOpacity = slideAnim.interpolate({
    inputRange: [-SIDEBAR_WIDTH, 0],
    outputRange: [0, 0.5],
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top']}>
        <View style={[styles.header, { backgroundColor: theme.background }]}>
          {/* Hamburger Button */}
          <Pressable
            onPress={openSidebar}
            style={styles.hamburger}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <View style={[styles.hamburgerLine, { backgroundColor: theme.text }]} />
            <View style={[styles.hamburgerLine, { backgroundColor: theme.text }]} />
            <View style={[styles.hamburgerLine, { backgroundColor: theme.text }]} />
          </Pressable>

          {/* Theme Toggle */}
          <Pressable
            onPress={toggleTheme}
            style={[styles.themeToggle]}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={[styles.themeToggleText, { color: theme.textSecondary }]}>
              {isDark ? <ThemeIcon width={20} height={20} color={theme.text} /> : <Moon width={20} height={20} color={theme.text} />}
            </Text>
          </Pressable>

          <Text style={[styles.title, { color: theme.text }]}>KHABAR</Text>
          <Text style={[styles.date, { color: theme.textMuted }]}>{today}</Text>
        </View>
        <View style={[styles.headerLine, { backgroundColor: theme.headerLine }]} />

        <NewsList
          items={news}
          loading={loading}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          error={error}
        />
      </SafeAreaView>

      {/* Left edge swipe zone */}
      {!sidebarOpen && (
        <GestureDetector gesture={edgePanGesture}>
          <View style={styles.edgeZone} />
        </GestureDetector>
      )}

      {/* Overlay when sidebar is open */}
      {sidebarOpen && (
        <GestureDetector gesture={overlayPanGesture}>
          <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
            <Pressable style={styles.overlayPressable} onPress={closeSidebar} />
          </Animated.View>
        </GestureDetector>
      )}

      {/* Sidebar */}
      <Animated.View
        style={[
          styles.sidebar,
          {
            backgroundColor: theme.background,
            borderRightColor: theme.separator,
            transform: [{ translateX: slideAnim }]
          }
        ]}
      >
        <Sidebar
          isOpen={sidebarOpen}
          onClose={closeSidebar}
          slideAnim={slideAnim}
          isEmbedded
          onOpenSavedArticles={() => navigateTo('Saved')}
          onOpenTextSize={() => navigateTo('TextSize')}
          onOpenManageSources={() => navigateTo('Sources')}
          onOpenSettings={() => navigateTo('Settings')}
          onOpenHelp={() => navigateTo('Help')}
          onOpenAbout={() => navigateTo('About')}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
    alignItems: 'center',
  },
  hamburger: {
    position: 'absolute',
    top: 12,
    left: 20,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  hamburgerLine: {
    width: 18,
    height: 2,
    borderRadius: 1,
  },
  themeToggle: {
    position: 'absolute',
    top: 10,
    right: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
  },
  themeToggleText: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 4,
  },
  date: {
    fontSize: 12,
    letterSpacing: 0.5,
    marginTop: 4,
  },
  headerLine: {
    height: 2,
    marginHorizontal: 20,
    marginBottom: 4,
  },
  edgeZone: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: EDGE_WIDTH,
    zIndex: 50,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
    zIndex: 100,
  },
  overlayPressable: {
    flex: 1,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH,
    zIndex: 101,
    borderRightWidth: 1,
  },
});
