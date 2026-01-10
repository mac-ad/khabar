import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  FlatList,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Rect, Line } from 'react-native-svg';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useApp } from '../context/AppContext';

const { width, height } = Dimensions.get('window');

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;
};

interface OnboardingSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
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

const OfflineIcon = () => (
  <Svg width={120} height={120} viewBox="0 0 120 120" fill="none">
    <Circle cx="60" cy="60" r="40" stroke="#000" strokeWidth="3" fill="none" />
    <Path d="M40 60L55 75L80 50" stroke="#000" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M60 15V25" stroke="#000" strokeWidth="2" />
    <Path d="M60 95V105" stroke="#000" strokeWidth="2" />
    <Path d="M15 60H25" stroke="#000" strokeWidth="2" />
    <Path d="M95 60H105" stroke="#000" strokeWidth="2" />
  </Svg>
);

const ReadyIcon = () => (
  <Svg width={120} height={120} viewBox="0 0 120 120" fill="none">
    <Text style={{ fontSize: 80, fontWeight: '800', fontFamily: 'Georgia' }}>K</Text>
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
    title: 'Multiple Sources',
    subtitle: 'All Your News in One Place',
    description: 'Access headlines from OnlineKhabar.com, Nagarik News, Rajdhani Daily, Newsof Nepal, OS Nepal, Techmandu, and more. Enable or disable sources anytime.',
    icon: <SourcesIcon />,
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
    title: 'Works Offline',
    subtitle: 'Read Anytime, Anywhere',
    description: 'Already fetched articles are cached automatically. No internet? No problem.',
    icon: <OfflineIcon />,
  },
  {
    id: '5',
    title: 'Ready to Start',
    subtitle: 'Your News Awaits',
    description: 'Customize your reading experience with dark mode, adjustable text size, and more.',
    icon: <NewsIcon />,
  },
];

export const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
  const { completeOnboarding } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

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
    await completeOnboarding();
    navigation.replace('Home');
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  }).current;

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const renderSlide = ({ item }: { item: OnboardingSlide }) => (
    <View style={styles.slide}>
      <View style={styles.iconContainer}>
        {item.icon}
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.subtitle}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
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
          ]}
          onPress={handleNext}
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
    paddingHorizontal: 40,
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
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

