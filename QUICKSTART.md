# MindSafe Quick Start Guide

## 🚀 Getting Started

### 1. Install Dependencies (Already Done)
```bash
npm install
```

### 2. Start the Development Server
```bash
npm start
```

### 3. Run on Your Device

#### Option A: Expo Go App (Easiest)
1. Install "Expo Go" app from App Store (iOS) or Play Store (Android)
2. Scan the QR code shown in the terminal
3. The app will load on your device

#### Option B: iOS Simulator (Mac Only)
```bash
npm run ios
```

#### Option C: Android Emulator
```bash
npm run android
```

#### Option D: Web Browser
```bash
npm run web
```

## 📱 How to Use the App

### Main Features

1. **Journal Tab** (Home)
   - View all your journal entries
   - Tap the "+" FAB button to create a new entry
   - Pull to refresh the list

2. **New Entry (Modal)**
   - Write your thoughts in the text area
   - Watch the word/character count
   - Click "Analyze Mood" when you have 20+ characters
   - View your mood analysis with:
     - Mood emoji and name
     - Confidence percentage
     - Detected emotions
     - Personalized insight
   - Click "Save Entry" to store it privately

3. **Insights Tab**
   - See total entries count
   - View weekly mood trend (Improving/Declining/Stable)
   - Check your dominant mood
   - Get personalized recommendations
   - Support alert if consistently feeling down

4. **Settings Tab**
   - View privacy information
   - Clear all data option
   - App version

## 🎨 Features to Test

### Mood Analysis
Try entering different types of text to see the analysis:

**Happy Entry:**
```
I'm feeling so grateful today! Had an amazing time with friends, 
everything went wonderfully. Life is good and I'm feeling blessed.
```

**Anxious Entry:**
```
I'm really worried about tomorrow. Feeling overwhelmed and nervous. 
Can't stop thinking about all the things that could go wrong.
```

**Mixed Entry:**
```
Today was complicated. Some good moments but also frustrating times. 
Happy about my progress but anxious about the future.
```

### Privacy Features
- All data stays on your device
- No internet required
- The privacy badge shows "🔒 Offline & Private"

### Insights
- Write multiple entries over "different days" (you can manually test by creating entries)
- Check the Insights tab to see trends
- The app detects patterns and provides recommendations

## 🔧 Troubleshooting

### If the app doesn't start:
1. Clear cache: `npm start -- --clear`
2. Reinstall node_modules: `rm -rf node_modules && npm install`

### If you see TypeScript errors:
- The app should still run despite warnings
- Most errors are type-related and won't affect functionality

### If AsyncStorage isn't working:
- Make sure you're testing on a real device or properly configured simulator
- Web version uses localStorage as fallback

## 📦 Project Structure

```
MindSafe/
├── app/                      # Screens
│   ├── (tabs)/              # Bottom tabs
│   │   ├── index.tsx        # Journal list
│   │   ├── insights.tsx     # Analytics
│   │   └── settings.tsx     # Settings
│   └── modal.tsx            # New entry (uses JournalScreen)
├── screens/
│   └── JournalScreen.tsx    # Main writing interface
├── components/              # Reusable UI
│   ├── PrivacyBadge.tsx
│   ├── MoodIndicator.tsx
│   └── EntryCard.tsx
├── utils/
│   ├── storage.ts           # Data persistence + encryption
│   └── analysis.ts          # Sentiment analysis engine
└── constants/
    └── Colors.ts            # Theme colors
```

## 🎯 Key Technologies

- **React Native + Expo**: Cross-platform framework
- **AsyncStorage**: Offline data storage
- **Expo Router**: File-based navigation
- **React Native Reanimated**: Smooth animations
- **Linear Gradient**: Beautiful backgrounds

## 🛡️ Privacy & Data

- **100% Offline**: No API calls, no internet needed
- **Local Storage**: All data in AsyncStorage
- **Basic Encryption**: Base64 encoding for privacy
- **No Tracking**: Zero analytics or telemetry

## 🌈 Color Scheme

- Primary: #6366F1 (Indigo)  
- Secondary: #8B5CF6 (Purple)  
- Background: #F8FAFC (Soft Gray)  
- Success: #10B981 (Green)  
- Warning: #F59E0B (Amber)  

## 📝 Next Steps (Optional Enhancements)

If you want to extend the app:

1. **Add Tags System**: Let users tag entries for better organization
2. **Calendar View**: Visual calendar showing which days have entries
3. **Export to PDF**: Generate beautiful PDF reports
4. **Reminder Notifications**: Daily journaling reminders
5. **Dark Mode**: Full dark theme support (colors already defined)
6. **Charts**: Visual mood trend charts using react-native-chart-kit
7. **Voice Input**: Speech-to-text for hands-free journaling
8. **Passcode Lock**: Extra security layer

## 💡 Tips

- Write at least 50+ words for better analysis results
- Journal regularly to see meaningful trends
- The streak counter tracks consecutive days with entries
- Support detection kicks in after 3+ consistently negative entries

Enjoy your private, AI-powered mental health journal! 🧠💜
