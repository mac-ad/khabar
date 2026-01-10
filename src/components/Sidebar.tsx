import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  ScrollView,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import {
  SIDEBAR_SECTIONS,
  ICON_SIZE,
  type MenuItemId,
  type MenuItemConfig,
} from '../constants/sidebarConfig';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  slideAnim: Animated.Value;
  isEmbedded?: boolean;
  onOpenSavedArticles: () => void;
  onOpenTextSize: () => void;
  onOpenManageSources: () => void;
  onOpenSettings: () => void;
  onOpenHelp: () => void;
  onOpenAbout: () => void;
}

interface MenuItemProps {
  config: MenuItemConfig;
  label?: string;
  onPress?: () => void;
  isActive?: boolean;
  badge?: number;
}

const MenuItem: React.FC<MenuItemProps> = ({ config, label, onPress, isActive, badge }) => {
  const { theme } = useTheme();

  const IconComponent = isActive && config.iconFilled ? config.iconFilled : config.icon;
  const displayLabel = label || config.label;
  const iconColor = isActive ? theme.text : theme.textSecondary;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.menuItem,
        isActive && { backgroundColor: theme.tagBackground },
        pressed && { opacity: 0.7 }
      ]}
      onPress={onPress}
    >
      <View style={styles.iconContainer}>
        <IconComponent width={ICON_SIZE} height={ICON_SIZE} color={iconColor} />
      </View>
      <Text style={[
        styles.menuLabel,
        { color: isActive ? theme.text : theme.textSecondary }
      ]}>
        {displayLabel}
      </Text>
      {badge !== undefined && badge > 0 && (
        <View style={[styles.badge, { backgroundColor: theme.text }]}>
          <Text style={[styles.badgeText, { color: theme.background }]}>{badge}</Text>
        </View>
      )}
    </Pressable>
  );
};

const SectionHeader: React.FC<{ title: string }> = ({ title }) => {
  const { theme } = useTheme();

  return (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>{title}</Text>
    </View>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  slideAnim,
  isEmbedded,
  onOpenSavedArticles,
  onOpenTextSize,
  onOpenManageSources,
  onOpenSettings,
  onOpenHelp,
  onOpenAbout,
}) => {
  const { theme, isDark, toggleTheme } = useTheme();
  const { savedArticles, textSize, notificationsEnabled, sources } = useApp();

  const enabledSourcesCount = sources.filter(s => s.enabled).length;

  const handleMenuItem = (action: () => void) => {
    onClose();
    setTimeout(action, 100);
  };

  const menuItemHandlers: Record<MenuItemId, {
    onPress?: () => void;
    label?: string;
    badge?: number;
    isActive?: boolean;
  }> = {
    home: {
      onPress: onClose,
      isActive: true,
    },
    saved: {
      onPress: () => handleMenuItem(onOpenSavedArticles),
      badge: savedArticles.length,
    },
    theme: {
      onPress: toggleTheme,
      label: isDark ? 'Light Mode' : 'Dark Mode',
    },
    textSize: {
      onPress: () => handleMenuItem(onOpenTextSize),
      label: `Text Size (${textSize.charAt(0).toUpperCase() + textSize.slice(1)})`,
    },
    sources: {
      onPress: () => handleMenuItem(onOpenManageSources),
      label: `Sources (${enabledSourcesCount}/${sources.length})`,
    },
    settings: {
      onPress: () => handleMenuItem(onOpenSettings),
    },
    help: {
      onPress: () => handleMenuItem(onOpenHelp),
    },
    about: {
      onPress: () => handleMenuItem(onOpenAbout),
    },
  };

  return (
    <View style={[styles.content, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.separator }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>KHABAR</Text>
        <Text style={[styles.headerSubtitle, { color: theme.textMuted }]}>
          Your Daily News
        </Text>
      </View>

      <ScrollView style={styles.menuList} showsVerticalScrollIndicator={false}>
        {SIDEBAR_SECTIONS.map((section) => (
          <React.Fragment key={section.title}>
            <SectionHeader title={section.title} />
            {section.items.map((item) => {
              const handlers = menuItemHandlers[item.id];
              return (
                <MenuItem
                  key={item.id}
                  config={item}
                  label={handlers?.label}
                  onPress={handlers?.onPress}
                  isActive={handlers?.isActive}
                  badge={handlers?.badge}
                />
              );
            })}
          </React.Fragment>
        ))}
      </ScrollView>

      <View style={[styles.footer, { borderTopColor: theme.separator }]}>
        <Text style={[styles.footerText, { color: theme.textMuted }]}>
          Notifications: {notificationsEnabled ? 'On' : 'Off'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 3,
  },
  headerSubtitle: {
    fontSize: 13,
    marginTop: 4,
    letterSpacing: 0.5,
  },
  menuList: {
    flex: 1,
    paddingTop: 8,
  },
  sectionHeader: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  iconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: '500',
    marginLeft: 12,
    flex: 1,
  },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  footer: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderTopWidth: 1,
  },
  footerText: {
    fontSize: 11,
    textAlign: 'center',
  },
});
