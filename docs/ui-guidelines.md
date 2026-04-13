# UI DESIGN PRINCIPLES
### Mobile App Reference Guide

*Based on UI Design Principles by Michael Filipiuk*  
*Compiled for Android & iOS Development*

> **How to use this document**  
> Reference this guide whenever you're designing or reviewing a mobile app UI. Each section maps directly to a design decision you will face — from layout and typography to navigation and microinteractions. Both Android (Material) and iOS (HIG) contexts are noted where relevant.

---

## 1. Core UI/UX Design Mindset

### 1.1 The Golden Rule: Usable First, Beautiful Second

Users don't care how pretty your design is — they care about completing tasks with minimal effort. Great design is 'invisible': it doesn't catch attention, it redirects attention to the app's purpose.

> **The Salt Analogy**  
> Users notice bad design, but most will never notice great design. Like salt in food — you notice when it's missing, not when it's right. The same applies to UI. Design for the user's task, not for your portfolio.

- **Usability is the #1 priority.** An unusable beautiful app will lose to a simple but functional one.
- **Delightfulness matters too.** After usability, the interface must be enjoyable — otherwise users switch to competitors.
- **Never design based on personal preference.** Design decisions must be based on the target audience and brand research.
- **Aim for 'invisible' design.** Non-intrusive UI that redirects focus to the app's core purpose.

### 1.2 UI vs UX

UI Design = visual elements and how they look. UX Design = the overall experience (emotions, satisfaction, frustration). They are inseparable — a bad UI directly creates bad UX. As a mobile developer, your UI decisions always impact UX.

### 1.3 The Design Mindset Checklist

- Understand the problem before designing anything.
- Research the target audience — their age, tech literacy, expectations.
- Start with black and white wireframes, add color last.
- Make decisions based on data, not aesthetics.
- Consistency throughout the product is non-negotiable.

---

## 2. Visual Hierarchy & Perception Principles

Visual hierarchy determines what users look at first. By controlling it, you guide the user's eye to the most important content. The following Gestalt-derived principles govern how users perceive mobile UIs.

### 2.1 The Five Hierarchy Tools

| Tool | How It Works | Mobile Application |
|---|---|---|
| **Size** | Larger = more important. Users read bigger text first. | Use large headings for screen titles, smaller text for subtitles/body. |
| **Color** | Bold colors draw attention; light/neutral colors recede. | Primary color for CTA buttons only. When everything is bold, nothing stands out. |
| **Position** | Top-left read first (LTR cultures). Top = more important. | Most important info at top of screen. Primary action button at the bottom-right. |
| **Proximity** | Close elements = related. Far elements = unrelated. | Group label + input + error message together. Use spacing to separate form sections. |
| **Common Region** | Elements inside a closed region = same group. | Cards with a border/background enclose related info. Crucial for list screens. |

> **Figure-Ground Principle**  
> Users instantly categorize UI into foreground (interactive) and background. Backgrounds should use soft, light colors. Using a strong bold color or image as a background without an overlay causes confusion — users won't know what's clickable.

---

## 3. Grid & Layout for Mobile Apps

Grids are the foundation of consistent, professional mobile UI. Without a grid, spacing becomes arbitrary and the interface looks amateurish. For mobile, skip complex column grids — instead use margins + a soft spacing scale.

### 3.1 Mobile Grid Setup (2 Steps)

#### Step 1: Set Screen Margins
Margins = the 'safe space' — no content should ever touch screen edges.

- **Recommended: 20pt or 24pt** (standard for Android & iOS)
- Smaller margins = more screen space but a cramped feel. Larger margins = more breathing room but less content.
- iOS Safe Areas: Also account for the notch, Dynamic Island, and home indicator. Use SafeAreaView in React Native.

#### Step 2: Create a 4pt Soft Grid (Spacing Scale)

The 4pt grid means ALL spacing values (padding, margins between elements, gap between sections) must be multiples of 4.

**4pt Spacing Scale:**  
`4 · 8 · 12 · 16 · 20 · 24 · 28 · 32 · 40 · 48 · 56 · 64pt`  
*Only use values from this scale for all spacing in your app.*

- **4pt:** tiny gaps (icon-to-label, badge padding)
- **8pt:** default inner padding for small components
- **16pt:** standard card padding, list item spacing
- **24pt:** section spacing, screen margins
- **32–48pt:** large section gaps, hero area padding

### 3.2 Rules for Mobile Layouts

- Never place content in the margin area.
- Text should never touch screen edges. Ever.
- Column grids for mobile: max 2 columns (e.g., grid of cards), sometimes 4.
- Use fixed-width layouts for forms — do not stretch form fields to full width on large screens.
- Align text to its baseline, not center, when mixing font sizes in a row.

> **React Native Tip**  
> Use consistent spacing variables in a theme file (e.g., spacing.md = 16, spacing.lg = 24). Map these to your 4pt grid. Never hardcode arbitrary values like 13, 17, or 22 — they break consistency.

---

## 4. Typography

Typography is one of the most impactful design decisions you'll make. Poor typography makes an app feel cheap and hard to use, even if everything else looks good.

### 4.1 Typeface Selection Rules

- **Use Sans-Serif typefaces as the primary.** They are legible at all sizes, modern, and work for any mobile audience.
- **Serif fonts** are acceptable for long-form reading apps (articles, books) but rarely used in general mobile apps.
- **Never use Script or Handwritten fonts** as primary typefaces — they are unreadable at small sizes.
- **Stick to 1 typeface** in most apps. Adding a second typeface increases complexity without meaningful benefit.
- **Choose a typeface with 4+ weights** (Light, Regular, Medium, SemiBold, Bold) to build a hierarchy.
- **Pick a scalable typeface** — readable at 10pt and good-looking at 40pt.
- **Match typeface to brand personality:** rounded Sans-Serifs = friendly/modern; Serifs = trustworthy/formal.

> **Recommended Typefaces for Mobile**  
> Inter, Roboto (Android default), SF Pro (iOS default), Poppins, Plus Jakarta Sans. These are all available on Google Fonts and are highly legible on mobile screens.

### 4.2 Building a Type Scale

A type scale is a fixed set of font sizes used throughout your app. Never use arbitrary sizes — pick from your scale only.

| Name | Size | Weight | Use Case |
|---|---|---|---|
| **Display** | 32pt+ | Bold / ExtraBold | Hero titles, onboarding headers |
| **H1** | 28–30pt | Bold | Screen titles |
| **H2** | 22–24pt | SemiBold | Section headers |
| **H3** | 18–20pt | SemiBold | Card titles, list headers |
| **Body Large** | 16–17pt | Regular / Medium | Main body text, input fields |
| **Body** | 14–15pt | Regular | Secondary text, descriptions |
| **Caption** | 12pt | Regular | Timestamps, metadata |
| **Micro** | 10–11pt | Regular | Badges, legal text (minimum) |

### 4.3 Key Typography Rules

- **Minimum body text: 16pt** (Apple recommends 16pt, Google recommends 17pt for Android). Never go below 10pt for any UI text.
- **Line height rule:** multiply font size by 1.6 for body text. For headers (18pt+), use 1.2–1.3. Round to nearest whole number.
- **Line length:** optimal 50–60 characters per line. Too wide = hard to read.
- **Letter spacing:** default (0%) is fine for body. Decrease slightly for large headers (-2% to -3%). Increase for ALL-CAPS text (+3–5%).
- **Text alignment:** Left-align body text always. Center-align only for short text (buttons, empty states). Never center long paragraphs.
- **Font weight for hierarchy:** skip weights when pairing (Bold header + Regular body, not Medium header + Regular body).
- **Never use Light weight for small text** — it becomes unreadable on AMOLED screens.
- No Lorem Ipsum — use realistic placeholder text. It gives you a much better feel for how the UI will actually look.

---

## 5. Color

Color is the most emotionally powerful tool in UI design. Every color decision affects how users feel about your app — trust, energy, safety, playfulness. Choose colors based on psychology and brand, not personal preference.

### 5.1 Color Psychology Reference

| Color | Evokes | Best For | Avoid For |
|---|---|---|---|
| **Blue** | Trust, security, calm | Finance, social, health, productivity | Energy products, nightlife |
| **Red** | Energy, urgency, danger | Sports, media, urgent actions (errors) | Banking, healthcare primary color |
| **Yellow** | Warmth, excitement, attention | Food, travel, creative tools | Background colors — hard on eyes |
| **Orange** | Creativity, enthusiasm | Sales, sports, productivity | Primary when green is also used (overlap) |
| **Green** | Health, growth, success | Health, fitness, finance, food | Primary when red is used for errors |
| **Purple** | Luxury, mystery, innovation | Premium products, tech | Budget products, mass-market apps |

### 5.2 Building a Complete Color Palette (8-Step Process)

1. Choose your Primary Color (based on color psychology and brand target audience).
2. Choose a Secondary Color if needed (optional, use the color wheel for pairing).
3. Set Notification Colors: Green = success, Orange = warning, Red = error. If your primary color overlaps, use a slightly different hue.
4. Create Tints: Increase Lightness by 10% increments. Use for backgrounds, card surfaces, light button variants.
5. Create Shades: Decrease Lightness by 10% increments. Use for text, dark borders, pressed states.
6. Create a Grayscale: Start from (Primary Hue, Saturation: 20, Lightness: 10) and increase Lightness by 10% up to white. Use for body text, borders, disabled states, backgrounds.
7. Assign use cases: Primary color → buttons, checkboxes, focused inputs. Darkest gray → headings. Mid gray → body text. Lightest gray → backgrounds.
8. Save all colors as design tokens / theme variables before building the app.

### 5.3 Critical Color Rules

- **WCAG Accessibility:** ensure text on background has sufficient contrast. Use WCAG AA minimum (ratio 4.5:1 for normal text, 3:1 for large text). Test with tools like Contrast Checker.
- **~4.5% of people are color-blind.** Never rely on color alone to convey state — always add icons or text labels.
- **Never use pure black (#000000)** for text — too harsh. Use a dark gray like #1F1F1F or #121212.
- **Monochromatic palettes are easiest to apply** and look professional. Use tints and shades of your primary color as the foundation.
- Start with black/white/gray wireframes before applying any color.

### 5.4 Gradients

- Use gradients to add depth and realism. Linear gradients are most common.
- For smooth gradients, use colors with similar hues — avoid harsh transitions that create gray midpoints.
- Best technique: start with the same hue on both sides, then shift the Hue value by 20–30 degrees on one end.
- Colorful shadows paired with gradient elements look stunning but use sparingly.
- Avoid too many gradients on one screen — cognitive overload. When everything stands out, nothing does.

---

## 6. Shadows

Shadows communicate elevation. They tell users what is interactive (elevated) vs. static (flat). Correct shadow usage dramatically improves the perceived quality of an app.

### 6.1 Drop Shadow Anatomy

Every shadow has 4 properties: X (horizontal offset), Y (vertical offset), Blur (softness), and Opacity.

### 6.2 Shadow Best Practices

- **Soft shadows = more realistic.** High blur + low opacity (5–10%). Example: X:0, Y:16, Blur:40, Opacity: 8%.
- **Never use pure black (#000000) for shadow color.** Use a dark shade from your grayscale (e.g., #3D4B5C).
- **Try colorful shadows on colored elements** (buttons, cards). Use a darker shade of the element's color as the shadow.
- **Only shadow interactive elements:** buttons, cards, bottom sheets, modals. Don't add shadows to static text or disabled buttons.
- **Dark Mode:** don't flip shadows to white. Instead, use a slightly lighter shade of the background for elevation.
- Drop shadows on button text improve contrast when button background is bright and text is white.

---

## 7. Buttons

Buttons are the primary interaction mechanism in mobile apps. Poor button design kills conversion and usability.

### 7.1 Button Types & When to Use Them

| Button Type | When to Use | Styling |
|---|---|---|
| **CTA (Call-to-Action)** | Landing screens, onboarding, sign up prompts. Highest priority action on screen. | Filled, Primary color, full-width on mobile, 40–60pt height |
| **Primary** | Main form submission, navigation forward. 'Next Step', 'Save', 'Download'. | Filled, Primary color, full-width on mobile |
| **Secondary** | 'Back', 'Cancel'. Necessary but not encouraged. | Line style or transparent/ghost style |
| **Tertiary** | Rare actions — 'Share Article', 'Add to Favourites'. | Smaller, text link or outlined, low prominence |

### 7.2 Button Design Rules

- **Minimum tap target on mobile: 44×44pt** (Apple HIG and Android Material both require this). Even if the visible button is smaller, the tappable area must be at least 44×44pt.
- **Height: 48–56pt is the mobile sweet spot.** Never go below 40pt. Never above 60pt for standard buttons.
- **Width on mobile: full screen width** (minus margins). This is standard for iOS and Android primary CTAs.
- **Font size inside buttons: 16pt.** Nothing below 13pt; nothing over 20pt.
- **Corner radius: more rounded = more friendly.** 0pt = sharp/professional. 8pt = modern. Full pill (24pt+) = casual/playful.
- **Be consistent:** use the same corner radius for all buttons in the app.
- **Button states to always design:** Default, Hover/Pressed, Loading, Disabled. Disabled buttons should be visually de-emphasized (reduced opacity).
- **VIBs (Very Important Buttons):** For destructive or financial actions (Purchase, Delete Account), label the button explicitly: 'Complete Purchase', not just 'Continue'. Add confirmation text below.
- **Button pair positioning:** Primary button on the RIGHT (easier for right-handed thumb). Secondary button on the LEFT.
- Icons inside buttons make them faster to scan — use icons for commonly understood actions.

---

## 8. Forms

Forms are where users abandon your app. The goal of form design is to maximize completion rate. Every design choice should reduce friction.

### 8.1 Form Elements

- **Text Fields:** For single-line text input. Always show a label above the field — never rely only on placeholder text (placeholder disappears when user types).
- **Dropdowns:** Use for 5+ options. For 2–4 options, use radio buttons instead. Add a search bar inside dropdowns with 10+ items.
- **Radio Buttons:** For mutually exclusive choices (2–4 options). Size: 24pt, tap area: 44pt. Make text beside radio buttons tappable too.
- **Checkboxes:** For multiple-select choices. Same size rules as radio buttons.
- **Switches:** For binary on/off settings that take effect immediately (no 'Save' needed). Use in settings screens.
- **Sliders:** For numeric ranges where precision isn't critical. Pair with text fields for exact input when needed.

### 8.2 Form Best Practices

- **Keep forms short.** Remove any field that isn't absolutely necessary.
- **Single-column layout.** Never use multi-column form fields on mobile — users lose track of the order.
- **Break long forms into steps** with a progress indicator. 5+ fields = split into multiple screens.
- **Show field groupings:** extra spacing between semantic groups (personal info, payment info) reduces cognitive load.
- **Real-time validation:** validate immediately after a field loses focus — don't wait for form submission to show errors.
- **Offer social sign-in** (Apple ID, Google) whenever possible. It's the single biggest conversion booster for auth forms.
- **Design all states:** Inactive, Focused, Filled (success), Filled (error), Disabled. Each needs distinct visual treatment.
- **Error messages:** place inline below the field. Use red. Be specific — 'Password must be 8+ characters' not 'Invalid password'.
- **Label optional fields as (optional)** — don't use asterisks for required fields.
- **Explain sensitive fields:** if asking for phone number or address, add a small info icon with an explanation tooltip.
- Remind users why the form is valuable — especially for newsletter signups and account creation.

---

## 9. Icons

Icons replace text, making UIs faster to scan. But only if they're instantly recognizable. Complex or unfamiliar icons confuse users and break usability.

### 9.1 Icon Types

- **Clarifying Icons:** add context to labels (category icons, feature highlights). Not interactive.
- **Interactive Icons:** act as buttons — tapping them performs an action. Must have at minimum 44×44pt tap area on mobile.

### 9.2 Icon Design Rules

- **Simple always wins.** If you've never seen a successful app use a specific icon without a label, always add a label.
- **Use icon packs — not individual icons.** Mixing icons from different packs creates inconsistency in line weight, style, and detail level.
- **Consistent line width.** All icons in the same screen/app must share the same stroke weight.
- **Consistent roundness.** Sharp icons = professional. Rounded icons = friendly. Never mix.
- **Filled vs. Line icons:** use Filled for the currently selected tab bar item. Use Line for unselected tabs. Never mix other styles.
- **Scalable icons only.** Test every icon at small sizes (16pt, 20pt). Complex icons become blobs at small sizes.
- **All icons in a bounding box** — a fixed container (e.g., 24×24pt) that ensures consistent sizing and spacing.
- Pair icon line width with font weight of adjacent text for a polished, cohesive feel.

> **Recommended Free Icon Packs**  
> Feather Icons (feathericons.com) — free, clean, customizable stroke width. React Native Vector Icons — native icons for Android and iOS. Phosphor Icons, Heroicons, and Lucide are also excellent free options compatible with React Native via @expo/vector-icons.

---

## 10. Photos & Illustrations

### 10.1 Photos

- Use high-resolution images only — low-res photos destroy the perceived quality of the app.
- **Avoid stock-looking generic photos.** Authentic, candid images build trust. Photos of real people in real situations outperform posed stock photos every time.
- **Text on photos: always use an overlay.** A semi-transparent dark (or colored) gradient ensures text remains readable regardless of the photo.
- **Use images with a clear focal point.** One clear subject = user knows exactly what to look at.
- **Images of people looking in a direction guide user attention** in that direction. Use this to point users toward CTAs or forms.
- Compress images before shipping. Provide multiple resolutions (1x, 2x, 3x) for different screen densities.
- **Image aspect ratios:** test your images across at least 1:1, 4:3, 16:9, and 4:5.
- **Free sources:** unsplash.com (preferred), pexels.com, gratisography.com

### 10.2 Illustrations

- **Use illustrations for:** onboarding screens, empty states, 404 pages, achievements, abstract concepts that can't be shown in photos.
- **Don't use illustrations for real products** — users buying something want to see the actual product in a photo.
- Use consistent illustration styles throughout the app — do not mix illustration packs or visual styles.
- Illustrations should not be too small — all details must be visible. If it's too complex at the required size, use a simpler illustration or an icon instead.
- **Free illustration sources:** storyset.com (editable, animated), icons8.com/ouch, streamlineicons.com

---

## 11. Cards

Cards group related information about a single subject into a scannable container. They're the backbone of list screens in mobile apps.

### 11.1 Card Design Rules

- **Think of a card as a short version of a detail page.** Include only the info needed to make a decision about whether to open it.
- **Cards must look clickable.** Add a subtle drop shadow or border to elevate them from the background.
- Add a pressed/hover state — slightly scale or brighten the card on tap for immediate tactile feedback.
- **Design all card variants:** standard, compact (horizontal), and wide (full-width for featured items).
- **Handle edge cases:** Set max lines for titles (2 lines max). Define placeholder when no image is available. Test with very long text.
- **Three card style options:** White card with shadow (most common), Outlined card, Colored background card (dark mode or themed). Never mix styles in the same screen.

### 11.2 Card Anatomy

- Image / Illustration / Icon (top or leading)
- Title (2 lines max, truncate with '...' if longer)
- Subtitle or short description
- Metadata (price, time, rating, date)
- Action buttons or icon buttons (favorite, share, add to cart)

---

## 12. White Space (Negative Space)

White space is not 'wasted' space. It is designed space. It is one of the strongest indicators of design quality.

### 12.1 Why White Space Matters

- It creates focus — the fewer elements on screen, the more attention each one gets.
- It improves readability — elements need room to breathe.
- It signals quality and confidence — cluttered apps look untrustworthy.
- It establishes hierarchy — proper spacing between groups tells users what belongs together.

### 12.2 White Space Rules

- **Always start with too much white space** — then tighten. It's easier to reduce space than add it later.
- **Never fill white space just because it exists.** Empty space is intentional and valuable.
- Content should never touch the edges of the screen (enforce margins strictly).
- Increase spacing between sections compared to spacing within a section.
- **Removing background from product images** ('unboxing') adds white space and makes e-commerce screens cleaner.

> **White Space & Clients**  
> If a stakeholder asks you to 'fill that empty space' — show them examples from well-designed apps. Explain that filling space distracts from the primary content. If they insist, try abstract background shapes or a subtle gradient — not additional content blocks.

---

## 13. Design Personality & Brand Consistency

Before choosing any visual asset, define the personality of the product. This should guide every design decision — color, typeface, iconography, illustration style, language, and element roundness.

### 13.1 Personality Reference

| Personality | Colors | Typography | Elements |
|---|---|---|---|
| **Playful** | Vibrant, high saturation | Rounded Sans-Serifs | High corner radius, illustrations |
| **Serious / Formal** | Muted, low saturation | Serif or geometric Sans-Serif | Sharp corners, real photos |
| **Neutral / Modern** | Blue/teal dominant, grays | Clean Sans-Serif (Inter, Roboto) | Moderate radius, mix of photo/illustration |

Personality must be consistent across the entire app — mixing serif fonts with vibrant playful colors or formal language with cartoonish illustrations creates a confused, untrustworthy product.

---

## 14. Language & Microcopy

Microcopy is the text on buttons, dialogs, toasts, empty states, and error messages. Designers own this. Poor microcopy is one of the most common and easily fixable UX problems.

### 14.1 Button Text Rules

- Be specific: 'Add to Favorites' not 'Favorite'. 'Complete Purchase' not 'Continue'.
- Use verbs. Buttons describe an action. 'Save File', 'Delete Account', 'Send Message'.
- Don't be too verbose: 'Add to favorites' not 'Add this item to your favorites list'.

### 14.2 Dialog / Alert Rules

- **Avoid double negatives in confirmation dialogs.** 'Cancel' on a 'Cancel your subscription?' dialog is ambiguous. Use 'Keep Subscription' and 'Cancel Subscription' instead.
- **Name the thing being deleted:** 'Delete lecture_notes.pdf?' not just 'Delete this file?'.
- Be as human as possible. Avoid technical jargon in error messages.
- Suggest a solution in error messages: 'No internet connection. Try restarting Wi-Fi.' not 'Network error 503'.
- Use contractions (don't, that's, you're) to sound human — unless the app is formal/professional.

---

## 15. Navigation

If users can't find their way around your app, every other design decision is irrelevant. Navigation must be obvious, accessible, and consistent.

### 15.1 Navigation Types

| Type | Best For | Notes |
|---|---|---|
| **Tab Bar (Bottom Nav)** | 3–5 top-level sections, mobile apps | Best for mobile. Always visible. iOS and Android standard. |
| **Hamburger Sidebar** | 6–7+ top-level pages, complex apps | Harder to access (top corner). Saves screen space. |
| **Contextual (Links, Tags)** | In-content navigation (articles, tags) | Always present regardless of main nav type. |
| **Top Nav Bar (Web)** | Desktop-first or web app tabs | Not ideal for mobile — hard to reach at top. |

### 15.2 Tab Bar (Bottom Navigation) — Mobile Standard

- Position: always at the BOTTOM of the screen on mobile.
- **Height: 60–84pt.** Add extra height for iPhones with home indicator (no physical home button).
- **Number of tabs: 3–5.** Never fewer than 3, never more than 5.
- Selected tab: use filled icon + color. Unselected: line icon + reduced opacity (30–40%).
- Labels: use labels for ALL tabs or for NONE. Never mix labeled and unlabeled tabs.
- Distribute tab icons equally across the full screen width.
- **iOS-specific:** account for the safe area inset at the bottom. Add at least 24pt padding above the home indicator.

### 15.3 Sidebar (Hamburger Menu)

- Width: 70–80% of screen width on mobile.
- Add a dark overlay (60–70% opacity) behind the sidebar on the content area.
- Tapping outside the sidebar closes it. An X button is optional but not required.
- Space items using your soft grid — do not spread them evenly to fill the full height.
- Can include extra elements: user avatar, account name, logout button, version number.

> **Which Navigation to Choose**  
> 5 or fewer main screens = Tab Bar. 6–7 screens = consider Sidebar. More than 7 items in main navigation = users will experience cognitive overload. Redesign the IA first.

---

## 16. Microinteractions & Animations

Microinteractions are small animations triggered by user actions. They transform a functional app into a delightful app — the difference between 'it works' and 'I love using this'.

### 16.1 Why They Matter

- They confirm user actions ('Did that button do something?').
- They provide feedback for state changes (loading, success, error).
- They make the app feel alive and responsive — not static and dead.

### 16.2 Microinteraction Rules

- **Duration: under 300ms for UI feedback.** 300–500ms for transitions. Never exceed 1000ms for any interaction. Long animations make apps feel slow.
- **Use Ease Out for most transitions:** fast start, slow end. Objects coming into view feel natural. (Ease In for exiting elements.)
- **Linear animations look mechanical** — avoid for UI transitions. Use Ease or Spring physics instead.
- **Never build animations just to look impressive.** Every animation must have a functional purpose: confirm action, show transition, indicate state.
- **Fancy 3D animations from Dribbble are not for production** — they're too slow to load and implement.

### 16.3 Essential Microinteractions to Design

- Button pressed state — scale down slightly or change color on tap.
- Tab bar icon switch — smooth icon fill transition when switching tabs.
- Form field focus — border changes color/weight when field is focused.
- Toggle/Switch — smooth slide with color change.
- Checkbox — fill animation on selection.
- Pull-to-refresh — loading spinner or custom animation.
- Toast/Snackbar — slide in from bottom, auto-dismiss.
- Skeleton loading — pulsing gray placeholders before content loads (vastly better than spinners for list screens).

> **React Native Animation Tools**  
> Use Reanimated 2 (react-native-reanimated) for smooth 60fps animations on the UI thread. For simple transitions, React Native's Animated API is fine. Lottie (lottie-react-native) for pre-built complex animations. Moti for declarative spring-based animations.

---

## 17. Accessibility & Usability Best Practices

### 17.1 Touch Target Sizes

- **Minimum tap target: 44×44pt** on both iOS and Android. This is not negotiable — it's in both Apple's HIG and Google's Material Design.
- The visual element can be smaller but the tappable area must be at least 44×44pt.
- For icon-only buttons, use hitSlop in React Native to extend the touch area without changing the visual size.

### 17.2 Color & Contrast

- **WCAG AA minimum: 4.5:1 contrast ratio** for normal text, 3:1 for large text (18pt+ or 14pt bold+).
- Never rely on color alone to communicate state — add icons, labels, or patterns.
- 4.5% of people are color blind — design and test for it. Use tools like Stark or Accessible Colors.

### 17.3 Typography for Accessibility

- Minimum body font size: 16pt. Support Dynamic Type (iOS) and font scaling (Android).
- Support system font size adjustments — test your layout at maximum font size. Overflow text is a common accessibility bug.
- Avoid light font weights (Thin, ExtraLight) for text below 18pt.

### 17.4 Screen Reader Support

- Every interactive element must have an accessibility label.
- Group related elements with accessibility containers.
- Provide meaningful alt text for images.
- Announce state changes to screen readers (form errors, loading completion).

### 17.5 Interaction Accessibility

- Forms must use the correct keyboard type for each input (numeric, email, phone, etc.).
- Autofill should be enabled for common fields (email, password, name, address).
- Back navigation must always be accessible (hardware back button on Android, swipe-back on iOS).
- Error recovery must be possible without losing user-entered data.

---

## 18. Common Mobile UI Mistakes to Avoid

| Common Mistake | What to Do Instead |
|---|---|
| Using Lorem Ipsum as placeholder text | Write semi-realistic copy related to the product |
| Making touch targets too small (< 44pt) | Set minimum touch area to 44×44pt for every interactive element |
| Inconsistent corner radiuses across screens | Define a single corner radius value and use it app-wide |
| Using pure black (#000000) for text | Use dark gray (#1F1F1F or #121212) for primary text |
| Not designing all button states (default, pressed, disabled) | Design all interactive states before handing off to dev |
| Overly long forms without breaks | Split into multi-step flows with progress indicator |
| Ambiguous confirmation dialogs ('Cancel' vs 'OK') | Use specific action labels: 'Delete File', 'Keep Subscription' |
| Stretching form fields to full width on tablet/web | Use fixed-width forms with max-width constraint |
| No error feedback on form fields | Implement inline real-time validation per field |
| Using only color to convey state | Add icons, text labels, or patterns alongside color |
| Placing the primary button on the LEFT | Primary action on the RIGHT (favors right-handed users) |
| Not accounting for iOS home indicator / notch | Use SafeAreaView and respect system UI safe areas |
| Mixing icon styles (filled + line + duo-tone) | Use one icon pack, one style, consistently |
| Using illustrations for products in a shop | Use real product photos for e-commerce items |
| Shadows that are too dark and unrealistic | Use soft shadows: high blur, low opacity (5–10%), non-black color |
| Too many vibrant colors / gradients on one screen | When everything stands out, nothing stands out. Limit bold colors to primary actions only |
| White shadows in dark mode | Use slightly elevated surface colors (lighter shade of background) instead |

---

## 19. Recommended Design Process

Follow this process for every mobile UI screen, whether for a real project or a feature addition.

| # | Stage | What to Do |
|---|---|---|
| **1** | **Understand the Problem** | Define what task the user is trying to complete. Who is the user? What frustrations exist in current solutions? |
| **2** | **Rough Sketches** | Paper sketches, no detail. Explore 5–10 different layout ideas fast. Quantity > quality at this stage. |
| **3** | **Detailed Wireframes** | Build in Figma or Whimsical. Black/white/gray only. No color, no real fonts. Finalize layout and content hierarchy. |
| **4** | **Select Assets** | Choose typeface, color palette, icon pack, illustration style. Create type scale and color palette. Define spacing scale. |
| **5** | **Apply Assets** | Apply color, typography, icons, and images to wireframes. Follow all principles from this document. |
| **6** | **Test & Iterate** | Test tap targets, contrast ratios, font sizes. Check edge cases (long text, no image). Test on real device. |

---

## 20. Quick Reference Cheatsheet

### Android & iOS Specific Notes

| Topic | iOS (HIG) | Android (Material) |
|---|---|---|
| **Min Touch Target** | 44×44pt | 48×48dp |
| **Min Body Font** | 17pt (Dynamic Type) | 16sp (scalable) |
| **Nav Position** | Tab Bar at bottom | Bottom Nav (Material 3) |
| **Back Navigation** | Swipe left gesture | System back button / gesture |
| **App Icon Corner** | Rounded square (system clips) | Adaptive icon (foreground + bg) |
| **Safe Area** | SafeAreaView for notch + home bar | WindowInsets for status + nav bar |
| **Spacing Base** | 4pt or 8pt grid | 4dp or 8dp grid (Material) |

### The Core 10 Principles

1. Usability first. Beauty second.
2. Use a 4pt spacing scale. Never use arbitrary spacing values.
3. Build a color palette (Primary + Tints + Shades + Grayscale) before designing.
4. Create a type scale from a 16pt base. Stick to it.
5. All interactive elements need a minimum 44×44pt touch target.
6. WCAG AA contrast (4.5:1) for all text.
7. Primary CTA button: always the most prominent element on screen.
8. Consistency over creativity — same radius, same spacing, same icons throughout.
9. Design all states: default, focused, filled, error, disabled, pressed.
10. White space is designed space. Resist the urge to fill it.

---

*Based on UI Design Principles by Michael Filipiuk · Reference compiled for Android & iOS mobile development*
