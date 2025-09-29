import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Book, useBookQuotes } from "@/hooks/useBookQuotes";
import { typography, useThemeColors, spacing } from "@/utils/theme"; // ⬅️ added spacing

// Component for displaying one book + its quotes
const BookItem = ({ book }: { book: Book }) => {
  const colors = useThemeColors();

  return (
    <View style={[styles.bookItem, { backgroundColor: colors.card }]}>
      <Text style={[typography.title2, { color: colors.text }]}>
        {book.title}
      </Text>
      {book.quotes.map((q, index) => (
        <Text
          key={`${book.id}-${q.id ?? index}`}
          style={[
            typography.body,
            { color: colors.secondaryText, fontStyle: "italic" },
          ]}
        >
          “{q.text}”
        </Text>
      ))}
    </View>
  );
};

export default function HomeScreen() {
  const { books, addQuoteToBook } = useBookQuotes();
  const [title, setTitle] = useState("");
  const [quote, setQuote] = useState("");
  const colors = useThemeColors();

  // Handle saving new quote
  const handleSaveQuote = () => {
    if (!title.trim() || !quote.trim()) return;
    addQuoteToBook(title, quote);
    setQuote(""); // clear quote field
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Text
        style={[
          typography.largeTitle,
          { color: colors.text, textAlign: "center", marginBottom: spacing.lg },
        ]}
      >
        My Book Quotes
      </Text>

      {/* Book Title input */}
      <Text
        style={[
          typography.body,
          { color: colors.secondaryText, marginBottom: spacing.xs },
        ]}
      >
        Book Title
      </Text>
      <TextInput
        style={[
          styles.input,
          {
            borderColor: colors.border,
            color: colors.text,
            backgroundColor: colors.background,
          },
        ]}
        placeholder="Book Title"
        placeholderTextColor={colors.placeholder}
        value={title}
        onChangeText={setTitle}
      />

      {/* Quote input */}
      <Text
        style={[
          typography.body,
          { color: colors.secondaryText, marginBottom: spacing.xs },
        ]}
      >
        Favorite Quote
      </Text>
      <TextInput
        style={[
          styles.input,
          {
            borderColor: colors.border,
            color: colors.text,
            backgroundColor: colors.background,
          },
        ]}
        placeholder="Favorite Quote"
        placeholderTextColor={colors.placeholder}
        value={quote}
        onChangeText={setQuote}
      />

      {/* Save button */}
      <Pressable
        style={[styles.saveButton, { backgroundColor: colors.buttonBg }]}
        onPress={handleSaveQuote}
        accessibilityRole="button"
      >
        <Text
          style={[
            typography.body,
            styles.saveButtonText,
            { color: colors.buttonText },
          ]}
        >
          Save Quote
        </Text>
      </Pressable>

      {/* Render list of books */}
      <ScrollView style={styles.list}>
        {books.map((book) => (
          <BookItem key={book.id} book={book} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.md }, // 16
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: spacing.md, // 16
    marginBottom: spacing.md, // 16
  },
  saveButton: {
    borderRadius: 10,
    paddingVertical: spacing.md, // 16
    alignItems: "center",
    marginBottom: spacing.lg, // 24
  },
  saveButtonText: { fontWeight: "600" },
  list: { marginTop: spacing.sm }, // 8
  bookItem: {
    marginBottom: spacing.lg, // 24
    padding: spacing.md, // 16
    borderRadius: 12,
  },
});
