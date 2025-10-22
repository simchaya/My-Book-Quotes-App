# Development Log - MarkItDown

This document captures the technical decisions, challenges, and lessons learned while building MarkItDown, a React Native app for capturing and organizing book quotes.

---

## 📱 Project Overview

**Tech Stack:**
- **Frontend:** React Native + Expo
- **Database:** SQLite (expo-sqlite)
- **Camera:** expo-image-picker
- **OCR:** Google Cloud Vision API
- **State Management:** Custom React Hooks
- **Styling:** Custom design system with theme.ts

**Architecture:**
- Managed Expo workflow (no native code ejection)
- Modular hook-based state management
- Custom utilities for database operations
- Cloud function integration for OCR processing

---

## 🎨 Design Philosophy: iOS Look & Feel

### Apple Human Interface Guidelines (HIG)
- Clean, minimal interface with focus on content
- Swipe-to-delete gestures for iOS-native feel
- Safe area support for modern iPhone notches
- Consistent touch targets and spacing

### Design System (theme.ts)
- Centralized typography scale
- Color palette for light/dark mode
- 8pt spacing rhythm for visual consistency
- Semantic color tokens (primary, secondary, text, background)

### Dark/Light Mode
- Automatic theme switching based on system preferences
- Carefully chosen colors for readability in both modes
- Smooth transitions between themes

---

## 💾 Data Persistence Journey

### Phase 1: AsyncStorage (Initial Implementation)
- Used AsyncStorage for simple key-value storage
- Implemented custom `storeObject` / `getObject` helpers
- Created `useBookQuotes` hook for state management

**Early Bug:** Quotes vanishing after reload
- **Root Cause:** Books weren't being properly serialized
- **Fix:** Refactored data structure and storage helpers

### Phase 2: Unique ID System
- Introduced `uniqueId()` helper to generate consistent IDs
- Prevented duplicate entries and React key warnings
- Added migration logic to retroactively assign IDs to existing data

### Phase 3: SQLite Migration (October 16, 2025)
**Why migrate?**
- Better performance for growing datasets
- Proper relational structure (books → quotes)
- Support for complex queries and filtering
- Foundation for future search features

**Migration Process:**
- Implemented database schema with books and quotes tables
- Created `database.ts` utility with CRUD operations
- Added migration script to transfer AsyncStorage data to SQLite
- Maintained backwards compatibility during transition

**Database Schema:**
```sql
    IF NOT EXISTS books (
      id TEXT PRIMARY KEY NOT NULL,
      userId TEXT NOT NULL,
      title TEXT NOT NULL,
      coverUri TEXT
    );

    CREATE TABLE IF NOT EXISTS quotes (
      id TEXT PRIMARY KEYCREATE TABLE  NOT NULL,
      bookId TEXT NOT NULL,
      text TEXT NOT NULL,
      FOREIGN KEY (bookId) REFERENCES books(id) ON DELETE CASCADE
    );

```

---

## 📸 Camera Integration

### Book Cover Photos
- Used `expo-image-picker` for camera access
- Permission handling for iOS camera and photo library
- Image URI storage in SQLite
- Optimized image display with proper aspect ratios

### Technical Challenges:
1. **Permission Flow:** Handling denied permissions gracefully
2. **Image Quality:** Balancing quality vs storage size
3. **URI Management:** Persisting and loading image URIs correctly

---

## 🔍 OCR Implementation Journey

### Attempt 1: Native OCR (October 14, 2025) ❌

**Goal:** On-device OCR for privacy and offline functionality

**Approach:**
- Added `expo-text-recognition` library
- Created `media.ts` utility for image handling
- Attempted full native build with `expo prebuild`

**Challenges:**
- Required leaving managed Expo workflow
- CocoaPods installation issues
- Xcode simulator registration errors
- `xcodebuild error 70` repeatedly
- Complex native environment dependencies

**Decision:** Abandoned native OCR
- Too complex for managed Expo workflow
- Developer experience suffered significantly
- Maintenance burden too high
- Prioritized app stability over this feature

**Reflection:** Sometimes the "right" technical solution isn't worth the complexity cost. Staying in managed Expo preserved velocity and simplicity.

---

### Attempt 2: Cloud OCR with Crop Feature (October 15, 2025) ❌

**Goal:** Cloud-based OCR as a simpler alternative

**Approach:**
- Implemented Google Cloud Vision API via Cloud Function
- Used `expo-image-picker` with built-in cropping
- Base64 image encoding for API transmission

**Critical Issues:**

1. **Native Cropping Failure:**
   - `expo-image-picker`'s crop feature unreliable
   - Forced 1:1 aspect ratio despite requesting 16:3
   - Couldn't isolate single lines of text effectively

2. **Platform Feature Recognition:**
   - Realized iOS Live Text already provides superior OCR
   - Native features are faster, more accurate, and better UX
   - Building custom OCR became redundant

**Decision:** Removed dedicated OCR, recommended Live Text
- Simplified UI to basic text input
- Added hint to use native phone features
- Preserved code on `feature/cloud-ocr` branch

**Git Strategy:** Feature branch isolation allowed clean main branch while preserving working implementation for future reference.

---

### Attempt 3: Simplified Cloud OCR (October 17, 2025) ✅

**Goal:** Reintegrate OCR without cropping complexity

**Implementation:**

#### Cloud Function Setup
- Created `/cloud-function/` directory
- Deployed `vision-ocr-function.js` to Google Cloud Functions
- Handles POST requests with base64 images
- Returns extracted text via JSON response
- Added `.gcloudignore` for deployment optimization

#### App Integration
**File: `useBookInput.ts`**
- Created `handleOcrFromImage()` method
- Workflow:
  1. Request camera permissions
  2. Launch camera via `expo-image-picker`
  3. Convert image to base64 using `expo-file-system`
  4. POST to Cloud Function endpoint
  5. Parse response and populate quote field

**File: `BookInputForm.tsx`**
- Added camera icon next to quote input
- Visual consistency with book cover camera icon
- Clean, minimal UI without hint text

#### Error Handling
- Console logging at each workflow step
- User alerts for permission denials
- Network error handling with fallback
- Deprecated API method updates

#### Testing
- Verified on physical iPhone via Expo Go
- Tested with printed book quotes
- Confirmed text extraction accuracy
- Performance acceptable for user experience

**Success Factors:**
- Removed cropping requirement (accept full image)
- Cloud Function handles text extraction complexity
- Stayed within managed Expo workflow
- Simple, reliable user flow

---

## 🏗️ Architecture & Code Organization

### Project Structure

| Path                                     | Description                                                        |
| ---------------------------------------- | ------------------------------------------------------------------ |
| **app/**                                 | Main app directory containing all Expo Router screens and layouts. |
| ├─ **(tabs)/_layout.tsx**                | Defines tab navigator and shared tab layout.                       |
| ├─ **(tabs)/about.tsx**                  | About screen describing the app and developer.                     |
| ├─ **(tabs)/index.tsx**                  | Home screen showing book and quote list.                           |
| ├─ **(tabs)/+not-found.tsx**             | Custom 404 fallback route for invalid navigation.                  |
| ├─ **(tabs)/login.tsx**                  | User authentication screen for sign-in.                            |
| └─ **_layout.tsx**                       | Root navigation layout applied globally.                           |
| **assets/**                              | Static assets (images, icons, etc.) used by the app.               |
| **cloud-function/**                      | Backend code for Google Cloud OCR integration.                     |
| ├─ **vision-ocr-function.js**            | Cloud Function that processes images and returns extracted text.   |
| └─ **package.json**                      | Dependency list for the Cloud Function deployment.                 |
| **components/**                          | Reusable UI components following your design system.               |
| ├─ **BookInputForm.tsx**                 | Input form for adding new books and quotes.                        |
| ├─ **BookListItem.tsx**                  | Displays each book and its associated quotes.                      |
| ├─ **FormButton.tsx**                    | Reusable, theme-aware button component.                            |
| ├─ **FormInput.tsx**                     | Styled input field for consistent form UX.                         |
| └─ **SwipeDeleteButton.tsx**             | Swipe gesture delete button for list items.                        |
| **context/**                             | React Context for global state management.                         |
| └─ **AuthContext.tsx**                   | Provides authentication state across the app.                      |
| **hooks/**                               | Custom React hooks encapsulating business logic.                   |
| ├─ ****tests**/**                        | Directory for unit tests of hook logic.                            |
| ├─ **useBookInput.ts**                   | Handles form state and OCR flow logic.                             |
| └─ **useBookQuotes.ts**                  | Manages SQLite CRUD operations for books/quotes.                   |
| **utils/**                               | General utilities and configuration helpers.                       |
| ├─ **database.ts**                       | Database schema and CRUD utilities using SQLite.                   |
| ├─ **fetchBookCover.ts**                 | Integrates Google Books API for cover lookup.                      |
| ├─ **id.ts**                             | Unique ID generator for local entities.                            |
| ├─ **index.ts**                          | Central export file for all utility modules.                       |
| └─ **theme.ts**                          | Global design system (colors, typography, spacing).                |
| **.gcloudignore**                        | Files to exclude when deploying Cloud Functions.                   |
| **.gitignore**                           | Files ignored by Git.                                              |
| **app.json**                             | Expo configuration (app name, icons, permissions).                 |
| **DEV_LOG.md**                           | Developer log documenting progress and lessons.                    |
| **eslint.config.js / eslint.config.mjs** | Linting configuration files for code style.                        |
| **expo-env.d.ts**                        | Type definitions for Expo-specific globals.                        |
| **firebaseConfig.ts**                    | Firebase project credentials and initialization.                   |
| **package.json**                         | Project metadata, dependencies, and npm scripts.                   |
| **package-lock.json**                    | Lockfile for deterministic dependency installs.                    |
| **README.md**                            | Overview and setup guide for the project.                          |
| **tsconfig.json**                        | TypeScript compiler configuration.                                 |

### Custom Hooks Strategy

**`useBookQuotes.ts`** - Core data management
- Manages books and quotes state
- SQLite CRUD operations
- Data loading and persistence
- Export: `{ books, addBook, deleteBook, updateBook }`

**`useBookInput.ts`** - Form state and OCR
- Form field state management
- Camera integration
- OCR workflow orchestration
- Validation logic
- Export: `{ title, author, quote, note, handleOcrFromImage, ... }`

**Benefits:**
- Separation of concerns
- Reusable logic
- Easy testing
- Clear data flow

---

## 🐛 Error Handling & Navigation

### Custom Not Found Screen
- Catch-all route for invalid navigation
- Branded 404 page with navigation back
- Better UX than default Expo error

### Layout Debugging
**Problem:** Early UI alignment issues
- Negative margins causing overflow
- Inconsistent spacing

**Solution:** Pure Flexbox approach
- Eliminated negative margins
- Used flex properties for layout
- Consistent spacing from theme.ts

---

## 🛠️ Development Tooling

### Code Quality
- **ESLint:** Consistent code style enforcement
- **Prettier:** Automatic formatting
- **TypeScript:** Strict mode enabled
  - Prevents type mismatches
  - Better autocomplete
  - Safer refactoring

### Development Workflow
- Expo Go for rapid testing on device
- Hot reload for instant feedback
- Console logging for debugging
- Git feature branches for experiments

---

## 📝 Key Features & Implementation Notes

### Complete CRUD Operations (October 16, 2025)
- Add/edit/remove books
- Add/edit/remove quotes
- Swipe-to-delete gesture for books
- In-place editing with form validation

### Personal Notes on Quotes (October 16, 2025)
- Optional note field alongside each quote
- Helps users remember why a quote matters
- Encourages deeper engagement with reading

### Secure Login (October 16, 2025)
- User authentication for privacy
- Personal library protection
- Foundation for future cloud sync

### Book Cover Recognition (October 21, 2025)
- OCR for book covers to auto-fill title/author
- Integration with book databases for cover images, book title an author
- Reduces manual data entry

---

## 🎯 Technical Decisions & Trade-offs

### Why Managed Expo?
**Decision:** Stay in managed workflow, avoid ejecting

**Trade-offs:**
- ❌ Limited to Expo SDK features
- ❌ Can't use some native libraries
- ✅ Simpler deployment
- ✅ OTA updates
- ✅ Better developer experience
- ✅ Easier maintenance

**Reflection:** For a learning project and MVP, managed Expo was the right choice. Native features can be added later if needed.

### Why Cloud OCR vs Native?
**Decision:** Use Google Cloud Vision API instead of on-device ML

**Trade-offs:**
- ❌ Requires internet connection
- ❌ Privacy concerns (image sent to cloud)
- ❌ API costs (though minimal for personal use)
- ✅ Works in managed Expo
- ✅ No complex ML model management
- ✅ High accuracy
- ✅ Simple implementation

**Reflection:** For an MVP, cloud OCR struck the right balance between functionality and complexity.

### Why SQLite vs AsyncStorage?
**Decision:** Migrate from AsyncStorage to SQLite

**Trade-offs:**
- ❌ More setup complexity
- ❌ Migration script required
- ✅ Better performance at scale
- ✅ Proper relational data
- ✅ Complex queries possible
- ✅ Foundation for search/filter

**Reflection:** Worth the migration effort for future features and better data modeling.

---

## 🚀 Future Plans (Post-Capstone)

### Native OCR Integration
- Integrate iOS Live Text API directly (when Expo supports it)
- Use Google Lens on Android
- Requires leaving Expo Go or waiting for SDK support
- Better privacy and offline functionality

### Discover Feature (Social Reading)
- Share quotes with community
- Browse quotes from other readers
- Follow favorite readers
- Privacy controls (public/private quotes)
- Backend infrastructure needed

### Advanced Features
- Search and filter across all quotes
- Highlight specific parts of quotes
- Bookmark and favorites system
- Reading statistics and insights

### Technical Improvements
- Offline mode
- Google Outh
- Automated testing suite

---

## 💡 Lessons Learned

### 1. **Start Simple, Add Complexity Later**
- Managed Expo → Native build only if necessary
- AsyncStorage → SQLite when needed
- MVP features first, polish later

### 2. **Platform Features Matter**
- Don't rebuild what iOS/Android already do well
- Live Text is better than custom OCR for many use cases
- Leverage native capabilities when possible

### 3. **Developer Experience Is a Feature**
- Expo Go's instant testing saves hours
- Good tooling (ESLint, TypeScript, Jest) prevents bugs

### 4. **Git Branches Enable Experimentation**
- Feature branches preserve working implementations
- Easy to try radical changes without risk
- Clean main branch for stable releases

### 5. **Design Systems Pay Off**
- theme.ts makes style changes trivial
- Consistent spacing looks professional

### 6. **User Behavior Insights**
- The act of capturing quotes changes how people read
- Personal notes make quotes more meaningful
- Simple UX beats feature-rich complexity

---

## 📊 Project Stats

**Development Time:** ~3 weeks
**Total Commits:** 50+ (across all branches)
**Lines of Code:** ~2,000
**Key Dependencies:**
- expo: ^52.0.0
- expo-sqlite: latest
- expo-image-picker: latest
- expo-file-system: latest
- react-native: 0.76.5

**Platforms Tested:**
- iOS 18+ (iPhone 12, 14, 16)
- Expo Go environment
- iOS Simulator

---

## 🔚 Reflection

This project taught me that **constraints breed creativity**. Staying in managed Expo forced simpler solutions. Failed OCR attempts taught valuable lessons about when to use platform features vs building custom. The journey from AsyncStorage to SQLite showed how MVPs should evolve.

Most importantly: **the best feature is the one that makes users engage more deeply with what matters** - in this case, reading. The app isn't just about storing quotes; it's about noticing them in the first place.

Building MarkItDown reinforced that technology should enhance human experiences, not replace them.

---

**Last Updated:** October 21, 2025  
**Version:** 1.0 (Capstone Submission)
