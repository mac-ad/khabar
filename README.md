# 📰 Khabar

A modern, fast, and beautiful news aggregator app for Android & iOS. Built with React Native and Expo.

> **Khabar** (खबर) means "news" in Nepali/Hindi

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Platform](https://img.shields.io/badge/platform-Android%20%7C%20iOS-brightgreen)
![React Native](https://img.shields.io/badge/React%20Native-0.81.5-61dafb)
![Expo](https://img.shields.io/badge/Expo-54-000020)

---

## ✨ Features

### 📱 Core Features
- **Multi-source RSS Feed Aggregation** — Get news from 10+ sources in one place
- **Nepali & International Sources** — Online Khabar, Nagarik News, BBC, Al Jazeera, The Guardian, TechCrunch, Hacker News, and more
- **Smart Feed Management** — Enable/disable sources based on your preferences
- **Offline Reading** — Save articles for later

### 🎨 User Experience
- **Dark & Light Themes** — Toggle with one tap, preference is remembered
- **Adjustable Text Size** — Comfortable reading for everyone
- **Gesture Navigation** — Swipe from edge to open sidebar
- **Smooth Animations** — Polished transitions powered by Lottie
- **Pull to Refresh** — Stay updated with the latest news

### 💾 Data & Privacy
- **Local Storage** — Saved articles and preferences stored on-device
- **No Account Required** — Use the app without signing up
- **Minimal Permissions** — Only requires internet access

---

## 📸 Screenshots
<div style="display: flex; gap: 10px; align-items: flex-start;">
  <img src="https://raw.githubusercontent.com/mac-ad/khabar/refs/heads/main/assets/mockups/first.png" alt="First Mockup" width="200">
  <img src="https://raw.githubusercontent.com/mac-ad/khabar/refs/heads/main/assets/mockups/second.png" alt="Second Mockup" width="200">
  <img src="https://raw.githubusercontent.com/mac-ad/khabar/refs/heads/main/assets/mockups/third.png" alt="Third Mockup" width="200">
  <img src="https://raw.githubusercontent.com/mac-ad/khabar/refs/heads/main/assets/mockups/fourth.png" alt="Fourth Mockup" width="200">
  
</div>


## 🗞️ Supported News Sources

### Local (Nepali)

### International

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/khabar.git
cd khabar

# Install dependencies
pnpm install

# Start the development server
pnpm start
```

### Running on Device

```bash
# Android
pnpm run android

# iOS
pnpm run ios
```

---

## 📦 Building for Production

### Android APK (Optimized)

The build is configured with the following optimizations:
- ✅ ARM-only architectures (no emulator bloat)
- ✅ Code minification with R8/ProGuard
- ✅ Resource shrinking
- ✅ PNG compression
- ✅ Hermes JavaScript engine

```bash
cd android
./gradlew assembleRelease
```

Output: `android/app/build/outputs/apk/release/app-release.apk`

### Android App Bundle (for Play Store)

```bash
cd android
./gradlew bundleRelease
```

Output: `android/app/build/outputs/bundle/release/app-release.aab`

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React Native 0.81** | Cross-platform mobile framework |
| **Expo SDK 54** | Development toolchain & native APIs |
| **React Navigation 7** | Screen navigation |
| **AsyncStorage** | Local data persistence |
| **Lottie** | Beautiful animations |
| **fast-xml-parser** | RSS/XML feed parsing |
| **react-native-render-html** | Article content rendering |
| **Hermes** | Optimized JavaScript engine |

---

## 📁 Project Structure

```
khabar/
├── android/                 # Android native project
├── ios/                     # iOS native project
├── src/
│   ├── assets/             # Animations, images
│   ├── components/         # Reusable UI components
│   │   ├── NewsItem.tsx    # Individual news card
│   │   ├── NewsList.tsx    # Scrollable news feed
│   │   ├── Sidebar.tsx     # Navigation drawer
│   │   └── SkeletonLoader.tsx
│   ├── constants/
│   │   ├── feeds.ts        # RSS feed configurations
│   │   └── theme.ts        # Color schemes
│   ├── context/
│   │   ├── AppContext.tsx  # Global app state
│   │   └── ThemeContext.tsx # Theme management
│   ├── icons/              # Custom SVG icons
│   ├── navigation/         # React Navigation setup
│   ├── screens/
│   │   ├── HomeScreen.tsx
│   │   ├── ArticleDetailScreen.tsx
│   │   ├── SavedArticlesScreen.tsx
│   │   ├── ManageSourcesScreen.tsx
│   │   ├── SettingsScreen.tsx
│   │   └── ...
│   ├── services/
│   │   └── feedService.ts  # RSS fetching logic
│   └── types/              # TypeScript definitions
├── App.tsx                 # App entry point
├── app.json                # Expo configuration
└── package.json
```

---

## ⚙️ Configuration

### Adding a New RSS Source

Edit `src/constants/feeds.ts`:

```typescript
{
  name: 'Your Source Name',
  slug: 'your-source-slug',
  url: 'https://example.com/feed.xml',
  category: 'local' | 'international',
}
```

### Customizing Themes

Edit `src/constants/theme.ts` to modify the light and dark color schemes.

---

## 📄 License

This project is licensed under the MIT License.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📬 Contact

For questions or feedback, please open an issue on GitHub.

---

<p align="center">
  Made with ❤️ for news readers everywhere
</p>

