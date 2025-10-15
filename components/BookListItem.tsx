// components/BookListItem.tsx

import { Book, Quote } from '@/hooks/useBookQuotes'; // Refactor // NEW: Adjusted import path
import { spacing, typography, useThemeColors } from "@/utils"; // Refactor // NEW: Adjusted import path
import React from 'react';
import { View, Text, Image, StyleSheet, Pressable, Alert } from 'react-native'; // Refactor // NEW: Added StyleSheet

// Refactor // NEW: Prop interface for typing
interface BookListItemProps {
  book: Book;
  onDeleteQuote: (quoteId: string) => void;
  onUpdateTitle: (bookId: string, newTitle: string) => void;
  onUpdateQuote: (quoteId: string, newText: string) => void;
}

// Refactor // NEW: Component definition
// Component for displaying one book + its quotes + optional cover photo

const BookListItem = ({
  book,
  onDeleteQuote,
  onUpdateTitle,
  onUpdateQuote
}: BookListItemProps) => {

  const colors = useThemeColors();

  // ------------------------------------
  // 1. UPDATE LOGIC (Edit Title)
  // ------------------------------------
  const handleEditTitle = () => {
    Alert.prompt(
      "Edit Book Title",
      "Enter the new title:",
      (newTitle) => {
        if (newTitle && newTitle.trim().length > 0) {
          onUpdateTitle(book.id, newTitle.trim()); // Call the prop function
        }
      },
      "plain-text",
      book.title
    );
  };

  // ------------------------------------
  // 2. UPDATE LOGIC (Edit Quote)
  // ------------------------------------
  const handleEditQuote = (quote: Quote) => {
    Alert.prompt(
      "Edit Quote",
      "Enter the new quote text:",
      (newText) => {
        if (newText && newText.trim().length > 0) {
          onUpdateQuote(quote.id, newText.trim()); // Call the prop function
        }
      },
      "plain-text",
      quote.text
    );
  };

  // ------------------------------------
  // 3. DELETE LOGIC (Delete Quote)
  // ------------------------------------
  const handleDeleteQuote = (quote: Quote) => {
    Alert.alert(
      "Confirm Deletion",
      `Are you sure you want to delete the quote: "${quote.text.substring(0, 30)}..."?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => onDeleteQuote(quote.id) // Call the prop function
        }
      ]
    );
  };


  return (
    <View style={[styles.bookItem, { backgroundColor: colors.card }]}>
      {/* UI: Make Title Pressable for Editing */}
      <Pressable onPress={handleEditTitle}>
        <Text style={[typography.title2, { color: colors.text }]}>
          {book.title}
        </Text>
      </Pressable>

      {/* Show cover if saved */}
      {book.coverUri && (
        <Image
          source={{ uri: book.coverUri }}
          style={styles.coverImage}
          resizeMode="cover"
        />
      )}

      {book.quotes.map((q, index) => (
        // UI: Container for quote text and delete button
        <View key={q.id} style={styles.quoteRow}>
          {/* UI: Make Quote Text Pressable for Editing */}
          <Pressable style={styles.quoteTextContainer}
            onPress={() => handleEditQuote(q)}
          >
            <Text
              style={[
                typography.body,
                styles.quoteText,
                { color: colors.secondaryText },
              ]}
            >
              “{q.text}”
            </Text>
          </Pressable>
          {/* UI: Delete Quote Button */}
          <Pressable
            onPress={() => handleDeleteQuote(q)}
            style={styles.deleteButton}
          >
            <Text style={styles.deleteText}>✕</Text>
          </Pressable>
        </View>
      ))}
    </View>
  );
};

// Refactor // NEW: Dedicated StyleSheet block
const styles = StyleSheet.create({
  // Refactor // MOVED: Original bookItem style from App/index.tsx
  bookItem: {
    marginBottom: spacing.lg,
    padding: spacing.md,
    borderRadius: 12,
  },
  // Refactor // MOVED & CHANGED: Extracted Image styles from inline JSX
  coverImage: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  // Refactor // NEW: Style key for quotes
  quoteText: {
    fontStyle: "italic"
  },
    // NEW: Styles for the quote row and delete button
    quoteRow: {
    flexDirection: 'row',
    alignItems: 'flex-start', // Align quote text to the top
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  quoteTextContainer: {
    flex: 1, // Allows text to take up most of the space
    paddingRight: spacing.sm,
  },
  deleteButton: {
    padding: spacing.xs,
    paddingLeft: spacing.md,
  },
  deleteText: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 18,
  }
});

export default BookListItem;