// app/(tabs)/index.tsx
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  Text,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SwipeListView } from "react-native-swipe-list-view";
import { Ionicons } from "@expo/vector-icons";

import { useBookQuotes } from "@/hooks/useBookQuotes";
import { spacing, useThemeColors } from "@/utils";
import { useAuth } from "@/context/AuthContext";

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

      <KeyboardAvoidingView
        style={[styles.keyboardContainer]}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
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
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.md },
  keyboardContainer: { flex: 1 },
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