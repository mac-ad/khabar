import React from 'react';
import Svg, { Path, Rect, Circle } from 'react-native-svg';
import {
    Home,
    HomeFilled,
    Bookmark,
    BookmarkFilled,
    Moon,
    type IconComponent,
} from '../icons';

// ============================================
// SIDEBAR CONFIGURATION
// ============================================
// To add a new menu item:
// 1. Add your icon SVG to src/icons/YourIcon.tsx
// 2. Export it from src/icons/index.ts
// 3. Add an entry below in the appropriate section
// ============================================

export type MenuItemId =
    | 'home'
    | 'saved'
    | 'theme'
    | 'textSize'
    | 'sources'
    | 'settings'
    | 'help'
    | 'about';

export interface MenuItemConfig {
    id: MenuItemId;
    label: string;
    icon: IconComponent;
    iconFilled?: IconComponent;
}

export interface SectionConfig {
    title: string;
    items: MenuItemConfig[];
}

// Default icon size used throughout sidebar
export const ICON_SIZE = 22;

// ============================================
// MENU SECTIONS - Edit these to modify sidebar
// ============================================

export const SIDEBAR_SECTIONS: SectionConfig[] = [
    {
        title: 'NAVIGATION',
        items: [
            {
                id: 'home',
                label: 'Home',
                icon: Home,
                iconFilled: HomeFilled,
            },
            {
                id: 'saved',
                label: 'Saved Articles',
                icon: Bookmark,
                iconFilled: BookmarkFilled,
            },
        ],
    },
    {
        title: 'PREFERENCES',
        items: [
            {
                id: 'theme',
                label: 'Dark Mode',
                icon: Moon,
            },
            {
                id: 'textSize',
                label: 'Text Size',
                icon: TextSizeIcon,
            },
            {
                id: 'sources',
                label: 'Sources',
                icon: SourcesIcon,
            },
            {
                id: 'settings',
                label: 'Settings',
                icon: SettingsIcon,
            },
        ],
    },
    {
        title: 'MORE',
        items: [
            {
                id: 'help',
                label: 'Help & Feedback',
                icon: HelpIcon,
            },
            {
                id: 'about',
                label: 'About',
                icon: AboutIcon,
            },
        ],
    },
];

// ============================================
// PLACEHOLDER ICONS (Replace with LineIcons)
// ============================================

function TextSizeIcon({ width = 22, height = 22, color = "#343C54" }: { width?: number; height?: number; color?: string }) {
    return (
        <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
            <Path
                d="M5 19h2.5l1-3h7l1 3H19L13 5h-2L5 19zm4.5-5L12 7l2.5 7h-5z"
                fill={color}
            />
        </Svg>
    );
}

function SourcesIcon({ width = 22, height = 22, color = "#343C54" }: { width?: number; height?: number; color?: string }) {
    return (
        <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
            <Rect x="3" y="3" width="7" height="7" rx="1" fill={color} />
            <Rect x="14" y="3" width="7" height="7" rx="1" fill={color} />
            <Rect x="3" y="14" width="7" height="7" rx="1" fill={color} />
            <Rect x="14" y="14" width="7" height="7" rx="1" fill={color} />
        </Svg>
    );
}

function SettingsIcon({ width = 22, height = 22, color = "#343C54" }: { width?: number; height?: number; color?: string }) {
    return (
        <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
            <Circle cx="12" cy="12" r="3" fill={color} />
            <Path
                d="M12 1v3M12 20v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M1 12h3M20 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
            />
        </Svg>
    );
}

function HelpIcon({ width = 22, height = 22, color = "#343C54" }: { width?: number; height?: number; color?: string }) {
    return (
        <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
            <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
            <Path
                d="M9 9a3 3 0 1 1 4 2.83V13M12 17h.01"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}

function AboutIcon({ width = 22, height = 22, color = "#343C54" }: { width?: number; height?: number; color?: string }) {
    return (
        <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
            <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
            <Path
                d="M12 16v-4M12 8h.01"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
            />
        </Svg>
    );
}
