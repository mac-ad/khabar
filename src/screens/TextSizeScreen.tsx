import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
} from 'react-native';
import LottieView from 'lottie-react-native';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';

type TextSize = 'small' | 'medium' | 'large';

const TEXT_SIZE_OPTIONS: { value: TextSize; label: string; titleSize: number; bodySize: number }[] = [
  { value: 'small', label: 'Small', titleSize: 15, bodySize: 13 },
  { value: 'medium', label: 'Medium', titleSize: 17, bodySize: 15 },
  { value: 'large', label: 'Large', titleSize: 20, bodySize: 17 },
];

interface OptionItemProps {
  option: typeof TEXT_SIZE_OPTIONS[0];
  isSelected: boolean;
  onSelect: () => void;
}

const OptionItem: React.FC<OptionItemProps> = ({ option, isSelected, onSelect }) => {
  const { theme } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const successAnim = useRef<LottieView>(null);
  const [showSuccess, setShowSuccess] = React.useState(false);

  const handlePress = () => {
    if (!isSelected) {
      setShowSuccess(true);
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.97,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 3,
          tension: 100,
          useNativeDriver: true,
        }),
      ]).start();
      onSelect();
      setTimeout(() => setShowSuccess(false), 600);
    }
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        style={[
          styles.option,
          { borderBottomColor: theme.separator },
          isSelected && { backgroundColor: theme.tagBackground },
        ]}
        onPress={handlePress}
      >
        <View style={styles.optionContent}>
          <Text style={[styles.optionLabel, { color: theme.text }]}>
            {option.label}
          </Text>
        </View>
        {showSuccess ? (
          <LottieView
            ref={successAnim}
            source={require('../assets/animations/success.json')}
            autoPlay
            loop={false}
            style={styles.successAnimation}
            colorFilters={[
              { keypath: 'Check', color: theme.text },
              { keypath: 'Circle', color: theme.text },
            ]}
          />
        ) : isSelected ? (
          <Text style={[styles.checkmark, { color: theme.text }]}>✓</Text>
        ) : null}
      </Pressable>
    </Animated.View>
  );
};

export const TextSizeScreen: React.FC = () => {
  const { theme } = useTheme();
  const { textSize, setTextSize } = useApp();
  const previewFadeAnim = useRef(new Animated.Value(1)).current;

  const handleSizeChange = (size: TextSize) => {
    // Animate preview change
    Animated.sequence([
      Animated.timing(previewFadeAnim, {
        toValue: 0.5,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(previewFadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
    setTextSize(size);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>
          SELECT SIZE
        </Text>

        {TEXT_SIZE_OPTIONS.map((option) => (
          <OptionItem
            key={option.value}
            option={option}
            isSelected={textSize === option.value}
            onSelect={() => handleSizeChange(option.value)}
          />
        ))}

        <Animated.View style={[styles.preview, { borderColor: theme.separator, opacity: previewFadeAnim }]}>
          <Text style={[styles.previewLabel, { color: theme.textMuted }]}>
            PREVIEW
          </Text>
          <Text style={[
            styles.previewTitle,
            {
              color: theme.text,
              fontSize: TEXT_SIZE_OPTIONS.find(o => o.value === textSize)?.titleSize || 17,
            }
          ]}>
            Breaking News: Sample Headline
          </Text>
          <Text style={[
            styles.previewBody,
            {
              color: theme.textSecondary,
              fontSize: TEXT_SIZE_OPTIONS.find(o => o.value === textSize)?.bodySize || 15,
            }
          ]}>
            This is how your articles will appear with the selected text size.
            Adjust to your preference for comfortable reading.
          </Text>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
  },
  optionContent: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 17,
    fontWeight: '600',
  },
  checkmark: {
    fontSize: 18,
    fontWeight: '600',
  },
  successAnimation: {
    width: 32,
    height: 32,
  },
  preview: {
    marginTop: 32,
    marginHorizontal: 20,
    padding: 20,
    borderWidth: 1,
    borderRadius: 8,
  },
  previewLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  previewTitle: {
    fontWeight: '700',
    marginBottom: 8,
  },
  previewBody: {
    lineHeight: 22,
  },
});
