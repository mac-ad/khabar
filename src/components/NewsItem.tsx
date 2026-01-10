import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NewsItem as NewsItemType } from '../types';
import { RootStackParamList } from '../navigation/types';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { SOURCE_COLORS } from '../constants/theme';
import Bookmark1 from '../icons/Bookmark1';
import Bookmark1filled from '../icons/Bookmark1filled';
import RenderHTML from 'react-native-render-html';

interface Props {
    item: NewsItemType;
}

export const NewsItemCard: React.FC<Props> = ({ item }) => {
    const { theme, isDark } = useTheme();
    const { getTextScale, saveArticle, unsaveArticle, isArticleSaved } = useApp();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const scale = getTextScale();
    const isSaved = isArticleSaved(item.id);

    const handleBookmark = () => {
        if (isSaved) {
            unsaveArticle(item.id);
        } else {
            saveArticle(item);
        }
    };

    const handlePress = () => {
        navigation.navigate('ArticleDetail', { article: item });
    };

    const sourceColorSet = SOURCE_COLORS[item.sourceSlug];
    const sourceColor = sourceColorSet
        ? (isDark ? sourceColorSet.dark : sourceColorSet.light)
        : theme.textSecondary;

    return (
        <Pressable onPress={handlePress} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
            <View style={[styles.item, { backgroundColor: theme.background }]}>
                {/* Header row with source and bookmark */}
                <View style={styles.headerRow}>
                    <Text style={[styles.source, { color: sourceColor }]}>{item.sourceName}</Text>
                    <Pressable
                        onPress={(e) => {
                            e.stopPropagation();
                            handleBookmark();
                        }}
                        style={styles.bookmarkButton}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        {isSaved ? (
                            <Bookmark1filled width={18} height={18} color={theme.text} />
                        ) : (
                            <Bookmark1 width={18} height={18} color={theme.textMuted} />
                        )}
                    </Pressable>
                </View>

                {/* Title - 90% width */}
                <View style={styles.titleContainer}>
                    <RenderHTML
                        contentWidth={300}
                        source={{ html: item.title }}
                        baseStyle={{
                            color: theme.text,
                            fontSize: 16 * scale,
                            lineHeight: 22 * scale,
                            fontWeight: '600',
                        }}
                        tagsStyles={{
                            body: { color: theme.text, fontSize: 16 * scale, lineHeight: 22 * scale, fontWeight: '600' },
                        }}
                    />
                </View>

                {/* Tags */}
                {item.tags && item.tags.length > 0 && (
                    <View style={styles.tagsContainer}>
                        {item.tags.slice(0, 2).map((tag, index) => (
                            <View key={index} style={[styles.tag, { backgroundColor: theme.tagBackground }]}>
                                <Text style={[styles.tagText, { color: theme.tagText }]}>{tag}</Text>
                            </View>
                        ))}
                    </View>
                )}


                {/* Source & Time */}
                <View style={styles.metaRow}>

                    {item.pubDate && (
                        <>
                            <Text style={[styles.time, { color: theme.textMuted }]}>{item.pubDate}</Text>
                        </>
                    )}
                </View>

            </View>
            <View style={[styles.separator, { backgroundColor: theme.separator }]} />
        </Pressable>
    );
};

const styles = StyleSheet.create({
    item: {
        paddingHorizontal: 20,
        paddingVertical: 14,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    bookmarkButton: {
        padding: 4,
    },
    titleContainer: {
        width: '90%',
        marginBottom: 8,
    },
    title: {
        fontWeight: '600',
        marginBottom: 8,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 8,
        gap: 6,
    },
    tag: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 4,
    },
    tagText: {
        fontSize: 11,
        fontWeight: '500',
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    source: {
        fontSize: 12,
        fontWeight: '300',
        letterSpacing: 0.3,
    },
    dot: {
        marginHorizontal: 6,
        fontSize: 10,
    },
    time: {
        fontSize: 12,
    },
    separator: {
        height: 1,
        marginHorizontal: 20,
    },
});
