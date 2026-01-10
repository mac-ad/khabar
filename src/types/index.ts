export interface NewsItem {
  id: string;
  title: string;
  link: string;
  pubDate: string;
  originalPubDate: string;
  sourceSlug: string;
  sourceName: string;
  tags: string[];
  description: string;
  image?: string;
  author?: string;
}

export type FeedCategory = 'local' | 'international';

export interface RSSFeed {
  name: string;
  slug: string;
  url: string;
  category: FeedCategory;
}

export interface ParsedRSSItem {
  title?: string;
  link?: string;
  pubDate?: string;
  guid?: string;
  category?: string | string[] | { '#text': string }[];
  description?: string;
  published?: string;
  updated?: string;
  id?: string;
}

export interface ParsedRSSChannel {
  title?: string;
  item?: ParsedRSSItem | ParsedRSSItem[];
}

export interface ParsedRSS {
  rss?: {
    channel?: ParsedRSSChannel;
  };
  feed?: {
    title?: string;
    entry?: ParsedRSSItem | ParsedRSSItem[];
  };
}
