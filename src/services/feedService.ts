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

    if (diffMs < 60 * 1000) {
      return 'just now';
    }

    const minutes = Math.floor(diffMs / (60 * 1000));
    if (minutes < 60) {
      return `${minutes}m ago`;
    }

    const hours = Math.floor(diffMs / (60 * 60 * 1000));
    if (hours < 24) {
      return `${hours}h ago`;
    }

    const days = Math.floor(diffMs / (24 * 60 * 60 * 1000));
    if (days < 7) {
      return `${days}d ago`;
    }

    // Otherwise, show calendar date
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  } catch {
    return '';
  }
}




function extractImage(item: any): string | undefined {
  // Try common RSS image fields
  if (item.image) return extractString(item.image);
  if (item['media:content']?.['@_url']) return item['media:content']['@_url'];
  if (item['media:thumbnail']?.['@_url']) return item['media:thumbnail']['@_url'];
  if (item.enclosure?.['@_url'] && item.enclosure['@_type']?.startsWith('image/')) {
    return item.enclosure['@_url'];
  }

  // Try to extract image from content:encoded
  const content = item['content:encoded'] || item.content || '';
  if (content) {
    const imgMatch = String(content).match(/<img[^>]+src=["']([^"']+)["']/i);
    if (imgMatch?.[1]) return imgMatch[1];
  }

  return undefined;
}

function extractAuthor(item: any): string | undefined {
  // Try common RSS author fields
  if (item['dc:creator']) return extractString(item['dc:creator']);
  if (item.author) {
    if (typeof item.author === 'string') return item.author;
    if (item.author.name) return extractString(item.author.name);
    return extractString(item.author);
  }
  if (item.creator) return extractString(item.creator);
  return undefined;
}

function parseItems(data: ParsedRSS, sourceSlug: string, sourceName: string): NewsItem[] {
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
            id: generateId(item, sourceSlug, index),
            title: extractString(item.title).trim(),
            link: extractString(item.link),
            pubDate: formatDate(extractString(item.pubDate)),
            originalPubDate: extractString(item.pubDate),
            description: extractString(item?.description),
            sourceSlug: sourceSlug,
            sourceName: sourceName,
            tags: extractTags(item.category),
            image: extractImage(item),
            author: extractAuthor(item),
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
      const title = entry.title;
      const link = entry.link;
      const published = entry?.published || entry.updated;
      const entryId = entry.id;
      const category = entry.category;

      const linkUrl = extractString(link);
      const titleText = extractString(title);
      const idValue = extractString(entryId);


      if (titleText) {
        items.push({
          id: generateId({ title: titleText, link: linkUrl, guid: idValue }, sourceSlug, index),
          title: titleText.trim(),
          link: linkUrl,
          originalPubDate: published || '',
          pubDate: formatDate(extractString(published)),
          sourceSlug: sourceSlug,
          sourceName: sourceName,
          tags: extractTags(category),
          description: extractString((entry as any).description),
          image: extractImage(entry),
          author: extractAuthor(entry),
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

    return parseItems(data, feed.slug, feed.name);
  } catch (error) {
    console.warn(`Error fetching ${feed.name}:`, error);
    return [];
  }
}

export async function fetchAllFeeds(feeds: RSSFeed[]): Promise<NewsItem[]> {
  const results = await Promise.all(feeds.map(fetchFeed));
  const allItems = results.flat();

  allItems.sort((a, b) => {
    if (!a.originalPubDate && !b.originalPubDate) return 0;
    if (!a.originalPubDate) return 1;
    if (!b.originalPubDate) return -1;

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
