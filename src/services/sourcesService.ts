import { RSSFeed } from '../types';

const SOURCES_URL = 'https://raw.githubusercontent.com/mac-ad/khabar-privacy/refs/heads/main/data/sources.json';
const CACHE_KEY = '@khabar_remote_sources';
const CACHE_EXPIRY_KEY = '@khabar_remote_sources_expiry';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * Fallback RSS feeds used when remote fetch fails
 * This ensures the app always has sources available
 */
const FALLBACK_FEEDS: RSSFeed[] = [
  // Local (Nepali) Sources
  {
    name: 'Online Khabar',
    slug: 'online-khabar',
    url: 'https://www.onlinekhabar.com/feed',
    category: 'local',
  },
  {
    name: 'Nagarik News',
    slug: 'nagarik-news',
    url: 'https://nagariknews.nagariknetwork.com/feed',
    category: 'local',
  },
  {
    name: 'Rajdhani Daily',
    slug: 'rajdhanidaily',
    url: 'https://rajdhanidaily.com/feed/',
    category: 'local',
  },
  {
    name: 'Newsof Nepal',
    slug: 'newsofnepal',
    url: 'https://newsofnepal.com/feed/',
    category: 'local',
  },
  {
    name: 'OS Nepal',
    slug: 'osnepal',
    url: 'https://www.osnepal.com/feed',
    category: 'local',
  },
  {
    name: 'Techmandu',
    slug: 'techmandu',
    url: 'https://techmandu.com/feed/',
    category: 'local',
  },
  // International Sources
  {
    name: 'BBC News',
    slug: 'bbc-news',
    url: 'https://feeds.bbci.co.uk/news/world/rss.xml',
    category: 'international',
  },
  {
    name: 'Al Jazeera',
    slug: 'al-jazeera',
    url: 'https://www.aljazeera.com/xml/rss/all.xml',
    category: 'international',
  },
  {
    name: 'The Guardian',
    slug: 'the-guardian',
    url: 'https://www.theguardian.com/world/rss',
    category: 'international',
  },
  {
    name: 'NPR News',
    slug: 'npr-news',
    url: 'https://feeds.npr.org/1001/rss.xml',
    category: 'international',
  },
  {
    name: 'TechCrunch',
    slug: 'techcrunch',
    url: 'https://techcrunch.com/feed/',
    category: 'international',
  },
  {
    name: 'Hacker News',
    slug: 'hacker-news',
    url: 'https://hnrss.org/frontpage',
    category: 'international',
  },
];

/**
 * Fetch RSS sources from remote endpoint
 * Falls back to FALLBACK_FEEDS if fetch fails
 * Implements caching to reduce network requests
 */
export async function fetchRemoteSources(): Promise<RSSFeed[]> {
  try {
    // Try to get cached data first
    const cachedData = await getCachedSources();
    if (cachedData) {
      console.log('Using cached sources');
      return cachedData;
    }

    console.log('Fetching sources from remote...');
    // Fetch from remote endpoint
    const response = await fetch(SOURCES_URL, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.warn(`Failed to fetch sources: ${response.status}`);
      return FALLBACK_FEEDS; // Fallback to local feeds
    }

    const remoteSources: RSSFeed[] = await response.json();

    // Validate the response
    if (!Array.isArray(remoteSources) || remoteSources.length === 0) {
      console.warn('Invalid remote sources format');
      return FALLBACK_FEEDS; // Fallback to local feeds
    }

    // Validate each source has required fields
    const validSources = remoteSources.filter(source =>
      source.name && source.slug && source.url && source.category
    );

    if (validSources.length === 0) {
      console.warn('No valid sources in remote response');
      return FALLBACK_FEEDS; // Fallback to local feeds
    }

    // Remove duplicate sources based on URL
    const uniqueSources = validSources.filter((source, index, self) =>
      index === self.findIndex((s) => s.url === source.url)
    );

    console.log(`Loaded ${uniqueSources.length} unique sources from remote`);

    // Cache the successful response
    await cacheSources(uniqueSources);

    return uniqueSources;
  } catch (error) {
    console.error('Error fetching remote sources:', error);

    // Try to return cached data even if expired
    const cachedData = await getCachedSources(true);
    if (cachedData) {
      console.log('Using expired cache due to fetch error');
      return cachedData;
    }

    // Final fallback to local feeds
    return FALLBACK_FEEDS;
  }
}

/**
 * Get cached sources if available and not expired
 */
async function getCachedSources(ignoreExpiry = false): Promise<RSSFeed[] | null> {
  try {
    const { default: AsyncStorage } = await import('@react-native-async-storage/async-storage');

    const [cachedDataStr, expiryStr] = await Promise.all([
      AsyncStorage.getItem(CACHE_KEY),
      AsyncStorage.getItem(CACHE_EXPIRY_KEY),
    ]);

    if (!cachedDataStr) {
      return null;
    }

    // Check if cache has expired
    if (!ignoreExpiry && expiryStr) {
      const expiryTime = parseInt(expiryStr, 10);
      if (Date.now() > expiryTime) {
        return null; // Cache expired
      }
    }

    const cachedData = JSON.parse(cachedDataStr) as RSSFeed[];

    // Validate cached data
    if (!Array.isArray(cachedData) || cachedData.length === 0) {
      return null;
    }

    return cachedData;
  } catch (error) {
    console.error('Error reading cached sources:', error);
    return null;
  }
}

/**
 * Cache sources with expiry time
 */
async function cacheSources(sources: RSSFeed[]): Promise<void> {
  try {
    const { default: AsyncStorage } = await import('@react-native-async-storage/async-storage');

    const expiryTime = Date.now() + CACHE_DURATION;

    await Promise.all([
      AsyncStorage.setItem(CACHE_KEY, JSON.stringify(sources)),
      AsyncStorage.setItem(CACHE_EXPIRY_KEY, expiryTime.toString()),
    ]);
  } catch (error) {
    console.error('Error caching sources:', error);
  }
}

/**
 * Clear cached sources (useful for force refresh)
 */
export async function clearSourcesCache(): Promise<void> {
  try {
    const { default: AsyncStorage } = await import('@react-native-async-storage/async-storage');

    await Promise.all([
      AsyncStorage.removeItem(CACHE_KEY),
      AsyncStorage.removeItem(CACHE_EXPIRY_KEY),
    ]);
  } catch (error) {
    console.error('Error clearing sources cache:', error);
  }
}

