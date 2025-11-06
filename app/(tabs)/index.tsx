//app/(tabs)/index.tsx - home screen

import { Ionicons } from "@expo/vector-icons";
import React from "react";
// React Native Core Components
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Contexts and Hooks for State Management and Logic
import { useAuth } from "@/context/AuthContext";
import { useBookQuotes } from "@/hooks/useBookQuotes";
// Utility functions for consistent styling (spacing, themes)
import { spacing, useThemeColors } from "@/utils";

// Reusable UI Components
import BookInputForm from "@/components/BookInputForm";
import BookListItem from "@/components/BookListItem";

export default function HomeScreen() {
  // Destructure data and functions from the custom data management hook
  const {
    books,
    addQuoteToBook,
    removeBookById,
    removeQuoteById,
    editQuote,
    editBookTitle,
  } = useBookQuotes();
  
  // Get dynamic colors based on the current theme (e.g., light/dark mode)
  const colors = useThemeColors();
  
  // Get user info and sign-out logic from the authentication context
  const { user, signOut } = useAuth();

  /**
   * Displays an alert to confirm book deletion.
   * This prevents accidental data loss.
   * * @param bookId The ID of the book to be deleted.
   * @param title The title of the book, used in the alert message.
   */
  const handleDeleteBook = (bookId: string, title: string) => {
    Alert.alert(
      "Delete Book",
      `Are you sure you want to delete "${title}" and all its quotes?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          // The deletion function is only called if the user confirms
          onPress: () => removeBookById(bookId),
        },
      ]
    );
  };

  return (
    // SafeAreaView ensures content is visible and not under status bars/notches
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Header: Displays user email and provides a clear sign-out action */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>My Books</Text>
          <Text style={styles.headerEmail}>{user?.email}</Text>
        </View>
        
        {/* Sign Out Button */}
        <TouchableOpacity onPress={signOut} style={styles.signOutButton}>
          <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
        </TouchableOpacity>
      </View>

      {/* Renders a performant, virtualized list of books. FlatList is preferred over ScrollView for long lists to optimize memory. */}
      <FlatList
        data={books}
        keyExtractor={(book) => book.id}
        
        // Renders the input form above the list content, allowing it to scroll with the list
        ListHeaderComponent={<BookInputForm onSave={addQuoteToBook} />}

        // Essential UX: Automatically adjusts the list content to prevent input fields from being hidden by the native keyboard
        automaticallyAdjustKeyboardInsets={true}
        keyboardDismissMode="interactive"
        
        // Applying the style defined in the StyleSheet for content padding
        contentContainerStyle={styles.listContent}
        
        // Function that defines how each book item is rendered
        renderItem={({ item }) => (
          // Encapsulates the book list item and its delete control
          <View style={styles.bookRow}>
            <BookListItem
              book={item}
              onDeleteQuote={removeQuoteById}
              onUpdateTitle={editBookTitle}
              onUpdateQuote={editQuote}
            />
            
            {/* Delete X Icon for the book */}
            <TouchableOpacity
              style={styles.deleteBookButton}
              onPress={() => handleDeleteBook(item.id, item.title)}
            >
              <Ionicons name="close" size={22} color="#FF3B30" />
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

// -----------------------------------------------------------------------------
// STYLESHEET
// -----------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: spacing.md 
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  headerEmail: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  signOutButton: {
    padding: 8,
  },
  listContent: { 
    paddingBottom: spacing.lg 
  },
  bookRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  deleteBookButton: {
    paddingTop: spacing.sm,
    paddingLeft: spacing.sm,
  },
});