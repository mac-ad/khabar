import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { FeedCategory } from '../types';

interface SourceConfig {
  url: string;
  name: string;
  enabled: boolean;
  category: FeedCategory;
}

const TABS: { key: FeedCategory; label: string }[] = [
  { key: 'local', label: 'Local' },
  { key: 'international', label: 'World' },
];

export const ManageSourcesScreen: React.FC = () => {
  const { theme } = useTheme();
  const { sources, toggleSource } = useApp();
  const [activeTab, setActiveTab] = useState<FeedCategory>('local');

  const filteredSources = sources.filter(s => s.category === activeTab);
  const enabledCount = filteredSources.filter(s => s.enabled).length;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Tab Bar */}
      <View style={[styles.tabBar, { borderBottomColor: theme.separator }]}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <Pressable
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              style={[
                styles.tab,
                isActive && { borderBottomColor: theme.text, borderBottomWidth: 2 },
              ]}
            >
              <Text
                style={[
                  styles.tabLabel,
                  { color: isActive ? theme.text : theme.textMuted },
                ]}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Summary */}
      <View style={[styles.summary, { borderBottomColor: theme.separator }]}>
        <Text style={[styles.summaryText, { color: theme.textMuted }]}>
          {enabledCount} of {filteredSources.length} enabled
        </Text>
      </View>

      {/* Source List */}
      <ScrollView 
        style={styles.list} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      >
        {filteredSources.map((source) => (
          <Pressable
            key={source.url}
            onPress={() => toggleSource(source.url)}
            style={({ pressed }) => [
              styles.sourceRow,
              { 
                borderBottomColor: theme.separator,
                opacity: pressed ? 0.6 : 1,
              },
            ]}
          >
            <View style={styles.sourceInfo}>
              <Text 
                style={[
                  styles.sourceName, 
                  { color: source.enabled ? theme.text : theme.textMuted }
                ]}
              >
                {source.name}
              </Text>
            </View>
            <View
              style={[
                styles.toggle,
                {
                  backgroundColor: source.enabled ? theme.text : 'transparent',
                  borderColor: source.enabled ? theme.text : theme.textMuted,
                },
              ]}
            >
              {source.enabled && (
                <View style={[styles.toggleInner, { backgroundColor: theme.background }]} />
              )}
            </View>
          </Pressable>
        ))}

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.textMuted }]}>
            Disabled sources won't appear in your feed
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
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  summary: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  summaryText: {
    fontSize: 13,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 40,
  },
  sourceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    fontWeight: '500',
  },
  toggle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  footerText: {
    fontSize: 13,
    textAlign: 'center',
  },
});
