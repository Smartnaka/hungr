# hungr 🍽️

> **What should I eat?** — A fast, offline-first mobile app that eliminates food decision fatigue.

## Overview

hungr is a lightweight React Native (Expo) app built with TypeScript. It suggests random meals from a curated local list with zero internet required and no backend. Just tap and eat.

## Features

- 🎲 **Random meal suggestion** — instant pick with a single tap
- 🗂️ **Category filtering** — All, Local, Fast Food, Snacks
- 💸 **Budget mode** — filters to budget-friendly meals only
- ❤️ **Favorites** — save and manage meals, persisted with AsyncStorage
- 🔍 **Search favorites** — filter your saved meals by name
- 🎯 **Suggest from favorites** — get a random pick from your saved list
- 📋 **Copy meal** — copy the meal name to clipboard
- 🔗 **Share meal** — share your pick via the native share sheet
- 💫 **Haptic feedback** — tactile response on key interactions
- 🦴 **Skeleton loading** — polished loading state while fetching a suggestion
- ⚠️ **Error + retry** — graceful error state with one-tap retry
- 📱 **Offline-first** — works with zero connectivity

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React Native (Expo ~55) |
| Language | TypeScript |
| Storage | AsyncStorage (~2.2.0) |
| Animations | react-native-reanimated (~4.2.1) |
| Gestures | react-native-gesture-handler (~2.30.0) |
| Haptics | expo-haptics |
| Gradients | expo-linear-gradient |
| Clipboard | expo-clipboard |
| Sharing | expo-sharing |
| Safe Area | react-native-safe-area-context |
| Backend | None |

## Getting Started

```bash
# Install dependencies
npm install

# Start Expo dev server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios
```

## EAS Build

This project is configured for [Expo Application Services (EAS)](https://docs.expo.dev/build/introduction/) builds.

### Prerequisites

```bash
npm install -g eas-cli
eas login
```

### First-time setup

After cloning, link the project to your Expo account to replace the `your-project-id` placeholders in `app.json`:

```bash
eas init
```

This updates `app.json` with your real `extra.eas.projectId` and `updates.url`.

### Build profiles

| Profile | Distribution | Purpose |
|---|---|---|
| `development` | Internal | Local dev with Expo Dev Client |
| `preview` | Internal | QA/testing builds |
| `production` | App Store / Play Store | Release builds |

```bash
# Development build
eas build --profile development --platform all

# Preview build
eas build --profile preview --platform all

# Production build
eas build --profile production --platform all
```

## Project Structure

```
hungr/
├── App.tsx                     # Entry point
├── app.json                    # Expo config
├── eas.json                    # EAS build profiles
├── src/
│   ├── data/
│   │   └── meals.ts            # Local meal list (categorised)
│   ├── components/
│   │   ├── CategoryTabs.tsx    # Category filter tabs
│   │   ├── MealCard.tsx        # Meal display card
│   │   ├── SuggestButton.tsx   # Primary CTA button
│   │   ├── Toast.tsx           # Inline toast notification
│   │   └── ui/                 # Reusable UI primitives
│   │       ├── AppButton.tsx
│   │       ├── AppCard.tsx
│   │       ├── EmptyState.tsx
│   │       ├── IconButton.tsx
│   │       ├── InputField.tsx
│   │       └── SkeletonLoader.tsx
│   ├── hooks/
│   │   ├── useFavorites.ts     # Favorites state + AsyncStorage
│   │   └── useMealSuggestion.ts # Random meal selection logic
│   ├── screens/
│   │   ├── HomeScreen.tsx      # Main suggestion screen
│   │   └── SplashScreen.tsx    # Launch screen
│   └── theme/                  # Design system tokens
│       ├── colors.ts
│       ├── spacing.ts
│       ├── typography.ts
│       ├── shadows.ts
│       └── index.ts
└── assets/
```

## Data Structure

```ts
{
  id: 1,
  name: 'Jollof Rice',
  emoji: '🍚',
  category: 'Local',   // 'Local' | 'Fast Food' | 'Snacks'
  isBroke: false,      // true = budget-friendly
}
```
