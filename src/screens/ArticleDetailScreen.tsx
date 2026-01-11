import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    Pressable,
    Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Linking from 'expo-linking';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { SOURCE_COLORS } from '../constants/theme';
import Bookmark1 from '../icons/Bookmark1';
import Bookmark1filled from '../icons/Bookmark1filled';
import ShareIcon from '../icons/Share';
import RenderHTML from 'react-native-render-html';

type Props = NativeStackScreenProps<RootStackParamList, 'ArticleDetail'>;

export const ArticleDetailScreen: React.FC<Props> = ({ route }) => {
    const { article } = route.params;
    const { theme, isDark } = useTheme();
    const { saveArticle, unsaveArticle, isArticleSaved, getTextScale } = useApp();

    const isSaved = isArticleSaved(article.id);
    const scale = getTextScale();

    const sourceColorSet = SOURCE_COLORS[article.sourceSlug];
    const sourceColor = sourceColorSet
        ? (isDark ? sourceColorSet.dark : sourceColorSet.light)
        : theme.textSecondary;

    const handleOpenSource = () => {
        if (article.link) {
            Linking.openURL(article.link);
        }
    };

    const handleSaveToggle = () => {
        if (isSaved) {
            unsaveArticle(article.id);
        } else {
            saveArticle(article);
        }
    };

    const handleShare = async () => {
        try {
            // Strip HTML tags from title for sharing
            const plainTitle = article.title.replace(/<[^>]*>/g, '');
            const appLink = 'https://khabar.com';

            // Create a clean, professional share message
            const shareMessage = [
                `📰 ${plainTitle}`,
                '',
                `📖 Read full article:`,
                article.link,
                '',
                `━━━━━━━━━━━━━━━`,
                `📱 Shared via Khabar`,
                `Get the app: ${appLink}`,
            ].join('\n');

            await Share.share({
                message: shareMessage,
                title: plainTitle,
                url: article.link, // iOS uses this as the shared URL
            });
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    const removeImageTags = (description: string) => {
        return description.replace(/<img[^>]*>/g, '').replace(/<p[^>]*>/g, '').replace(/<\/p[^>]*>/g, '');
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <ScrollView
                style={[styles.scrollView, { backgroundColor: theme.background }]}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* Source & Time */}
                <View style={styles.metaRow}>
                    <Text style={[styles.source, { color: sourceColor }]}>{article.sourceName}</Text>
                    {article.pubDate && (
                        <>
                            <Text style={[styles.dot, { color: theme.textMuted }]}>•</Text>
                            <Text style={[styles.time, { color: theme.textMuted }]}>{article.pubDate}</Text>
                        </>
                    )}
                </View>

                {/* Title */}
                <RenderHTML
                    contentWidth={300}
                    source={{ html: article.title }}
                    baseStyle={{
                        color: theme.text,
                        fontSize: 24 * scale,
                        lineHeight: 32 * scale,
                        fontWeight: '800',
                        marginBottom: 12,
                    }}
                />

                {/* Author */}
                {article.author && (
                    <Text style={[styles.author, { color: theme.textSecondary }]}>
                        By {article.author}
                    </Text>
                )}

                {/* Image */}
                {article.image && (
                    <Image
                        source={{ uri: article.image }}
                        style={styles.image}
                        resizeMode="cover"
                    />
                )}

                {/* Description */}
                {article.description && (
                    <RenderHTML
                        contentWidth={300}
                        source={{ html: article?.sourceSlug !== "newsofnepal" ? article?.description : removeImageTags(article?.description) }}
                        baseStyle={{
                            color: theme.text,
                            fontSize: 16 * scale,
                            lineHeight: 22 * scale,
                            marginBottom: 24,
                        }}
                        tagsStyles={{
                            body: { color: theme.text, fontSize: 16 * scale, lineHeight: 22 * scale, marginBottom: 24 },
                        }}
                    />
                )}

                {/* Tags */}
                {article.tags && article.tags.length > 0 && (
                    <View style={styles.tagsContainer}>
                        {article.tags.map((tag, index) => (
                            <View key={index} style={[styles.tag, { backgroundColor: theme.tagBackground }]}>
                                <Text style={[styles.tagText, { color: theme.tagText }]}>{tag}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* Continue Reading CTA */}
                <View style={styles.ctaSection}>
                    <Text style={[styles.ctaHint, { color: theme.textMuted }]}>
                        Continue reading on the original source
                    </Text>
                    <Pressable
                        onPress={handleOpenSource}
                        style={({ pressed }) => [
                            styles.ctaButton,
                            { backgroundColor: theme.text, opacity: pressed ? 0.8 : 1 }
                        ]}
                    >
                        <Text style={[styles.ctaButtonText, { color: theme.background }]}>
                            Read Full Article
                        </Text>
                    </Pressable>
                </View>
            </ScrollView>

            {/* Bottom Action Bar */}
            <SafeAreaView style={{ backgroundColor: theme.background }} edges={['bottom']}>
                <View style={[styles.bottomBar, { backgroundColor: theme.background, borderTopColor: theme.separator }]}>
                    <Pressable
                        onPress={handleSaveToggle}
                        style={styles.actionButton}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        {isSaved
                            ? <Bookmark1filled width={24} height={24} color={theme.text} />
                            : <Bookmark1 width={24} height={24} color={theme.textMuted} />
                        }
                        <Text style={[styles.actionText, { color: isSaved ? theme.text : theme.textMuted }]}>
                            {isSaved ? 'Saved' : 'Save'}
                        </Text>
                    </Pressable>

                    <Pressable
                        onPress={handleShare}
                        style={styles.actionButton}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <ShareIcon width={24} height={24} color={theme.textMuted} />
                        <Text style={[styles.actionText, { color: theme.textMuted }]}>
                            Share
                        </Text>
                    </Pressable>

                    <Pressable
                        onPress={handleOpenSource}
                        style={styles.actionButton}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Text style={[styles.openSourceText, { color: theme.text }]}>
                            Open Source →
                        </Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    source: {
        fontSize: 13,
        fontWeight: '700',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    dot: {
        marginHorizontal: 8,
        fontSize: 12,
    },
    time: {
        fontSize: 13,
    },
    title: {
        fontWeight: '800',
        lineHeight: 32,
        marginBottom: 12,
    },
    author: {
        fontSize: 14,
        marginBottom: 20,
    },
    image: {
        width: '100%',
        height: 220,
        borderRadius: 12,
        marginBottom: 20,
    },
    description: {
        lineHeight: 26,
        marginBottom: 24,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 32,
    },
    tag: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
    },
    tagText: {
        fontSize: 12,
        fontWeight: '600',
    },
    ctaSection: {
        alignItems: 'center',
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.1)',
    },
    ctaHint: {
        fontSize: 14,
        marginBottom: 16,
    },
    ctaButton: {
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
    },
    ctaButtonText: {
        fontSize: 16,
        fontWeight: '700',
    },
    bottomBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderTopWidth: 1,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    actionText: {
        fontSize: 14,
        fontWeight: '600',
    },
    openSourceText: {
        fontSize: 14,
        fontWeight: '700',
    },
});

