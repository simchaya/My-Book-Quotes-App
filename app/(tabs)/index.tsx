// app/(tabs)/index.tsx

import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SwipeListView } from "react-native-swipe-list-view";

import { useBookQuotes } from "@/hooks/useBookQuotes";
import { spacing, useThemeColors } from "@/utils"; // using consolidated index

import BookInputForm from "@/components/BookInputForm"; //Refactor // new import 
import BookListItem from "@/components/BookListItem"; // //Refactor //New import
import SwipeDeleteButton from "@/components/SwipeDeleteButton"; // //Refactor // New import

// Refactor: Removed the inline BookItem component (moved to Step 3)
// Refactor: Removed title, quote, coverUri state variables
// Refactor: Removed handlePickCover, handleSaveQuote functions
// Refactor: Removed renderHeader function


// HomeScreen is a container that delegates the rendering of individual items to BookListItem.
// It's a container component responsible for managing the state and rendering the entire view, 
// including the input form and the list itself.


export default function HomeScreen() {
  const {
     books, 
     addQuoteToBook, 
     removeBookById,
     removeQuoteById, 
     editQuote, 
     editBookTitle 
    } = useBookQuotes();
  const colors = useThemeColors();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        style={[styles.keyboardContainer]}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <SwipeListView
          data={books}
          keyExtractor={(book) => book.id}
          // Refactor: ListHeaderComponent uses the new component
          ListHeaderComponent={<BookInputForm onSave={addQuoteToBook} />} 
          // Refactor: Render item using the new component
          renderItem={({ item }) =>
            (
              <BookListItem 
                book={item} 
                onDeleteQuote={removeQuoteById} 
                onUpdateTitle={editBookTitle} 
                onUpdateQuote={editQuote} 
              />
            )}
            
          // Refactor: Render hidden item using the new component
          renderHiddenItem={({ item }) => (
            <SwipeDeleteButton onPress={() => removeBookById (item.id)} />
          )}
          //Controls how far the row must be swiped to reveal the hidden item (the Delete button).
          // -75 means the user must swipe 75 units to the left. The value is negative 
          // because the hidden item is on the right side of the list row.
          rightOpenValue={-75}
          //Applies padding to the bottom of the *entire content* inside the list. 
          // This ensures the last list item isn't cut off by the bottom of the screen or 
          // the device's home indicator (notch/bar) when scrolling down.
          contentContainerStyle={{ paddingBottom: spacing.lg }}
          // Manages how touch events are handled when the software keyboard is open.
          // "handled" ensures that when a user taps outside of a focused TextInput (like tapping 
          // a button or another scrollable item), the tap event is processed immediately 
          // without automatically dismissing the keyboard. This prevents accidental keyboard closures.
          keyboardShouldPersistTaps="handled"
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.md },
  keyboardContainer: { flex: 1 },
});
