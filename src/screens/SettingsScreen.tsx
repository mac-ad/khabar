import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  ScrollView,
  Animated,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';

export const SettingsScreen: React.FC = () => {
  const { theme } = useTheme();
  const { notificationsEnabled, toggleNotifications } = useApp();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>
              NOTIFICATIONS
            </Text>
            <View style={[styles.settingRow, { borderBottomColor: theme.separator }]}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingLabel, { color: theme.text }]}>
                  Push Notifications
                </Text>
                <Text style={[styles.settingDescription, { color: theme.textMuted }]}>
                  Receive alerts for breaking news
                </Text>
              </View>
              <Switch
                value={Boolean(notificationsEnabled)}
                onValueChange={toggleNotifications}
                trackColor={{ false: theme.separator, true: theme.text }}
                thumbColor="#fff"
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>
              ABOUT
            </Text>
            <View style={[styles.infoRow, { borderBottomColor: theme.separator }]}>
              <Text style={[styles.infoLabel, { color: theme.text }]}>Version</Text>
              <Text style={[styles.infoValue, { color: theme.textMuted }]}>1.0.0</Text>
            </View>
            <View style={[styles.infoRow, { borderBottomColor: theme.separator }]}>
              <Text style={[styles.infoLabel, { color: theme.text }]}>Build</Text>
              <Text style={[styles.infoValue, { color: theme.textMuted }]}>2024.01</Text>
            </View>
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
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  settingDescription: {
    fontSize: 13,
    marginTop: 4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  infoLabel: {
    fontSize: 16,
  },
  infoValue: {
    fontSize: 16,
  },
});
