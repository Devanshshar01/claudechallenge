# MindSafe - Private Journal

A privacy-first, offline mental health journaling app built with React Native and Expo.

## Features

- **100% Offline & Private**: All data stored locally on your device with basic encryption
- **AI-Powered Mood Analysis**: Sophisticated on-device sentiment analysis engine
- **Beautiful UI**: Calming design with smooth animations and gradients
- **Smart Insights**: Pattern detection, mood trends, and personalized recommendations
- **Streak Tracking**: Monitor your journaling consistency
- **Export/Import**: Backup and restore your journal entries

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npm start
```

### Running on Different Platforms

```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## Project Structure

```
claudechallenge/
├── app/                    # Expo Router screens
│   ├── (tabs)/            # Tab navigation
│   │   ├── index.tsx      # Journal list
│   │   ├── insights.tsx   # Analytics & insights
│   │   └── settings.tsx   # App settings
│   ├── modal.tsx          # New entry modal
│   └── _layout.tsx        # Root layout
├── components/            # Reusable components
│   ├── PrivacyBadge.tsx
│   ├── MoodIndicator.tsx
│   └── EntryCard.tsx
├── screens/              # Main screens
│   └── JournalScreen.tsx # Writing & analysis interface
├── utils/                # Utilities
│   ├── storage.ts        # AsyncStorage wrapper with encryption
│   └── analysis.ts       # Sentiment analysis engine
└── constants/
    └── Colors.ts         # App color scheme
```

## Key Technologies

- **React Native**: Cross-platform mobile framework
- **Expo**: Development platform and tooling
- **AsyncStorage**: Local data persistence
- **Expo Router**: File-based routing
- **React Native Reanimated**: Smooth animations
- **Linear Gradient**: Beautiful UI gradients

## Privacy & Security

- No data ever leaves your device
- No internet connection required
- Basic encryption via Base64 encoding
- No analytics or tracking
- No external API calls

## Color Scheme

- Primary: #6366F1 (Indigo)
- Secondary: #8B5CF6 (Purple)
- Background: #F8FAFC (Light Gray)
- Success: #10B981 (Green)
- Warning: #F59E0B (Amber)

## Sentiment Analysis

The app includes a comprehensive offline sentiment analysis engine with:

- 100+ positive and 100+ negative word dictionary
- Emotion detection (joy, sadness, anxiety, anger, peace)
- Mood classification (positive, negative, neutral, mixed)
- Intensity and confidence scoring
- Pattern recognition over time
- Support detection for concerning trends

## License

MIT

## Developed for Mental Health Awareness

This app is designed to provide a safe, private space for self-reflection and mental health journaling. Always remember that professional help is important - this app is a tool to complement, not replace, professional mental health care.
