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

export const AboutScreen: React.FC = () => {
  const { theme } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const handleLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          {/* App Logo/Title */}
          <View style={styles.header}>
            <Text style={[styles.appName, { color: theme.text }]}>KHABAR</Text>
            <Text style={[styles.tagline, { color: theme.textSecondary }]}>
              Your Daily News Companion
            </Text>
            <View style={[styles.versionBadge, { backgroundColor: theme.tagBackground }]}>
              <Text style={[styles.versionText, { color: theme.textSecondary }]}>
                Version 1.0.0
              </Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={[styles.description, { color: theme.textSecondary }]}>
              Khabar is a minimalist news aggregator that brings you the latest headlines 
              from trusted sources around the world. Our focus is on delivering a clean, 
              distraction-free reading experience.
            </Text>
          </View>

          {/* Features */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>
              FEATURES
            </Text>
            <View style={styles.featureList}>
              {[
                'Curated news from multiple sources',
                'Save articles for later reading',
                'Customizable text size',
                'Dark and light themes',
                'Swipe gestures for navigation',
                'Offline saved articles',
              ].map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <Text style={[styles.featureBullet, { color: theme.text }]}>•</Text>
                  <Text style={[styles.featureText, { color: theme.textSecondary }]}>
                    {feature}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Credits */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>
              CREDITS
            </Text>
            <View style={[styles.creditRow, { borderBottomColor: theme.separator }]}>
              <Text style={[styles.creditLabel, { color: theme.text }]}>Design & Development</Text>
              <Text style={[styles.creditValue, { color: theme.textSecondary }]}>macad</Text>
            </View>
          </View>

          {/* Links */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>
              LEGAL
            </Text>
            <Pressable
              style={[styles.linkRow, { borderBottomColor: theme.separator }]}
              onPress={() => handleLink('https://khabar.macad.dev/privacy')}
            >
              <Text style={[styles.linkText, { color: theme.text }]}>Privacy Policy</Text>
              <Text style={[styles.linkArrow, { color: theme.textMuted }]}>→</Text>
            </Pressable>
            <Pressable
              style={[styles.linkRow, { borderBottomColor: theme.separator }]}
              onPress={() => handleLink('https://khabar.macad.dev/terms')}
            >
              <Text style={[styles.linkText, { color: theme.text }]}>Terms of Service</Text>
              <Text style={[styles.linkArrow, { color: theme.textMuted }]}>→</Text>
            </Pressable>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={[styles.copyright, { color: theme.textMuted }]}>
              © 2026 Khabar. All rights reserved.
            </Text>
            <Text style={[styles.madeWith, { color: theme.textMuted }]}>
              Made with ♥ for news readers
            </Text>
          </View>
        </Animated.View>
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
  header: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  appName: {
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: 6,
  },
  tagline: {
    fontSize: 14,
    marginTop: 8,
    letterSpacing: 0.5,
  },
  versionBadge: {
    marginTop: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  versionText: {
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 16,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'center',
  },
  featureList: {
    gap: 10,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  featureBullet: {
    fontSize: 16,
    marginRight: 10,
    marginTop: -2,
  },
  featureText: {
    fontSize: 15,
    flex: 1,
  },
  creditRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  creditLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
  creditValue: {
    fontSize: 14,
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  linkText: {
    fontSize: 15,
    fontWeight: '500',
  },
  linkArrow: {
    fontSize: 16,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  copyright: {
    fontSize: 12,
  },
  madeWith: {
    fontSize: 12,
    marginTop: 8,
  },
});

