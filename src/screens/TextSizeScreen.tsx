import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';

type TextSize = 'small' | 'medium' | 'large';

const TEXT_SIZE_OPTIONS: { value: TextSize; label: string; titleSize: number; bodySize: number }[] = [
  { value: 'small', label: 'Small', titleSize: 15, bodySize: 13 },
  { value: 'medium', label: 'Medium', titleSize: 17, bodySize: 15 },
  { value: 'large', label: 'Large', titleSize: 20, bodySize: 17 },
];

export const TextSizeScreen: React.FC = () => {
  const { theme } = useTheme();
  const { textSize, setTextSize } = useApp();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>
          SELECT SIZE
        </Text>

        {TEXT_SIZE_OPTIONS.map((option) => {
          const isSelected = textSize === option.value;
          return (
            <Pressable
              key={option.value}
              style={[
                styles.option,
                { borderBottomColor: theme.separator },
                isSelected && { backgroundColor: theme.tagBackground },
              ]}
              onPress={() => setTextSize(option.value)}
            >
              <View style={styles.optionContent}>
                <Text style={[styles.optionLabel, { color: theme.text }]}>
                  {option.label}
                </Text>
              </View>
              {isSelected && (
                <Text style={[styles.checkmark, { color: theme.text }]}>✓</Text>
              )}
            </Pressable>
          );
        })}

        <View style={[styles.preview, { borderColor: theme.separator }]}>
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
        </View>
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
