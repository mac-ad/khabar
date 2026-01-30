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
import * as WebBrowser from 'expo-web-browser';
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

const sourcesToRemoveImages = ['newsofnepal', 'rajdhanidaily'];

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

    const handleOpenSource = async () => {
        if (article.link) {
            await WebBrowser.openBrowserAsync(article.link);
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

    const cleanDescription = (description: string) => {
        let cleaned = description;

        // Remove "The post ... appeared first on ..." footer pattern
        cleaned = cleaned.replace(/<p>The post <a[^>]*>.*?<\/a> appeared first on <a[^>]*>.*?<\/a>\.<\/p>/gi, '');

        // Remove any remaining "appeared first on" patterns
        cleaned = cleaned.replace(/The post .* appeared first on .*/gi, '');

        // Remove self-referential links at the end
        cleaned = cleaned.replace(/<p><a[^>]*rel="nofollow"[^>]*>.*?<\/a><\/p>\s*$/gi, '');

        // Decode common HTML entities
        cleaned = cleaned
            .replace(/&#8230;/g, '…')
            .replace(/&hellip;/g, '…')
            .replace(/&#8216;/g, "'")
            .replace(/&#8217;/g, "'")
            .replace(/&#8220;/g, '"')
            .replace(/&#8221;/g, '"')
            .replace(/&ldquo;/g, '"')
            .replace(/&rdquo;/g, '"')
            .replace(/&lsquo;/g, "'")
            .replace(/&rsquo;/g, "'")
            .replace(/&nbsp;/g, ' ')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>');

        // Remove image tags if needed
        if (sourcesToRemoveImages.includes(article?.sourceSlug)) {
            cleaned = removeImageTags(cleaned);
        }

        // Remove excessive whitespace and empty paragraphs
        cleaned = cleaned.replace(/<p>\s*<\/p>/g, '');
        cleaned = cleaned.replace(/\s{2,}/g, ' ');
        cleaned = cleaned.trim();

        return cleaned;
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
                    <View style={styles.descriptionContainer}>
                        <RenderHTML
                            contentWidth={300}
                            source={{ html: cleanDescription(article.description) }}
                            baseStyle={{
                                color: theme.text,
                                fontSize: 16 * scale,
                                lineHeight: 26 * scale,
                                marginBottom: 0,
                            }}
                            tagsStyles={{
                                body: {
                                    color: theme.text,
                                    fontSize: 16 * scale,
                                    lineHeight: 26 * scale,
                                    marginBottom: 0,
                                },
                                p: {
                                    color: theme.text,
                                    fontSize: 16 * scale,
                                    lineHeight: 26 * scale,
                                    marginBottom: 16 * scale,
                                    marginTop: 0,
                                },
                                a: {
                                    color: theme.textSecondary,
                                    textDecorationLine: 'none',
                                },
                                strong: {
                                    fontWeight: '700',
                                    color: theme.text,
                                },
                                b: {
                                    fontWeight: '700',
                                    color: theme.text,
                                },
                                em: {
                                    fontStyle: 'italic',
                                    color: theme.text,
                                },
                                i: {
                                    fontStyle: 'italic',
                                    color: theme.text,
                                },
                            }}
                        />
                    </View>
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
    descriptionContainer: {
        marginBottom: 24,
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

