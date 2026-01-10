import { NewsItem } from '../types';

export type RootStackParamList = {
  Onboarding: undefined;
  Home: undefined;
  ArticleDetail: { article: NewsItem };
  Settings: undefined;
  TextSize: undefined;
  Sources: undefined;
  Saved: undefined;
  Help: undefined;
  About: undefined;
};
