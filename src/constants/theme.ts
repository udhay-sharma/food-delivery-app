/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export interface ThemeColors {
  readonly background: string;
  readonly card: string;
  readonly text: string;
  readonly textSecondary: string;
  readonly primary: string;
  readonly border: string;
  readonly activeTab: string;
  readonly inactiveTab: string;
  readonly backgroundElement: string;
  readonly backgroundSelected: string;
  readonly shadowColor: string;
  readonly error: string;
  readonly success: string;
}

export const Colors: {
  readonly light: ThemeColors;
  readonly dark: ThemeColors;
} = {
  light: {
    background: '#F8F9FA',
    card: '#FFFFFF',
    text: '#1C1C1E',
    textSecondary: '#7C7C80',
    primary: '#E03E2D',
    border: '#EBEBEB',
    activeTab: '#E03E2D',
    inactiveTab: '#8E8E93',
    backgroundElement: '#F2F2F7',
    backgroundSelected: '#E5E5EA',
    shadowColor: '#000000',
    error: '#FF3B30',
    success: '#34C759',
  },
  dark: {
    background: '#0C0C0E',
    card: '#161619',
    text: '#FFFFFF',
    textSecondary: '#A0A0A5',
    primary: '#FF4B3A',
    border: '#242426',
    activeTab: '#FF4B3A',
    inactiveTab: '#636366',
    backgroundElement: '#1C1C1E',
    backgroundSelected: '#2C2C2E',
    shadowColor: '#000000',
    error: '#FF453A',
    success: '#30D158',
  },
};

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
