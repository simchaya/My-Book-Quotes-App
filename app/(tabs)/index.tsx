import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "@/context/AuthContext";
import { useBookQuotes } from "@/hooks/useBookQuotes";
import { spacing, useThemeColors } from "@/utils";

import BookInputForm from "@/components/BookInputForm";
import BookListItem from "@/components/BookListItem";

export default function HomeScreen() {
  const {
    books,
    addQuoteToBook,
    removeBookById,
    removeQuoteById,
    editQuote,
    editBookTitle,
  } = useBookQuotes();
  const colors = useThemeColors();
  const { user, signOut } = useAuth();

  const handleDeleteBook = (bookId: string, title: string) => {
    Alert.alert(
      "Delete Book",
      `Are you sure you want to delete "${title}" and all its quotes?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => removeBookById(bookId),
        },
      ]
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Header with Sign Out */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>My Books</Text>
          <Text style={styles.headerEmail}>{user?.email}</Text>
        </View>
        <TouchableOpacity onPress={signOut} style={styles.signOutButton}>
          <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
        </TouchableOpacity>
      </View>

      {/* FlatList with Keyboard Fixes */}
      <FlatList
        data={books}
        keyExtractor={(book) => book.id}
        // The input form is the header, which must stay visible
        ListHeaderComponent={<BookInputForm onSave={addQuoteToBook} />}

        //This adjusts the list's scroll content to avoid the keyboard
        automaticallyAdjustKeyboardInsets={true}
        keyboardDismissMode="interactive"

        contentContainerStyle={{ paddingBottom: spacing.lg }}
        renderItem={({ item }) => (
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

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.md },
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