import { XMLParser } from 'fast-xml-parser';
import { Platform } from 'react-native';
import { NewsItem, RSSFeed, ParsedRSS, ParsedRSSItem } from '../types';

// Use CORS proxy for web only - native apps don't have CORS restrictions
const CORS_PROXY = 'https://corsproxy.io/?url=';

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
});

function extractString(value: any): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object') {
    if (value['#text']) return String(value['#text']);
    if (value['@_href']) return String(value['@_href']);
  }
  return String(value);
}

function extractTags(category: any): string[] {
  if (!category) return [];
  
  const tags: string[] = [];
  
  if (typeof category === 'string') {
    tags.push(category);
  } else if (Array.isArray(category)) {
    category.forEach((cat) => {
      if (typeof cat === 'string') {
        tags.push(cat);
      } else if (cat && typeof cat === 'object') {
        const text = cat['#text'] || cat['@_term'] || '';
        if (text) tags.push(String(text));
      }
    });
  } else if (typeof category === 'object') {
    const text = category['#text'] || category['@_term'] || '';
    if (text) tags.push(String(text));
  }
  
  // Clean and deduplicate tags, limit to 3
  return [...new Set(tags.map(t => t.trim()).filter(t => t.length > 0))].slice(0, 3);
}

function generateId(item: ParsedRSSItem, source: string, index: number): string {
  const guid = extractString(item.guid);
  const link = extractString(item.link);
  const title = extractString(item.title);
  const base = guid || link || title || `item-${index}`;
  return `${source}-${base}`.replace(/[^a-zA-Z0-9]/g, '-').slice(0, 100);
}

function formatDate(dateString?: string): string {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) {
      const diffMins = Math.floor(diffMs / (1000 * 60));
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  } catch {
    return '';
  }
}

function parseItems(data: ParsedRSS, sourceName: string): NewsItem[] {
  const items: NewsItem[] = [];

  // Handle RSS 2.0 format
  if (data.rss?.channel) {
    const channel = data.rss.channel;
    const rssItems = channel.item;

    if (rssItems) {
      const itemArray = Array.isArray(rssItems) ? rssItems : [rssItems];
      itemArray.forEach((item, index) => {
        if (item.title) {
          items.push({
            id: generateId(item, sourceName, index),
            title: extractString(item.title).trim(),
            link: extractString(item.link),
            pubDate: formatDate(extractString((item as any).pubDate)),
            source: sourceName,
            tags: extractTags((item as any).category),
          });
        }
      });
    }
  }

  // Handle Atom format
  if (data.feed?.entry) {
    const entries = data.feed.entry;
    const entryArray = Array.isArray(entries) ? entries : [entries];

    entryArray.forEach((entry, index) => {
      const title = (entry as any).title;
      const link = (entry as any).link;
      const published = (entry as any).published || (entry as any).updated;
      const entryId = (entry as any).id;
      const category = (entry as any).category;

      const linkUrl = extractString(link);
      const titleText = extractString(title);
      const idValue = extractString(entryId);

      if (titleText) {
        items.push({
          id: generateId({ title: titleText, link: linkUrl, guid: idValue }, sourceName, index),
          title: titleText.trim(),
          link: linkUrl,
          pubDate: formatDate(extractString(published)),
          source: sourceName,
          tags: extractTags(category),
        });
      }
    });
  }

  return items;
}

export async function fetchFeed(feed: RSSFeed): Promise<NewsItem[]> {
  try {
    const url = Platform.OS === 'web'
      ? `${CORS_PROXY}${encodeURIComponent(feed.url)}`
      : feed.url;

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/rss+xml, application/xml, text/xml, application/atom+xml',
      },
    });

    if (!response.ok) {
      console.warn(`Failed to fetch ${feed.name}: ${response.status}`);
      return [];
    }

    const xml = await response.text();
    const data = parser.parse(xml) as ParsedRSS;

    return parseItems(data, feed.name);
  } catch (error) {
    console.warn(`Error fetching ${feed.name}:`, error);
    return [];
  }
}

export async function fetchAllFeeds(feeds: RSSFeed[]): Promise<NewsItem[]> {
  const results = await Promise.all(feeds.map(fetchFeed));
  const allItems = results.flat();

  allItems.sort((a, b) => {
    if (!a.pubDate && !b.pubDate) return 0;
    if (!a.pubDate) return 1;
    if (!b.pubDate) return -1;

    const getMinutes = (str: string): number => {
      if (str.includes('m ago')) return parseInt(str);
      if (str.includes('h ago')) return parseInt(str) * 60;
      if (str.includes('d ago')) return parseInt(str) * 60 * 24;
      return 999999;
    };

    return getMinutes(a.pubDate) - getMinutes(b.pubDate);
  });

  return allItems;
}
