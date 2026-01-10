export const lightTheme = {
  background: '#FFFFFF',
  surface: '#FFFFFF',
  text: '#000000',
  textSecondary: '#333333',
  textMuted: '#666666',
  separator: '#E0E0E0',
  accent: '#000000',
  tagBackground: '#F0F0F0',
  tagText: '#333333',
  headerLine: '#000000',
};

export const darkTheme = {
  background: '#000000',
  surface: '#000000',
  text: '#FFFFFF',
  textSecondary: '#CCCCCC',
  textMuted: '#999999',
  separator: '#333333',
  accent: '#FFFFFF',
  tagBackground: '#1A1A1A',
  tagText: '#CCCCCC',
  headerLine: '#FFFFFF',
};

export type Theme = typeof lightTheme;

// Source colors - keyed by slug, now grayscale
export const SOURCE_COLORS: Record<string, { light: string; dark: string }> = {
  'bbc-news': { light: '#000000', dark: '#FFFFFF' },
  'techcrunch': { light: '#000000', dark: '#FFFFFF' },
  'the-verge': { light: '#000000', dark: '#FFFFFF' },
  'reuters': { light: '#000000', dark: '#FFFFFF' },
};
