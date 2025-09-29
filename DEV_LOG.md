# Development Notes
This document shares insights into the development process, design decisions, and challenges faced while building the Book Quotes App.

## Adapting to iOS Look & Feel
- Followed Apple’s Human Interface Guidelines (HIG) to keep the UI clean, minimal, and intuitive.
- Introduced a theme.ts file to centralize system-like colors and typography scales (largeTitle, title2, body, caption) for consistency.
- Avoided hardcoded hex values in favor of light/dark mode–friendly colors.
- Refined quotes UI: replaced list bullets with soft italic quotes (“...”), aligning more with iOS text styling.

## Persistence Journey
- Early issue: Quotes disappeared after app reload since they only lived in React state.
- Solution: Implemented local persistence with AsyncStorage through a custom useBookQuotes hook.
- Added safeguards to prevent accidental overwrites with empty state during Expo hot reload.
- Verified persistence not just with hot reloads, but by reinstalling the app in Expo Go to confirm storage survived across sessions.

## Handling Unique IDs
- Initial implementation used Date.now().toString() for IDs.
- This caused duplicate key warnings when multiple entries were created within the same millisecond.
- Fix: Introduced a uniqueId() helper (utils/id.ts) that combines timestamp + random suffix.
- Added a migration step to retroactively assign IDs to quotes or books missing them in saved data.

## Error Handling & Navigation
- Created a custom Not Found screen for invalid routes.
- Initially tried to fix spacing with negative margins — which broke layout across devices.
- Corrected to use pure Flexbox centering (justifyContent: "center", alignItems: "center") to stay adaptive.
- Intentionally tested invalid routes (router.push("/+not-found")) to confirm fallback navigation works as expected.

## Developer Experience & Tooling
- ESLint + Prettier: Configured linting/formatting to enforce consistent code style and catch issues (e.g., unescaped entities).
- TypeScript Strictness: Leveraged type safety to prevent mismatches (e.g., between string[] vs. {id, text}[]).
- Console Debugging: Used temporary logs in hooks and components to trace state updates between AsyncStorage and UI.

## AsyncStorage Lessons
- Migration Challenge: Transitioning from string-based quotes to object-based quotes required careful handling. Highlighted how persistence formats should be versioned for long-term stability.
- Custom Helpers: Refactored storage utilities to include storeObject and getObject, centralizing JSON handling instead of scattering JSON.stringify/JSON.parse throughout the app.

## UI/UX Iteration
- SafeAreaView Migration: Replaced deprecated SafeAreaView with react-native-safe-area-context to properly respect iOS safe areas (battery notch, status bar).
- Minimalism vs. Personality: Balanced clean iOS aesthetics with subtle personality — emoji headers, soft quote styling — to keep the app engaging.

### Recent Updates
- Refactored spacing system into `theme.ts` (`spacing` tokens for 8pt rhythm)  
- Updated HomeScreen and AboutScreen styles to remove “magic numbers”  
- Reworked About page:
  - Added step-by-step instructions (scroll → find → save)  
  - Inspirational text now sits below instructions in italic  
  - Layout spacing adjusted to match iOS HIG composition 

## Future-Plan
- While persistence is local today, the architecture prepares for CRUD operations and a remote MongoDB backend:
    - utils/ for shared helpers (storage, IDs, theming).
    - hooks/ for state + business logic (useBookQuotes).
    - app/ for Expo Router screens.
- This separation ensures replacing AsyncStorage with an API layer will be straightforward.
- Anticipated features:
  - Quote deletion/edit (CRUD-ready but missing UI).
  - Search, filters, and card-style book browsing.
  - Punchline highlighting with styled text spans.
  - Internationalization (i18n) for multilingual quotes.

## Reflections
This project has been a balance between learning fundamentals and future-proofing for real-world expansion.
It demonstrates how small design choices (like unique IDs, migration handling, and theme centralization) set the foundation for scalability without overcomplicating the MVP.
