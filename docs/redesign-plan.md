# Screen-by-Screen Redesign Plan

## 1) Splash Screen
- **UX Goal:** confirm app identity quickly, then hand off without friction.
- **Layout:** centered icon + brand + one-line value statement, balanced white space.
- **Typography/Color:** Display + bodyLarge roles, high-contrast inverse text.
- **States:** intro visible -> fade-out (success handoff).
- **Accessibility:** readable text contrast; no interactive control required.
- **Platform notes:** no platform divergence needed.

## 2) Home (Suggestion) Screen
- **UX Goal:** let users get a meal decision in 1–2 taps.
- **Layout:** clear top context, mode control, category chips, result card, secondary actions, primary CTA bottom.
- **Typography/Color:** display for task prompt, body/caption for metadata; primary color only for CTA/high-priority actions.
- **Interaction/microcopy:** explicit action labels ("Suggest meal", "Copy meal", "Share meal").
- **States:** default (no meal), loading (skeleton), error (retry card), success (meal card).
- **Accessibility:** 44pt touch minimum, labels/roles, readable contrast.
- **Platform notes:** safe area + keyboard avoiding behavior set for iOS/Android.

## 3) Favorites Screen (in-page mode)
- **UX Goal:** quickly reuse or remove saved meals.
- **Layout:** search field at top, list cards grouped consistently, final CTA for random favorite suggestion.
- **Typography/Color:** bodyLarge for item title, caption for category.
- **Interaction/microcopy:** direct verbs ("Use", "Remove", "Suggest from favorites").
- **States:** empty (icon + copy + CTA), filtered results, loading during suggestion.
- **Accessibility:** inline form error, labeled controls, touch area compliance.
- **Platform notes:** scroll + safe area and keyboard-friendly behavior.
