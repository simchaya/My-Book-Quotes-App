// components/BookListItem.tsx

import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native'; // Refactor // NEW: Added StyleSheet
import { Book } from '@/hooks/useBookQuotes'; // Refactor // NEW: Adjusted import path
import { spacing, typography, useThemeColors } from "@/utils"; // Refactor // NEW: Adjusted import path

// Refactor // NEW: Prop interface for typing
interface BookListItemProps {
    book: Book;
}

// Refactor // NEW: Component definition
// Component for displaying one book + its quotes + optional cover photo

const BookListItem = ({ book }: BookListItemProps) => {
  const colors = useThemeColors();

  return (
    // Refactor // KEPT: bookItem style key MOVED from App/index.tsx
    <View style={[styles.bookItem, { backgroundColor: colors.card }]}>
      {/* // Refactor // KEPT: Text element, style unchanged from original */}
      <Text style={[typography.title2, { color: colors.text }]}>
        {book.title}
      </Text>

      {/* Show cover if saved */}
      {book.coverUri && (
        <Image
          source={{ uri: book.coverUri }}
          // Refactor // CHANGED: Replaced long inline style with styles.coverImage
          style={styles.coverImage} 
          resizeMode="cover"
        />
      )}

      {book.quotes.map((q, index) => (
        <Text
          key={`${book.id}-${q.id ?? index}`}
          style={[
            typography.body,
            // Refactor // CHANGED: Replaced inline style {fontStyle: "italic"} with key
            styles.quoteText, 
            { color: colors.secondaryText },
          ]}
        >
          “{q.text}”
        </Text>
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
    }
});

export default BookListItem;