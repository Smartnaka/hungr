# hungr 🍽️

> **What Should I Eat?** — A fast, offline mobile app that kills food decision fatigue.

## Overview

hungr is a lightweight React Native (Expo) app that suggests random meals from a curated local list. No internet required. No backend. Just tap and eat.

## Features

### MVP
- 🎲 **Random meal suggestion** — tap "Suggest Meal" to get an instant pick
- 🗂️ **Category filtering** — All, Local, Fast Food, Snacks
- 📱 **Offline-first** — works with zero connectivity

### Phase 2 (included)
- 💀 **I'm Broke Mode** — filters to budget-friendly meals only
- ❤️ **Favorites** — save meals with AsyncStorage persistence
- 📋 **Copy** — copy meal name to clipboard
- 🔗 **Share** — share your meal pick via the native share sheet

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React Native (Expo ~55) |
| Storage | AsyncStorage |
| Clipboard | expo-clipboard |
| Sharing | React Native Share API |
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
├── App.js                  # Entry point
├── app.json                # Expo config
├── src/
│   ├── data/
│   │   └── meals.js        # Local meal list (30 meals, categorised)
│   ├── components/
│   │   ├── MealCard.js     # Meal display card
│   │   ├── SuggestButton.js
│   │   └── CategoryTabs.js
│   └── screens/
│       └── HomeScreen.js   # Main screen
└── assets/
```

## Data Structure

```js
{
  id: 1,
  name: 'Jollof Rice',
  emoji: '🍚',
  category: 'Local',   // 'Local' | 'Fast Food' | 'Snacks'
  isBroke: false,      // true = budget-friendly
}
```
