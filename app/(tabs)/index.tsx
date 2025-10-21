// app/(tabs)/index.tsx
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  KeyboardAvoidingView, // <-- This import is now unused for wrapping
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SwipeListView } from "react-native-swipe-list-view";

import { useAuth } from "@/context/AuthContext";
import { useBookQuotes } from "@/hooks/useBookQuotes";
import { spacing, useThemeColors } from "@/utils";

import BookInputForm from "@/components/BookInputForm";
import BookListItem from "@/components/BookListItem";
import SwipeDeleteButton from "@/components/SwipeDeleteButton";

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
  const { user, signOut } = useAuth();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
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

      {/* FIX: Removed KeyboardAvoidingView wrapper */}
      <SwipeListView
        data={books}
        keyExtractor={(book) => book.id}
        ListHeaderComponent={<BookInputForm onSave={addQuoteToBook} />} 
        renderItem={({ item }) =>
          (
            <BookListItem 
              book={item} 
              onDeleteQuote={removeQuoteById} 
              onUpdateTitle={editBookTitle} 
              onUpdateQuote={editQuote} 
            />
          )}
          
        renderHiddenItem={({ item }) => (
          <SwipeDeleteButton onPress={() => removeBookById (item.id)} />
        )}
        rightOpenValue={-75}
        contentContainerStyle={{ paddingBottom: spacing.lg }}
        keyboardShouldPersistTaps="handled"
        // FIX: Tell the list to adjust its content inset when the keyboard is active (iOS fix)
        automaticallyAdjustKeyboardInsets={true} 
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.md },
  // FIX: Removed keyboardContainer: { flex: 1 }
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerEmail: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  signOutButton: {
    padding: 8,
  },
});