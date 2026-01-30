import React, { useState, useRef, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  FlatList,
  Animated,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Rect, Line } from 'react-native-svg';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useApp } from '../context/AppContext';

const { width } = Dimensions.get('window');

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;
};

interface OnboardingSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  isSourceSelection?: boolean;
}

// Custom icons for onboarding
const NewsIcon = () => (
  <Svg width={120} height={120} viewBox="0 0 120 120" fill="none">
    <Rect x="15" y="20" width="90" height="80" rx="4" stroke="#000" strokeWidth="3" fill="none" />
    <Line x1="25" y1="35" x2="95" y2="35" stroke="#000" strokeWidth="3" />
    <Line x1="25" y1="50" x2="70" y2="50" stroke="#000" strokeWidth="2" />
    <Line x1="25" y1="62" x2="80" y2="62" stroke="#000" strokeWidth="2" />
    <Line x1="25" y1="74" x2="60" y2="74" stroke="#000" strokeWidth="2" />
    <Rect x="75" y="50" width="20" height="24" stroke="#000" strokeWidth="2" fill="none" />
  </Svg>
);

const SourcesIcon = () => (
  <Svg width={120} height={120} viewBox="0 0 120 120" fill="none">
    <Rect x="15" y="20" width="35" height="35" rx="4" stroke="#000" strokeWidth="3" fill="none" />
    <Rect x="70" y="20" width="35" height="35" rx="4" stroke="#000" strokeWidth="3" fill="none" />
    <Rect x="15" y="65" width="35" height="35" rx="4" stroke="#000" strokeWidth="3" fill="none" />
    <Rect x="70" y="65" width="35" height="35" rx="4" stroke="#000" strokeWidth="3" fill="none" />
    <Circle cx="32.5" cy="37.5" r="8" fill="#000" />
    <Circle cx="87.5" cy="37.5" r="8" fill="#000" />
    <Circle cx="32.5" cy="82.5" r="8" fill="#000" />
    <Circle cx="87.5" cy="82.5" r="8" fill="#000" />
  </Svg>
);

const SaveIcon = () => (
  <Svg width={120} height={120} viewBox="0 0 120 120" fill="none">
    <Path
      d="M60 100L25 55V20C25 17.2386 27.2386 15 30 15H90C92.7614 15 95 17.2386 95 20V55L60 100Z"
      stroke="#000"
      strokeWidth="3"
      fill="none"
    />
    <Path
      d="M60 85L35 50V25H85V50L60 85Z"
      fill="#000"
    />
  </Svg>
);

// Fallback icon component that uses View-based rendering
const KhabarIcon = () => (
  <View style={styles.khabarIcon}>
    <Text style={styles.khabarIconText}>K</Text>
    <View style={styles.khabarIconLine} />
    <View style={[styles.khabarIconLine, { width: 60, marginTop: 6 }]} />
  </View>
);

const CheckIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
    <Path d="M4 10L8 14L16 6" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
  const { completeOnboarding, setSources, sources } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoadingSources, setIsLoadingSources] = useState(true);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  // Get available feeds from sources (dynamically loaded)
  const availableFeeds = useMemo(() => sources, [sources]);

  // Initialize selected sources - only local by default
  const [selectedSources, setSelectedSources] = useState<Set<string>>(new Set());

  // Update selected sources when sources are loaded
  useEffect(() => {
    if (sources.length > 0) {
      const localSources = sources.filter(f => f.category === 'local').map(f => f.url);
      setSelectedSources(new Set(localSources));
      setIsLoadingSources(false);
    }
  }, [sources]);

  const localFeeds = useMemo(() => availableFeeds.filter(f => f.category === 'local'), [availableFeeds]);
  const internationalFeeds = useMemo(() => availableFeeds.filter(f => f.category === 'international'), [availableFeeds]);

  const toggleSourceSelection = (url: string) => {
    setSelectedSources(prev => {
      const newSet = new Set(prev);
      if (newSet.has(url)) {
        newSet.delete(url);
      } else {
        newSet.add(url);
      }
      return newSet;
    });
  };

  const selectAllLocal = () => {
    setSelectedSources(prev => {
      const newSet = new Set(prev);
      localFeeds.forEach(f => newSet.add(f.url));
      return newSet;
    });
  };

  const selectAllInternational = () => {
    setSelectedSources(prev => {
      const newSet = new Set(prev);
      internationalFeeds.forEach(f => newSet.add(f.url));
      return newSet;
    });
  };

  const slides: OnboardingSlide[] = [
    {
      id: '1',
      title: 'Welcome to Khabar',
      subtitle: 'Your Daily News Digest',
      description: 'Stay informed with curated news from trusted sources, all in one clean, distraction-free app.',
      icon: <KhabarIcon />,
    },
    {
      id: '2',
      title: 'Choose Your Sources',
      subtitle: 'Personalize Your Feed',
      description: 'Select the news sources you want to follow. You can change this anytime in settings.',
      icon: <SourcesIcon />,
      isSourceSelection: true,
    },
    {
      id: '3',
      title: 'Save for Later',
      subtitle: 'Never Miss Important News',
      description: 'Bookmark articles to read later. Your saved articles are always available.',
      icon: <SaveIcon />,
    },
    {
      id: '4',
      title: 'Ready to Start',
      subtitle: 'Your News Awaits',
      description: 'Customize your reading experience with dark mode, adjustable text size, and more.',
      icon: <NewsIcon />,
    },
  ];

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      handleGetStarted();
    }
  };

  const handleSkip = () => {
    handleGetStarted();
  };

  const handleGetStarted = async () => {
    // Save the selected sources
    const updatedSources = sources.map(source => ({
      ...source,
      enabled: selectedSources.has(source.url),
    }));
    await setSources(updatedSources);
    await completeOnboarding();
    navigation.replace('Home');
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  }).current;

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const renderSourceItem = (feed: typeof sources[0]) => {
    const isSelected = selectedSources.has(feed.url);
    return (
      <Pressable
        key={feed.url}
        style={[styles.sourceItem, isSelected && styles.sourceItemSelected]}
        onPress={() => toggleSourceSelection(feed.url)}
      >
        <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
          {isSelected && <CheckIcon />}
        </View>
        <Text style={[styles.sourceName, isSelected && styles.sourceNameSelected]}>
          {feed.name}
        </Text>
      </Pressable>
    );
  };

  const renderSourceSelection = () => {
    if (isLoadingSources) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000" />
          <Text style={styles.loadingText}>Loading sources...</Text>
        </View>
      );
    }

    if (availableFeeds.length === 0) {
      return (
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>Unable to load sources</Text>
          <Text style={styles.errorSubtext}>Please check your connection</Text>
        </View>
      );
    }

    return (
      <ScrollView
        style={styles.sourceSelectionContainer}
        contentContainerStyle={styles.sourceSelectionContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Local Sources */}
        {localFeeds.length > 0 && (
          <View style={styles.sourceCategory}>
            <View style={styles.categoryHeader}>
              <Text style={styles.categoryTitle}>Local Sources</Text>
              <Pressable onPress={selectAllLocal}>
                <Text style={styles.selectAllText}>Select All</Text>
              </Pressable>
            </View>
            <View style={styles.sourceGrid}>
              {localFeeds.map(renderSourceItem)}
            </View>
          </View>
        )}

        {/* International Sources */}
        {internationalFeeds.length > 0 && (
          <View style={styles.sourceCategory}>
            <View style={styles.categoryHeader}>
              <Text style={styles.categoryTitle}>International Sources</Text>
              <Pressable onPress={selectAllInternational}>
                <Text style={styles.selectAllText}>Select All</Text>
              </Pressable>
            </View>
            <View style={styles.sourceGrid}>
              {internationalFeeds.map(renderSourceItem)}
            </View>
          </View>
        )}

        <Text style={styles.sourceHint}>
          {selectedSources.size} source{selectedSources.size !== 1 ? 's' : ''} selected
        </Text>
      </ScrollView>
    );
  };

  const renderSlide = ({ item }: { item: OnboardingSlide }) => (
    <View style={styles.slide}>
      {item.isSourceSelection ? (
        <>
          <View style={styles.sourceSlideHeader}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
          </View>
          {renderSourceSelection()}
        </>
      ) : (
        <>
          <View style={styles.iconContainer}>
            {item.icon}
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        </>
      )}
    </View>
  );

  const renderDots = () => (
    <View style={styles.dotsContainer}>
      {slides.map((_, index) => {
        const inputRange = [
          (index - 1) * width,
          index * width,
          (index + 1) * width,
        ];

        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [8, 24, 8],
          extrapolate: 'clamp',
        });

        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.3, 1, 0.3],
          extrapolate: 'clamp',
        });

        return (
          <Animated.View
            key={index}
            style={[
              styles.dot,
              { width: dotWidth, opacity },
            ]}
          />
        );
      })}
    </View>
  );

  const isLastSlide = currentIndex === slides.length - 1;
  const isSourceSlide = slides[currentIndex]?.isSourceSelection;

  return (
    <SafeAreaView style={styles.container}>
      {/* Skip button */}
      {!isLastSlide && (
        <Pressable style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
      )}

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      />

      {/* Bottom section */}
      <View style={styles.bottomSection}>
        {renderDots()}

        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
            isSourceSlide && selectedSources.size === 0 && styles.buttonDisabled,
          ]}
          onPress={handleNext}
          disabled={isSourceSlide && selectedSources.size === 0}
        >
          <Text style={styles.buttonText}>
            {isLastSlide ? 'Get Started' : 'Next'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: 24,
    zIndex: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  skipText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  slide: {
    width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  iconContainer: {
    width: 180,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 60,
  },
  khabarIcon: {
    alignItems: 'center',
  },
  khabarIconText: {
    fontSize: 100,
    fontWeight: '800',
    color: '#000',
    fontFamily: 'Georgia',
  },
  khabarIconLine: {
    width: 80,
    height: 4,
    backgroundColor: '#000',
    marginTop: 8,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#000',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  bottomSection: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#000',
    marginHorizontal: 4,
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  // Source selection styles
  sourceSlideHeader: {
    alignItems: 'center',
    paddingTop: 40,
    marginBottom: 20,
  },
  sourceSelectionContainer: {
    flex: 1,
    width: '100%',
  },
  sourceSelectionContent: {
    paddingBottom: 20,
  },
  sourceCategory: {
    marginBottom: 24,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  selectAllText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  sourceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  sourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    gap: 8,
  },
  sourceItemSelected: {
    backgroundColor: '#000',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  sourceName: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  sourceNameSelected: {
    color: '#fff',
  },
  sourceHint: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    marginTop: 16,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  errorText: {
    fontSize: 18,
    color: '#333',
    fontWeight: '600',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#666',
  },
});
