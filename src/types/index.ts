export interface NewsItem {
  id: string;
  title: string;
  link: string;
  pubDate: string;
  source: string;
  tags: string[];
}

export interface RSSFeed {
  name: string;
  url: string;
}

export interface ParsedRSSItem {
  title?: string;
  link?: string;
  pubDate?: string;
  guid?: string;
  category?: string | string[] | { '#text': string }[];
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
