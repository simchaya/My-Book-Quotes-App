import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
} from "react-native";
import { storeObject, getObject } from "@/utils/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";


type Book = {
  id: string;
  title: string;
  quotes: string[];
};

export default function HomeScreen() {
  const [books, setBooks] = useState<Book[]>([]);
  const [title, setTitle] = useState("");
  const [quote, setQuote] = useState("");

  useEffect(() => {
    (async () => {
      const saved = await getObject("books");
      if (saved) setBooks(saved);
    })();
  }, []);

  useEffect(() => {
    storeObject("books", books);
  }, [books]);

  const addQuote = () => {
    if (!title.trim() || !quote.trim()) return;

    setBooks((prevBooks) => {
      const existingBook = prevBooks.find(
        (book) => book.title.toLowerCase() === title.toLowerCase()
      );

      if (existingBook) {
        return prevBooks.map((book) =>
          book.id === existingBook.id
            ? { ...book, quotes: [...book.quotes, quote] }
            : book
        );
      } else {
        return [...prevBooks, { id: Date.now().toString(), title, quotes: [quote] }];
      }
    });

    setQuote("");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>📚 My Book Quotes</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter book title"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter a favorite quote"
          value={quote}
          onChangeText={setQuote}
          multiline
        />
        <Button title="Save Quote" onPress={addQuote} />

        <ScrollView style={styles.list}>
          {books.map((book) => (
            <View key={book.id} style={styles.bookItem}>
              <Text style={styles.bookTitle}>{book.title}</Text>
              {book.quotes.map((q, idx) => (
                <Text key={idx} style={styles.quote}>• {q}</Text>
              ))}
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#7da7f6",
    borderRadius: 8,
    padding: 10,
    marginVertical: 8,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  list: {
    marginTop: 16,
  },
  bookItem: {
    padding: 12,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
  },
  quote: {
    fontSize: 16,
    fontStyle: "italic",
    marginLeft: 10,
    marginVertical: 2,
  },
});
