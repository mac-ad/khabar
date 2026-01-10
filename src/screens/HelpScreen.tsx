import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  Pressable,
} from 'react-native';
import * as Linking from 'expo-linking';
import { useTheme } from '../context/ThemeContext';

interface FAQItemProps {
  question: string;
  answer: string;
  index: number;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer, index }) => {
  const { theme } = useTheme();
  const [expanded, setExpanded] = React.useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      delay: index * 50,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim, index]);

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <Pressable
        onPress={() => setExpanded(!expanded)}
        style={[styles.faqItem, { borderBottomColor: theme.separator }]}
      >
        <View style={styles.faqHeader}>
          <Text style={[styles.faqQuestion, { color: theme.text }]}>{question}</Text>
          <Text style={[styles.faqToggle, { color: theme.textMuted }]}>
            {expanded ? '−' : '+'}
          </Text>
        </View>
        {expanded && (
          <Text style={[styles.faqAnswer, { color: theme.textSecondary }]}>
            {answer}
          </Text>
        )}
      </Pressable>
    </Animated.View>
  );
};

const FAQ_DATA = [
  {
    question: 'How do I save an article?',
    answer: 'Tap the bookmark icon on any article to save it. You can find all your saved articles in the "Saved Articles" section from the sidebar menu.',
  },
  {
    question: 'How do I refresh the news feed?',
    answer: 'Pull down on the news list to refresh, or scroll down and tap the "Scroll to top" button which will also refresh the feed.',
  },
  {
    question: 'Can I customize which news sources appear?',
    answer: 'Yes! Go to Sources from the sidebar menu. You can enable or disable any news source. Disabled sources won\'t appear in your feed.',
  },
  {
    question: 'How do I change the text size?',
    answer: 'Go to Text Size from the sidebar menu. You can choose between Small, Medium, and Large text sizes.',
  },
  {
    question: 'How do I switch between light and dark mode?',
    answer: 'Tap on "Dark Mode" or "Light Mode" in the sidebar menu to toggle between themes.',
  },
  {
    question: 'Why are some articles not loading?',
    answer: 'Some articles may fail to load due to network issues or if the news source is temporarily unavailable. Try pulling down to refresh.',
  },
  {
    question: 'How do I open the sidebar?',
    answer: 'Tap the hamburger menu (three horizontal lines) at the top left, or swipe from the left edge of the screen.',
  },
];

export const HelpScreen: React.FC = () => {
  const { theme } = useTheme();

  const handleContactSupport = () => {
    Linking.openURL('mailto:support@khabar.app?subject=Khabar App Support');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>
            FREQUENTLY ASKED QUESTIONS
          </Text>
          {FAQ_DATA.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              index={index}
            />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>
            NEED MORE HELP?
          </Text>
          <Pressable
            style={[styles.contactButton, { borderColor: theme.text }]}
            onPress={handleContactSupport}
          >
            <Text style={[styles.contactButtonText, { color: theme.text }]}>
              Contact Support
            </Text>
          </Pressable>
          <Text style={[styles.contactHint, { color: theme.textMuted }]}>
            We typically respond within 24 hours
          </Text>
        </View>

        <View style={styles.footer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  section: {
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  faqItem: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    paddingRight: 16,
  },
  faqToggle: {
    fontSize: 20,
    fontWeight: '300',
  },
  faqAnswer: {
    fontSize: 14,
    lineHeight: 22,
    marginTop: 12,
  },
  contactButton: {
    marginHorizontal: 20,
    paddingVertical: 14,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
  },
  contactButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  contactHint: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 12,
    paddingHorizontal: 20,
  },
  footer: {
    height: 40,
  },
});

