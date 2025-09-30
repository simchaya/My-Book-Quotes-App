# 📚 Welcome to my Book Quotes app

A simple React Native + Expo app for iOS that lets you log your favorite books and quotes.
Built with a focus on simplicity, modularity, and a user-friendly interface.

## Features

- **Core**
  - Add books with multiple quotes
  - Prevent duplicate book entries (quotes grouped by book)
  - Local persistence with AsyncStorage
  - Custom “Not Found” screen
  - Swipe-to-delete books (iOS-style gesture)


- **UI/UX**
  - Apple HIG–inspired design
  - Dark/light mode support
  - Design system (`theme.ts` for typography, colors, spacing)
  - Consistent 8pt spacing rhythm

## New in this version
- Take book cover photos with device camera  
- Covers now display with saved books  
- Full-screen scroll (inputs + quotes)  
- KeyboardAvoidingView on iOS (inputs move above keyboard)
- Swipe-to-delete for books (HIG-aligned interaction)

 ## Planned Enhancements
- CRUD: edit/remove books & quotes  
- Cloud sync (MongoDB + login)  
- OCR & search across books  
- Highlighting + improved layouts 
- Discover quotes 


 ## Project Structure

 ```bash
 app/
  ├─ (tabs)/
  │   ├─ index.tsx        # Home screen (books + quotes)
  │   ├─ about.tsx        # About the app
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