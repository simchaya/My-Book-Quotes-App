@/DEV_LOG.md
 
# Development Notes
This document captures the main design decisions and lessons from building the Book Quotes App.

## iOS Look & Feel
- Followed Apple’s HIG for a clean, minimal interface.
- Centralized typography, spacing, and colors in theme.ts for consistency.
- Adopted dark/light mode and safe area support.

## Persistence & IDs    
- Added AsyncStorage persistence via useBookQuotes hook.
- Fixed early bug where quotes vanished after reloading.
- Introduced uniqueId() helper to avoid duplicate keys.
- Added migration logic to retroactively assign IDs to old data.
- Migrated to SQLite instead of AsyncStorage

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
- Swipe-to-delete for books (HIG-aligned interaction)
- [October 16, 2025] Changed app name to MarkItDown
- [October 16, 2025] Complete CRUD and UI support: edit/remove books & quotes
- [October 16, 2025] Migration of persistence from AsyncStorage to SQLite

### OCR Integration Attempt:

**(October 14, 2025) — Native OCR Exploration and Revert**

**Goal:** Add an on-device Optical Character Recognition (OCR) feature so users could take a photo of a book page and automatically extract the text into the quote field — keeping the process private **and offline**.

**Implementation Path:**
- Added the expo-text-recognition library to enable native OCR on iOS.
- Moved image-handling logic into a new media.ts utility for separation of concerns and modularity.
- Began full native build setup using expo prebuild and npx expo run:ios, which generated the /ios directory and required configuration of CocoaPods and Xcode.
- Encountered multiple environment dependencies — including missing CocoaPods installation, unregistered iOS simulator runtimes, and repeated xcodebuild error 70 — while attempting to compile the app for a local iPhone 16 simulator (iOS 18.6).
- After hours of resolving build-toolchain issues (CocoaPods, Xcode license agreement, and simulator registration), the effort was deemed too complex for a managed Expo workflow.

**Decision & Outcome:**

- The native OCR implementation was abandoned to preserve the app’s simplicity and the developer sanity ;/.
- All native code was removed.
- The app reverted to a clean managed Expo project fully runnable inside Expo Go, with image capture retained only for book-cover photos.
- Decided to give up the so wanted **offline** OCR feature on the account of leaving the Expo Go environment and try using cloud service integration which will allow keeping the Expo Go environment testing going (second attempt documentation below)

**Reflection:**
While technically feasible, the native OCR path required leaving the managed Expo environment and maintaining a full Xcode toolchain — a high-cost trade-off for this feature. This decision prioritized stability and maintainability.

**(October 15, 2025) - Google Cloud Vision OCR Feature Revert & Strategy**

**Goal**: Trying alternative solution for the same purpose. 

**Technical Approach:**

1. Used `expo-image-picker` to handle photo capture/selection.

2. Implemented a **Google Cloud Vision OCR** service via a dedicated Cloud Function to perform the text analysis.

3. The frontend component (`BookInputForm.tsx`) was updated to capture the image as a Base64 string and POST it to the Cloud Function, then handle the returned text.

**Challenges & Decision to Revert:**
The feature faced two critical issues stemming from the native platform environment:

1. **Native Cropping Failure:** The `expo-image-picker`'s built-in cropping feature, necessary for isolating a single line of text, was unreliable and often forced a **1.00 (square)** aspect ratio, even when explicitly requesting a 16:3 wide ratio. This made the OCR unreliable as it received too much context.

2. **Platform Feature Superiority:** It was recognized that modern smartphone operating systems (specifically Apple's **Live Text** feature) already provide superior, high-performance, and precise text recognition directly in the camera or photo gallery. This native feature is a better, faster, and more reliable user experience than any custom OCR solution built into the application shell.

**Outcome & Final Decision:**
The dedicated OCR functionality was **removed** from the core application. The final user experience relies on the user performing the text recognition using their **native phone features (like Live Text)** and then pasting the copied quote manually into the clean, simplified text box.

**Git Management:**
The entire functional OCR implementation (including `BookInputForm.tsx`, `cloud-function/package.json`, and `cloud-function/vision-ocr-function.js`) was isolated and preserved on a separate feature branch (`feature/cloud-ocr`). The clean, simplified version of the input form was retained on the `main` branch, ensuring a stable and efficient core application.

## Future-Plan
- OCR to convert photo → text quotes. [(October 16, 2025): plan to drop, see "OCR Integration Attempt" section above]
- Search, filters, and card-style browsing.
- Internationalization (i18n) for multilingual quotes.
- [October 16, 2025] add quotes to existing book from the book card itself
- [October 16, 2025] add a personal note to a quote
- [October 16, 2025] discover quotes feature
- [October 16, 2025] highlight part of a quote
- [October 16, 2025] refer to LiveText camera for copying quotes
- [October 16, 2025] secure log in using Google
- [October 16, 2025] arrange cards in a slidable way or open in new pages
- [October 16, 2025] advance about page and add a demo video of usage

## Reflections
This project balances MVP simplicity with a foundation for future expansion - small design choices like unique IDs, AsyncStorage helpers, and theming lay the groundwork for scaling without overcomplicating.


