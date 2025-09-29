# Development Notes
This document captures the main design decisions and lessons from building the Book Quotes App.

## iOS Look & Feel
- Followed Apple’s HIG for a clean, minimal interface.
- Centralized typography, spacing, and colors in theme.ts for consistency.
- Adopted dark/light mode and safe area support.

## Persistence & IDs
- Added AsyncStorage persistence via useBookQuotes hook.
- Fixed early bug where quotes vanished after reload.
- Introduced uniqueId() helper to avoid duplicate keys.
- Added migration logic to retroactively assign IDs to old data.

## Handling Unique IDs
- Initial implementation used Date.now().toString() for IDs.
- This caused duplicate key warnings when multiple entries were created within the same millisecond.
- Fix: Introduced a uniqueId() helper (utils/id.ts) that combines timestamp + random suffix.
- Added a migration step to retroactively assign IDs to quotes or books missing them in saved data.

## Error Handling & Navigation
- Custom Not Found screen for invalid routes.
- Fixed layout issues by switching from negative margins → pure Flexbox.

## Tooling & DX
- ESLint + Prettier for consistent style.
- TypeScript strictness to prevent type mismatches.
- Refactored AsyncStorage into storeObject / getObject helpers.

### Recent Updates
- Camera integration: take & save book cover photos.
- Covers now display with books.
- Full-screen scrolling with ScrollView.
- KeyboardAvoidingView for iOS input handling.
- About page updated with clear step-by-step instructions.

## Future-Plan
- CRUD: edit/remove books & quotes.
- Cloud sync (MongoDB + login).
- OCR to convert photo → text quotes.
- Search, filters, and card-style browsing.
- Internationalization (i18n) for multilingual quotes.

## Reflections
This project balances MVP simplicity with a foundation for future expansion - small design choices like unique IDs, AsyncStorage helpers, and theming lay the groundwork for scaling without overcomplicating.
