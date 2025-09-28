import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Book, useBookQuotes } from "@/hooks/useBookQuotes";
import { useThemeColors, typography } from "@/utils/theme";

// Component for displaying one book + its quotes
const BookItem = ({ book }: { book: Book }) => {
  const colors = useThemeColors();

  return (
    <View style={[styles.bookItem, { backgroundColor: colors.card }]}>
      <Text style={[typography.title2, { color: colors.text }]}>
        {book.title}
      </Text>
      {book.quotes.map((q) => (
        // composite key ensures uniqueness
        <Text key={`${book.id}-${q.id}`} style={[typography.caption, { color: colors.secondaryText }]}>
          • {q.text}
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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[typography.largeTitle, { color: colors.text, textAlign: "center", marginBottom: 20 }]}>
        Book Quotes
      </Text>

      {/* Book Title input */}
      <Text style={[typography.body, { color: colors.secondaryText, marginBottom: 4 }]}>
        Book Title
      </Text>
      <TextInput
        style={[
          styles.input,
          { borderColor: colors.border, color: colors.text, backgroundColor: colors.background },
        ]}
        placeholder="Book Title"
        placeholderTextColor={colors.placeholder}
        value={title}
        onChangeText={setTitle}
      />

      {/* Quote input */}
      <Text style={[typography.body, { color: colors.secondaryText, marginBottom: 4 }]}>
        Favorite Quote
      </Text>
      <TextInput
        style={[
          styles.input,
          { borderColor: colors.border, color: colors.text, backgroundColor: colors.background },
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
        <Text style={[typography.body, styles.saveButtonText, { color: colors.buttonText }]}>
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
  container: { flex: 1, padding: 16 },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  saveButton: {
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 20,
  },
  saveButtonText: { fontWeight: "600" },
  list: { marginTop: 10 },
  bookItem: { marginBottom: 20, padding: 14, borderRadius: 12 },
});
