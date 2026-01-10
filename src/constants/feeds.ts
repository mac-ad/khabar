import { RSSFeed } from '../types';

export const RSS_FEEDS: RSSFeed[] = [
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
  {
    name: 'Nepali Post',
    slug: 'nepalipost',
    url: 'http://nepalipost.com/beta/feed',
    category: 'local',
  },

  // International Sources
  {
    name: 'BBC News',
    slug: 'bbc-news',
    url: 'https://feeds.bbci.co.uk/news/world/rss.xml',
    category: 'international',
  },
  // {
  //   name: 'Reuters',
  //   slug: 'reuters',
  //   url: 'https://www.reutersagency.com/feed/',
  //   category: 'international',
  // },
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
