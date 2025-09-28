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

## Handling Unique IDs
- Initial implementation used Date.now().toString() for IDs.
- This caused duplicate key warnings when multiple entries were created within the same millisecond.
- Fix: Introduced a uniqueId() helper (utils/id.ts) that combines timestamp + random suffix.
- Added a migration step to retroactively assign IDs to quotes or books missing them in saved data.

## Error Handling & Navigation
- Created a custom Not Found screen for invalid routes.
- Initially tried to fix spacing with negative margins — which broke layout across devices.
- Corrected to use pure Flexbox centering (justifyContent: "center", alignItems: "center") to stay adaptive.

## Future-Proofing
- While persistence is local today, the architecture prepares for CRUD operations and a remote MongoDB backend:
    - utils/ for shared helpers (storage, IDs, theming).
    - hooks/ for state + business logic (useBookQuotes).
    - app/ for Expo Router screens.
- This separation ensures replacing AsyncStorage with an API layer will be straightforward.

## Reflections
This project has been a balance between learning fundamentals and future-proofing for real-world expansion.