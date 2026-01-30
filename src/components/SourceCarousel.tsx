import React, { useRef } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Pressable,
    ScrollView,
    Dimensions,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { RSSFeed } from '../types';

interface SourceCarouselProps {
    sources: RSSFeed[];
    selectedSource: string | null;
    onSelectSource: (slug: string | null) => void;
}

const { width } = Dimensions.get('window');

export const SourceCarousel: React.FC<SourceCarouselProps> = ({
    sources,
    selectedSource,
    onSelectSource,
}) => {
    const { theme } = useTheme();
    const scrollViewRef = useRef<ScrollView>(null);

    const handleSourcePress = (slug: string | null) => {
        onSelectSource(slug);
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <ScrollView
                ref={scrollViewRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                style={styles.scrollView}
            >
                {/* "All" option */}
                <Pressable
                    onPress={() => handleSourcePress(null)}
                    style={[
                        styles.sourceChip,
                        {
                            backgroundColor: selectedSource === null ? theme.accent : theme.tagBackground,
                            borderColor: selectedSource === null ? theme.accent : theme.separator,
                        }
                    ]}
                >
                    <Text
                        style={[
                            styles.sourceText,
                            {
                                color: selectedSource === null
                                    ? (theme.accent === '#FFFFFF' ? '#000000' : '#FFFFFF')
                                    : theme.text,
                                fontWeight: selectedSource === null ? '600' : '500',
                            }
                        ]}
                    >
                        All Sources
                    </Text>
                </Pressable>

                {/* Individual sources */}
                {sources.map((source) => {
                    const isSelected = selectedSource === source.slug;
                    return (
                        <Pressable
                            key={source.slug}
                            onPress={() => handleSourcePress(source.slug)}
                            style={[
                                styles.sourceChip,
                                {
                                    backgroundColor: isSelected ? theme.accent : theme.tagBackground,
                                    borderColor: isSelected ? theme.accent : theme.separator,
                                }
                            ]}
                        >
                            <Text
                                style={[
                                    styles.sourceText,
                                    {
                                        color: isSelected
                                            ? (theme.accent === '#FFFFFF' ? '#000000' : '#FFFFFF')
                                            : theme.text,
                                        fontWeight: isSelected ? '600' : '500',
                                    }
                                ]}
                                numberOfLines={1}
                            >
                                {source.name}
                            </Text>
                        </Pressable>
                    );
                })}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 12,
    },
    scrollView: {
        flexGrow: 0,
    },
    scrollContent: {
        paddingHorizontal: 16,
        gap: 8,
        alignItems: 'center',
    },
    sourceChip: {
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 24,
        marginRight: 8,
        borderWidth: 1,
        minWidth: 90,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    sourceChipActive: {
        borderWidth: 0,
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
    },
    sourceText: {
        fontSize: 13,
        letterSpacing: 0.3,
    },
});

