# 📚 Welcome to my Book Quotes app

A simple React Native + Expo app for iOS that lets you log your favorite books and quotes.
Built with a focus on simplicity, modularity, and a user-friendly interface.

## Current Features (MVP)

- Add books with multiple quotes
- Prevent duplicate book entries (quotes are grouped by book)
- Automatic saving with AsyncStorage (local device storage)
- Custom Not Found screen with Safe Area support
- iOS dark/light mode support
- Organized project structure with Expo Router

### UI/UX

- Adopted Apple Human Interface Guidelines (HIG) for a cleaner, native iOS feel  
- Introduced a design system (`theme.ts`) with typography, colors, and spacing  
- Updated **About page** with step-by-step instructions and inspirational vision  
- Consistent spacing system applied across screens (8pt rhythm)  

## Local Persistence

Right now, data is stored **locally on the device** with [AsyncStorage](https://github.com/react-native-async-storage/async-storage).

 - **Helpers**:  
   - `utils/async-storage.ts` → `storeObject` / `getObject` helpers  
   - `utils/id.ts` → `uniqueId()` helper  
 - **Hook**:  
   - `hooks/useBookQuotes.ts` → Manages books/quotes, loads/saves data

 This means your books and quotes stay available between app launches.

 ---

 ## Planned Enhancements

 - **CRUD support**  
   - Remove quotes from a book  
   - Delete entire books  
   - Edit book titles / quote text  

 - **Database integration**  
   - Persistent storage in the cloud (MongoDB backend)  
   - Login system for backup + sync across devices  

 - **UI/UX improvements**  
   - Autocorrect + autocomplete book titles  
   - Take photo of book covers  
   - OCR (photo → text quotes)  
   - Search between books (card layout with covers)  
   - Highlight punch lines in color  
   - Fun, engaging UI (not just utility)  
   - Smart redirect to *Not Found* screen if data is missing/invalid

 ---

 ## 📂 Project Structure

 ```bash
 app/
  ├─ (tabs)/
  │   ├─ index.tsx        # Home screen (books + quotes)
  │   ├─ explore.tsx      # Explore screen (placeholder for future features)
  │   └─ +not-found.tsx   # Not Found screen (fallback route)
  ├─ _layout.tsx          # Root layout with navigation
 hooks/
  └─ useBookQuotes.ts     # Custom hook for managing books + quotes
 utils/
  ├─ async-storage.ts     # storeObject / getObject helpers
  ├─ id.ts                # uniqueId() generator
  └─ theme.ts             # colors + typography (light/dark mode)
 ```

## Get started:

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo


## Learn more

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).


# Contributing
This is a learning project as I explore React Native, Expo, and mobile app publishing.
Ideas, feedback, or pull requests are welcome!