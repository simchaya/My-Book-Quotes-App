import { Book, Quote } from "@/hooks/useBookQuotes";
import { spacing, typography, useThemeColors } from "@/utils";
import React from "react";
import { Alert, Image, Pressable, StyleSheet, Text, View } from "react-native";

interface BookListItemProps {
  book: Book;
  onDeleteQuote: (quoteId: string) => void;
  onUpdateTitle: (bookId: string, newTitle: string) => void;
  onUpdateQuote: (quoteId: string, newText: string) => void;
}

const BookListItem = ({
  book,
  onDeleteQuote,
  onUpdateTitle,
  onUpdateQuote,
}: BookListItemProps) => {
  const colors = useThemeColors();

  const handleEditTitle = () => {
    Alert.prompt(
      "Edit Book Title",
      "Enter the new title:",
      (newTitle) => {
        if (newTitle && newTitle.trim().length > 0) {
          onUpdateTitle(book.id, newTitle.trim());
        }
      },
      "plain-text",
      book.title
    );
  };

  const handleEditQuote = (quote: Quote) => {
    Alert.prompt(
      "Edit Quote",
      "Enter the new quote text:",
      (newText) => {
        if (newText && newText.trim().length > 0) {
          onUpdateQuote(quote.id, newText.trim());
        }
      },
      "plain-text",
      quote.text
    );
  };

  const handleDeleteQuote = (quote: Quote) => {
    Alert.alert(
      "Confirm Deletion",
      `Are you sure you want to delete the quote: "${quote.text.substring(
        0,
        30
      )}..."?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => onDeleteQuote(quote.id),
        },
      ]
    );
  };

  return (
    <View style={[styles.bookItem, { backgroundColor: colors.card || "#fff" }]}>
      <Pressable onPress={handleEditTitle}>
        <Text style={[typography.title2, { color: colors.text }]}>
          {book.title}
        </Text>
      </Pressable>

      {book.coverUri && (
        <Image
          source={{ uri: book.coverUri }}
          style={styles.coverImage}
          resizeMode="contain"
        />
      )}

      {book.quotes.map((q) => (
        <View key={q.id} style={styles.quoteRow}>
          <Pressable
            style={styles.quoteTextContainer}
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

const styles = StyleSheet.create({
  bookItem: {
    flex: 1, // let parent control layout
    marginBottom: spacing.lg,
    padding: spacing.md,
    borderRadius: 12,
  },
  coverImage: {
    width: "100%",
    height: 180,
    borderRadius: 8,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  quoteText: { fontStyle: "italic" },
  quoteRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginTop: spacing.sm,
  },
  quoteTextContainer: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  deleteButton: {
    padding: spacing.xs,
    paddingLeft: spacing.md,
  },
  deleteText: {
    color: "red",
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default BookListItem;
