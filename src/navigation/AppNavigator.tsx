import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { RootStackParamList } from './types';

import { OnboardingScreen } from '../screens/OnboardingScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { ArticleDetailScreen } from '../screens/ArticleDetailScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { TextSizeScreen } from '../screens/TextSizeScreen';
import { ManageSourcesScreen } from '../screens/ManageSourcesScreen';
import { SavedArticlesScreen } from '../screens/SavedArticlesScreen';
import { HelpScreen } from '../screens/HelpScreen';
import { AboutScreen } from '../screens/AboutScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
    const { theme } = useTheme();
    const { hasCompletedOnboarding, isLoadingOnboarding } = useApp();

    // Show loading indicator while checking onboarding status
    if (isLoadingOnboarding) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
                <ActivityIndicator size="large" color={theme.accent} />
            </View>
        );
    }

    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: theme.background,
                },
                headerTintColor: theme.text,
                headerTitleStyle: {
                    fontWeight: '700',
                },
                contentStyle: {
                    backgroundColor: theme.background,
                },
            }}
            initialRouteName={hasCompletedOnboarding ? 'Home' : 'Onboarding'}
        >
            <Stack.Screen
                name="Onboarding"
                component={OnboardingScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="ArticleDetail"
                component={ArticleDetailScreen}
                options={{ title: '' }}
            />
            <Stack.Screen
                name="Settings"
                component={SettingsScreen}
                options={{ title: 'Settings' }}
            />
            <Stack.Screen
                name="TextSize"
                component={TextSizeScreen}
                options={{ title: 'Text Size' }}
            />
            <Stack.Screen
                name="Sources"
                component={ManageSourcesScreen}
                options={{ title: 'Sources' }}
            />
            <Stack.Screen
                name="Saved"
                component={SavedArticlesScreen}
                options={{ title: 'Saved' }}
            />
            <Stack.Screen
                name="Help"
                component={HelpScreen}
                options={{ title: 'Help & FAQ' }}
            />
            <Stack.Screen
                name="About"
                component={AboutScreen}
                options={{ title: 'About' }}
            />
        </Stack.Navigator>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
