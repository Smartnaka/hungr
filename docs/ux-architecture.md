# UX Architecture — hungr

> **Document type:** UX Specification / Information Architecture  
> **App:** hungr — instant meal decision app  
> **Platform:** Mobile (iOS & Android) — React Native (Expo)  
> **Version:** 1.0  

---

## Table of Contents

1. [Product Context](#1-product-context)
2. [Information Architecture](#2-information-architecture)
3. [User Flows](#3-user-flows)
4. [Screen-by-Screen Breakdown](#4-screen-by-screen-breakdown)
5. [Microcopy](#5-microcopy)
6. [Error States](#6-error-states)
7. [Empty States](#7-empty-states)
8. [Loading & Transition States](#8-loading--transition-states)
9. [Structural Recommendations](#9-structural-recommendations)

---

## 1. Product Context

| Attribute | Value |
|---|---|
| **Product name** | hungr |
| **Product type** | Mobile app (iOS + Android) |
| **Industry** | Consumer lifestyle / Food |
| **Target users** | Everyday users aged 18–40 who feel decision fatigue around meals — students, young professionals, families. Low-to-medium tech literacy. Primarily Nigerian market. |
| **Core problem** | Users waste time and energy deciding what to eat. hungr eliminates that friction by surfacing a random meal decision instantly. |
| **Key user actions** | 1. Get a random meal suggestion · 2. Filter by food category · 3. Toggle budget ("broke") mode · 4. Save and manage favourite meals · 5. Share or copy a suggested meal |
| **Inspiration** | Swipefood, random number generators, decision-fatigue research |

---

## 2. Information Architecture

### 2.1 Full Sitemap

```
hungr
├── Splash Screen                       (entry / brand identity)
│
├── [TAB] Suggest                       (primary screen)
│   ├── Budget Mode Toggle
│   ├── Category Filter Chips           (All · Local · Fast Food · Snacks)
│   ├── Meal Card
│   │   ├── Empty state (no meal yet)
│   │   ├── Skeleton loading state
│   │   ├── Error / retry state
│   │   └── Meal result (emoji · name · category · save action)
│   └── Action Row                      (Copy · Share — visible after suggestion)
│
├── [TAB] Favourites
│   ├── Search bar
│   ├── Favourites list
│   │   ├── Empty state (no favourites saved)
│   │   ├── Zero-result search state
│   │   └── Meal item (emoji · name · category · Use · Remove)
│   └── Suggest from favourites CTA
│
└── [TAB] Settings
    ├── Preferences
    │   ├── Budget mode default toggle
    │   └── Default category selector
    ├── About
    │   ├── App version
    │   └── Tagline / description
    └── Feedback / Support link (future)
```

### 2.2 Navigation Structure

**Chosen pattern: Bottom Tab Bar (3 tabs)**

| Reason | Detail |
|---|---|
| App has exactly 3 top-level sections | The ui-guidelines rule: 3–5 main screens → Tab Bar |
| Mobile-first, thumb-friendly | Bottom tabs are reachable with one thumb on any phone size |
| Always visible | Users can switch context instantly without back-navigation |
| iOS & Android standard | Matches platform conventions (iOS HIG, Material 3) |

**Tab definitions:**

| Tab | Icon | Label | Badge |
|---|---|---|---|
| Suggest | 🍽️ (fork-knife) | Suggest | None |
| Favourites | ❤️ (heart) | Favourites | Count badge when > 0 |
| Settings | ⚙️ (cog) | Settings | None |

---

## 3. User Flows

### 3.1 First Launch / Splash → Suggest

```
App opens
    │
    ▼
Splash Screen (1.8 s)
    │  [auto-dismiss after animation]
    ▼
Suggest Tab (default)
    │  [no meal selected yet → empty state card]
    ▼
User taps "Suggest meal"
    │
    ├── [7 % chance] System error
    │       └──> Error card with "Try again" CTA
    │
    └── [93 % success] Meal card appears
            ├── User taps ❤️ Save → meal added to Favourites
            ├── User taps "Copy meal" → clipboard toast
            ├── User taps "Share meal" → native share sheet
            └── User taps "Suggest meal" again → new random meal
```

### 3.2 Budget Mode Flow

```
Suggest Tab
    │
    ▼
User taps "Turn on budget mode" button
    │  [button turns active / primary style]
    ▼
Meal pool filtered to isBroke meals only
    │
    ▼
User taps "Suggest meal"
    │
    ├── [category has no budget meals]
    │       └──> Toast: "No budget meals in [category]. Showing All instead."
    │               └──> Category resets to All
    │
    └── Budget meal suggested (lower-cost options only)
            └── User taps "Budget mode on" again to deactivate
```

### 3.3 Category Filter Flow

```
Suggest Tab — category chips visible (All · Local · Fast Food · Snacks)
    │
    ▼
User taps a category chip (e.g. "Local")
    │  [chip turns active/orange, meal card clears]
    ▼
User taps "Suggest meal"
    │
    ├── [no meals in category + broke mode combination]
    │       └──> Toast → reset to All
    │
    └── Meal from selected category shown
```

### 3.4 Favourites Management Flow

```
User on Suggest Tab, meal card visible
    │
    ▼
User taps ❤️ "Save" on meal card
    │  [icon fills to heart, label changes to "Saved"]
    ▼
User taps Favourites tab
    │
    ├── [First time — 0 favourites] → Empty state + "Go suggest a meal" CTA
    │
    └── [Favourites exist] → List of saved meals
            ├── User types in Search bar
            │       ├── [< 2 chars] → Inline error: "Enter at least 2 letters to search."
            │       └── [≥ 2 chars] → Filtered list (or zero-result empty state)
            ├── User taps "Use meal" → navigates to Suggest tab, meal pre-selected
            ├── User taps "Remove" → meal removed from list
            └── User taps "Suggest from favourites" → random favourite shown on Suggest tab
```

### 3.5 Settings Flow

```
User taps Settings tab
    │
    ▼
Settings Screen
    ├── Budget mode default toggle
    │       └── On → HomeScreen starts in budget mode on next launch
    ├── Default category selector
    │       └── Selected → HomeScreen starts on that category
    └── About section (read-only)
```

### 3.6 Error Recovery Flow

```
User taps "Suggest meal"
    │
    ▼
[Random 7 % failure simulated]
    │
    ▼
Error card shown: "We couldn't load a suggestion"
    │
    ▼
User taps "Try again"
    │
    ├── [Success] → Meal card appears
    └── [Failure again] → Error card re-shown (same state)
```

---

## 4. Screen-by-Screen Breakdown

### 4.1 Splash Screen

| Attribute | Detail |
|---|---|
| **Purpose** | Brand recognition; brief intro before app load |
| **Key UI elements** | 🍽️ emoji icon · "hungr" brand name · tagline · full-screen branded background |
| **Primary action** | Automatic dismiss (after 1.8 s fade) |
| **Secondary actions** | None |
| **Navigation** | Auto-transitions to Suggest Tab |

---

### 4.2 Suggest Screen (Home / Tab 1)

| Attribute | Detail |
|---|---|
| **Purpose** | The core screen — give users a meal suggestion in 1–2 taps |
| **Key UI elements** | App name header · Budget mode toggle button · Category filter chips · Meal card area (empty/loading/error/success) · Copy & Share action row · "Suggest meal" CTA sticky at bottom |
| **Primary action** | "Suggest meal" — large primary CTA at bottom |
| **Secondary actions** | Toggle budget mode · Select category · Copy meal · Share meal · Save/unsave meal |
| **Navigation** | Tab bar at bottom |

---

### 4.3 Favourites Screen (Tab 2)

| Attribute | Detail |
|---|---|
| **Purpose** | Browse, manage, and re-use saved meals |
| **Key UI elements** | Screen title · Search input field · Favourites list (meal item cards) · "Suggest from favourites" CTA at bottom |
| **Primary action** | "Suggest from favourites" — picks a random saved meal and navigates to Suggest tab |
| **Secondary actions** | Search · "Use meal" (navigate to Suggest, pre-load meal) · "Remove" (delete from list) |
| **Navigation** | Tab bar at bottom |

---

### 4.4 Settings Screen (Tab 3)

| Attribute | Detail |
|---|---|
| **Purpose** | Personalise the app behaviour; access app info |
| **Key UI elements** | Screen title · Preferences section (budget mode toggle, default category) · About section (version, tagline) |
| **Primary action** | Toggle budget mode default |
| **Secondary actions** | Select default category |
| **Navigation** | Tab bar at bottom |

---

## 5. Microcopy

### 5.1 Splash Screen

| Element | Copy |
|---|---|
| Brand name | **hungr** |
| Tagline | Decide your next meal in seconds |

---

### 5.2 Suggest Screen

| Element | Copy |
|---|---|
| App name (header) | **hungr** |
| Header subtitle | Fast, low-friction meal decisions |
| Screen title / prompt | What should I eat today? |
| Budget mode button (off) | Turn on budget mode |
| Budget mode button (on) | Budget mode on |
| Category chips | All · Local · Fast Food · Snacks |
| Primary CTA (normal mode) | Suggest meal |
| Primary CTA (budget mode) | Suggest budget meal |
| Copy action button | Copy meal |
| Share action button | Share meal |
| Save to favourites label (unsaved) | Save |
| Save to favourites label (saved) | Saved |
| Toast — copied | Copied [Meal Name]. |
| Toast — category fallback | No [budget ]meals in that category. Showing All instead. |

---

### 5.3 Favourites Screen

| Element | Copy |
|---|---|
| Screen title | Favourites |
| Search field label | Search favourites |
| Search field placeholder | Search by meal name |
| Search validation error | Enter at least 2 letters to search. |
| "Use meal" button | Use meal |
| "Remove" button | Remove |
| Primary CTA | Suggest from favourites |
| Loading CTA label | (spinner — no text) |

---

### 5.4 Settings Screen

| Element | Copy |
|---|---|
| Screen title | Settings |
| Section header — preferences | Preferences |
| Budget mode toggle label | Budget mode default |
| Budget mode toggle hint | When on, the app always starts in budget mode. |
| Default category label | Default category |
| Default category hint | The category filter that loads when you open the app. |
| Section header — about | About |
| App name | hungr |
| App tagline | Decide your next meal in seconds |
| Version label | Version [x.x.x] |

---

## 6. Error States

### 6.1 Suggest Screen — System / Suggestion Error

| Attribute | Detail |
|---|---|
| **Scenario** | Random suggestion engine fails (network or system fault) |
| **Error headline** | We couldn't load a suggestion |
| **Error body** | Something went wrong. Try again to reload your meal options. |
| **Recovery CTA** | Try again |
| **Visual** | Error card inside the meal card area; 📡 icon |

---

### 6.2 Favourites Screen — Search Validation Error

| Attribute | Detail |
|---|---|
| **Scenario** | User types only 1 character in the search field |
| **Error headline** | (no headline — inline field error) |
| **Error body** | Enter at least 2 letters to search. |
| **Recovery** | User types a second character (auto-clears) |
| **Visual** | Red border on input field; error caption below |

---

### 6.3 Storage / Persistence Error

| Attribute | Detail |
|---|---|
| **Scenario** | AsyncStorage read/write fails silently |
| **Handling** | Fails silently — app continues with in-memory state; favourites/settings may not persist but no crash |
| **User-visible impact** | Settings reset on next launch (acceptable degradation) |

---

### 6.4 Share Sheet Dismissed

| Attribute | Detail |
|---|---|
| **Scenario** | User opens native share sheet then cancels |
| **Handling** | Silent — no error shown; share sheet simply closes |
| **Recovery CTA** | N/A |

---

### 6.5 Empty Favourites — Suggest from Favourites

| Attribute | Detail |
|---|---|
| **Scenario** | User somehow taps "Suggest from favourites" with 0 items |
| **Handling** | Button hidden when list is empty (prevented at UI layer) |

---

## 7. Empty States

### 7.1 Suggest Screen — No Meal Selected Yet

| Attribute | Detail |
|---|---|
| **When shown** | First open, or after category change resets meal |
| **Illustration** | 🍽️ fork-and-knife emoji |
| **Headline** | No meal selected yet |
| **Body** | Tap suggest meal to get a recommendation based on your filters. |
| **CTA** | (none — primary CTA at bottom serves as the action) |

---

### 7.2 Favourites Screen — No Favourites Saved

| Attribute | Detail |
|---|---|
| **When shown** | First-time user, or after all favourites removed |
| **Illustration** | 🫙 jar emoji (empty container metaphor) |
| **Headline** | No favourites yet |
| **Body** | Save meals from the suggestion card so you can pick from them faster next time. |
| **CTA** | Go suggest a meal (navigates to Suggest tab) |

---

### 7.3 Favourites Screen — Zero Search Results

| Attribute | Detail |
|---|---|
| **When shown** | Search query matches 0 saved meals |
| **Illustration** | 🔍 magnifier emoji |
| **Headline** | No matches found |
| **Body** | No saved meals match "[query]". Try a different search. |
| **CTA** | Clear search |

---

## 8. Loading & Transition States

### 8.1 Splash Screen — Intro Animation

| State | Description |
|---|---|
| **Entry** | Screen fades in over 260 ms |
| **Hold** | Content visible for ~1.3 s |
| **Exit** | Full screen fades out over 260 ms, then auto-navigates |
| **Copy** | None (visual only) |

---

### 8.2 Suggest Screen — Skeleton Loader

| State | Description |
|---|---|
| **Trigger** | User taps "Suggest meal" |
| **Visual** | Pulsing skeleton card: circular placeholder for emoji, two bar placeholders for name & category, one bar for action |
| **Duration** | 280 ms artificial delay (UX breathing room) + processing |
| **Copy** | None — accessible label: "Loading content" |
| **Transition out** | Skeleton replaced by meal card or error card |

---

### 8.3 Suggest Screen — Suggest from Favourites Loading

| State | Description |
|---|---|
| **Trigger** | User taps "Suggest from favourites" on Favourites tab |
| **Visual** | Primary button shows spinner (ActivityIndicator) in place of label |
| **Copy** | (no label — spinner only) |
| **Transition out** | Button restores; Suggest tab becomes active with new meal |

---

### 8.4 Success Toasts

| Action | Toast copy | Duration |
|---|---|---|
| Copy meal | Copied [Meal Name]. | 2–3 s auto-dismiss |
| Category fallback | No [budget ]meals in that category. Showing All instead. | 2–3 s auto-dismiss |

---

### 8.5 OTA Update Banner

| State | Description |
|---|---|
| **Trigger** | App just applied an OTA update and relaunched |
| **Visual** | Bottom-anchored banner strip (success green background) |
| **Copy** | App updated successfully. |
| **Duration** | 3.5 s auto-dismiss |

---

## 9. Structural Recommendations

### 9.1 Navigation Pattern

**Recommendation: 3-tab bottom bar (Suggest · Favourites · Settings)**

- Matches the 3–5 screen rule from the ui-guidelines (Section 15.1).
- All three sections are co-equal in importance — not hierarchically related.
- Bottom placement makes all tabs thumb-accessible on any device.
- Persistent tab bar gives instant context-switching without back navigation.

---

### 9.2 Screens That May Cause Drop-Off or Confusion

| Screen / Element | Risk | Recommendation |
|---|---|---|
| Budget mode toggle (secondary button) | Users may not understand what "budget mode" does | Add a brief tooltip or helper text on first use |
| Suggest screen — no meal yet (empty card) | Users may not immediately see the "Suggest meal" CTA at the bottom if the screen is short | Ensure CTA is always sticky at bottom regardless of scroll position |
| Favourites — search validation error | Appearing too early (1 char) may feel punishing | Show error only after a short debounce (500 ms) or on blur |
| Category tabs with count badges | Count "0" for a category in broke mode may confuse users | Dim or hide tabs with 0 results in broke mode |

---

### 9.3 Flows That Could Be Simplified

| Current flow | Simplification opportunity |
|---|---|
| Header toggle button (Suggest ↔ Favourites) | Removed in favour of tab bar — eliminates non-standard navigation |
| Budget mode as in-session state only | Promote to a persistent setting (saved to AsyncStorage); first-time users won't need to re-enable it every session |
| Default category always resets to "All" | Let users set a preferred default category in Settings |

---

### 9.4 Progressive Disclosure Opportunities

| Location | What to disclose progressively |
|---|---|
| Budget mode button | First-time: show a one-line helper text under the button ("Shows lower-cost meals only"). Dismiss after first use. |
| Favourites screen | Show "Suggest from favourites" CTA only when ≥ 1 favourite exists |
| Settings screen | Show "Default category" selector only after the user has used the app at least once (future iteration) |

---

### 9.5 Accessibility Considerations Per Screen

| Screen | Consideration |
|---|---|
| All screens | Minimum 44×44 pt touch targets on every interactive control (ref: ui-guidelines Section 17.1) |
| All screens | Text contrast ratio ≥ 4.5:1 (WCAG AA) for body text; ≥ 3:1 for large/bold text |
| Splash Screen | No interactive controls — purely visual; ensure readable contrast on the branded background |
| Suggest Screen | `accessibilityRole="button"` on all Pressable controls; dynamic `accessibilityLabel` on heart icon ("Save to favourites" / "Remove from favourites") |
| Suggest Screen | Skeleton loader announces "Loading content" via `accessibilityLabel` |
| Suggest Screen | Toast messages use `accessibilityLiveRegion="polite"` to be announced by screen readers |
| Favourites Screen | Search field has explicit `accessibilityLabel`; inline error text is programmatically associated |
| Favourites Screen | Swipe-to-remove or button-based remove: always provide explicit label ("Remove [meal name] from favourites") |
| Settings Screen | Toggle switches must expose current state via `accessibilityState={{ checked: value }}` |
| Tab Bar | Each tab has a clear `accessibilityLabel` and `accessibilityRole="tab"`; active tab communicates `accessibilityState={{ selected: true }}` |

---

*Document generated: 2026-04 · hungr v1.0 · maintainer: Smartnaka*
