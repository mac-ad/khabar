import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  ScrollView,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';

export const ManageSourcesScreen: React.FC = () => {
  const { theme } = useTheme();
  const { sources, toggleSource } = useApp();

  const enabledCount = sources.filter(s => s.enabled).length;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.summary, { borderBottomColor: theme.separator }]}>
        <Text style={[styles.summaryText, { color: theme.textMuted }]}>
          {enabledCount} of {sources.length} sources enabled
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>
          NEWS SOURCES
        </Text>

        {sources.map((source) => (
          <View
            key={source.url}
            style={[styles.sourceRow, { borderBottomColor: theme.separator }]}
          >
            <View style={styles.sourceInfo}>
              <Text style={[styles.sourceName, { color: theme.text }]}>
                {source.name}
              </Text>
              <Text
                style={[styles.sourceUrl, { color: theme.textMuted }]}
                numberOfLines={1}
              >
                {source.url.replace(/^https?:\/\//, '').split('/')[0]}
              </Text>
            </View>
            <Switch
              value={Boolean(source.enabled)}
              onValueChange={() => toggleSource(source.url)}
              trackColor={{ false: theme.separator, true: theme.text }}
              thumbColor="#fff"
            />
          </View>
        ))}

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.textMuted }]}>
            Disabled sources won't appear in your feed.
            Pull to refresh after making changes.
          </Text>
        </View>
      </ScrollView>
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
  content: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
    paddingHorizontal: 20,
    paddingTop: 24,
    marginBottom: 12,
  },
  sourceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  sourceInfo: {
    flex: 1,
    marginRight: 16,
  },
  sourceName: {
    fontSize: 16,
    fontWeight: '600',
  },
  sourceUrl: {
    fontSize: 13,
    marginTop: 4,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  footerText: {
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
  },
});
