import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import * as Linking from 'expo-linking';
import { NewsItem as NewsItemType } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { SOURCE_COLORS } from '../constants/theme';
import Bookmark1 from '../icons/Bookmark1';
import Bookmark1filled from '../icons/Bookmark1filled';

interface Props {
    item: NewsItemType;
    isFirst?: boolean;
}

export const NewsItemCard: React.FC<Props> = ({ item, isFirst = false }) => {
    const { theme, isDark } = useTheme();
    const { saveArticle, unsaveArticle, isArticleSaved, getTextScale } = useApp();

    const isSaved = isArticleSaved(item.id);
    const scale = getTextScale();

    const handlePress = () => {
        if (item.link) {
            Linking.openURL(item.link);
        }
    };

    const handleSaveToggle = () => {
        if (isSaved) {
            unsaveArticle(item.id);
        } else {
            saveArticle(item);
        }
    };

    const sourceColorSet = SOURCE_COLORS[item.source];
    const sourceColor = sourceColorSet
        ? (isDark ? sourceColorSet.dark : sourceColorSet.light)
        : theme.textSecondary;

    return (
        <View>
            <View style={[styles.item, { backgroundColor: theme.background }]}>
                <View style={styles.headerRow}>
                    <Text style={[styles.source, { color: sourceColor }]}>{item.source}</Text>

                </View>
                <Pressable onPress={handlePress} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
                    <Text
                        style={[styles.title, { color: theme.text, fontSize: 17 * scale, lineHeight: 23 * scale }]}
                        numberOfLines={isFirst ? undefined : 3}
                    >
                        {item.title}
                    </Text>
                </Pressable>
                {item.tags && item.tags.length > 0 && (
                    <View style={styles.tagsContainer}>
                        {item.tags.map((tag, index) => (
                            <View key={index} style={[styles.tag, { backgroundColor: theme.tagBackground }]}>
                                <Text style={[styles.tagText, { color: theme.tagText }]}>{tag}</Text>
                            </View>
                        ))}
                    </View>
                )}
                <View style={styles.metaRow}>
                    {item.pubDate ? (
                        <Text style={[styles.time, { color: theme.textMuted }]}>{item.pubDate}</Text>
                    ) : null}

                    <Pressable
                        onPress={handleSaveToggle}
                        style={styles.bookmarkButton}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        {isSaved 
                            ? <Bookmark1filled width={24} height={24} color={theme.text} /> 
                            : <Bookmark1 width={24} height={24} color={theme.textMuted} />
                        }
                    </Pressable>
                </View>

            </View>
            <View style={[styles.separator, { backgroundColor: theme.separator }]} />
        </View>
    );
};

const styles = StyleSheet.create({
    item: {
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 16,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    source: {
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    bookmarkButton: {
        padding: 4,
    },
    bookmarkIcon: {
        fontSize: 18,
    },
    title: {
        fontWeight: '600',
        marginBottom: 10,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 8,
        gap: 6,
    },
    tag: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    tagText: {
        fontSize: 11,
        fontWeight: '500',
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    time: {
        fontSize: 13,
    },
    separator: {
        height: 1,
        marginHorizontal: 20,
    },
});
