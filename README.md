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
| Framework | React Native (Expo ~51) |
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
