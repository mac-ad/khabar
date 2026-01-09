import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../context/ThemeContext';
import { RootStackParamList } from './types';

import { HomeScreen } from '../screens/HomeScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { TextSizeScreen } from '../screens/TextSizeScreen';
import { ManageSourcesScreen } from '../screens/ManageSourcesScreen';
import { SavedArticlesScreen } from '../screens/SavedArticlesScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
    const { theme } = useTheme();

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
        >
            <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{ headerShown: false }}
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
        </Stack.Navigator>
    );
};
