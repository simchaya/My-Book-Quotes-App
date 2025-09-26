import React, { useState } from "react";
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Book, useBookQuotes } from "@/hooks/useBookQuotes";

// Component for displaying one book + its quotes
const BookItem = ({ book }: { book: Book }) => (
  <View style={styles.bookItem}>
    <Text style={styles.bookTitle}>{book.title}</Text>
    {book.quotes.map((q) => (
      <Text key={q.id} style={styles.quote}>
        • {q.text}
      </Text>
    ))}
  </View>
);

export default function HomeScreen() {
  const { books, addQuoteToBook } = useBookQuotes(); // state/logic from hook
  const [title, setTitle] = useState(""); // book title input
  const [quote, setQuote] = useState(""); // quote input

  // Handle saving new quote
  const handleSaveQuote = () => {
    if (!title.trim() || !quote.trim()) return;

    addQuoteToBook(title, quote);

    setQuote(""); // always clear quote input
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>📚 Book Quotes</Text>

      {/* Input fields */}
      <TextInput
        style={styles.input}
        placeholder="Book Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Favorite Quote"
        value={quote}
        onChangeText={setQuote}
      />

      {/* Save button */}
      <Button title="Save Quote" onPress={handleSaveQuote} />

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
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
  },
  list: {
    marginTop: 16,
  },
  bookItem: {
    marginBottom: 20,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
  },
  quote: {
    fontSize: 14,
    marginLeft: 8,
    color: "#333",
  },
});
