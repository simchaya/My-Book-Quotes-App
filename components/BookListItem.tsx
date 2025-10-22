import { Book, Quote } from "@/hooks/useBookQuotes";
import { spacing, typography, useThemeColors } from "@/utils";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  TextInput
} from "react-native";

interface BookListItemProps {
  book: Book;
  onDeleteQuote: (quoteId: string) => void;
  onUpdateTitle: (bookId: string, newTitle: string) => void;
  onUpdateQuote: (quoteId: string, newText: string) => void;
}

// State to manage the editing process
interface EditingState {
  quoteId: string;
  originalText: string;
  newText: string;
}

const BookListItem = ({
  book,
  onDeleteQuote,
  onUpdateTitle,
  onUpdateQuote,
}: BookListItemProps) => {
  const colors = useThemeColors();

  // Tracks the quote currently being edited
  const [editing, setEditing] = useState<EditingState | null>(null);

  // ------------------------------------
  // Title Edit (Uses Alert.prompt, which is fine for single line)
  // ------------------------------------
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

  // ------------------------------------
  // Quote Edit Logic (Custom UI)
  // ------------------------------------
  const handleStartEditQuote = (quote: Quote) => {
    setEditing({
      quoteId: quote.id,
      originalText: quote.text,
      newText: quote.text,
    });
  };

  const handleSaveEditQuote = () => {
    if (!editing) return;

    // Check for non-empty text
    if (editing.newText.trim().length > 0) {
      onUpdateQuote(editing.quoteId, editing.newText.trim());
      setEditing(null); // Close the editor
    } else {
      Alert.alert("Quote Empty", "Quote text cannot be empty.");
    }
  };

  const handleCancelEditQuote = () => {
    setEditing(null); // Close the editor
  };

  // ------------------------------------
  // Delete Quote Logic
  // ------------------------------------
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
        <View key={q.id}>
          <View style={styles.quoteRow}>
            <Pressable
              style={styles.quoteTextContainer}
              // Start the custom edit process instead of Alert.prompt
              onPress={() => handleStartEditQuote(q)}
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
        </View>
      ))}

      {/* Custom Full-Screen Quote Editor Modal */}
      {editing && (
        <View style={[StyleSheet.absoluteFill, styles.editorOverlay, { backgroundColor: colors.card }]}>
          <Text style={[typography.title1, styles.editorHeader, { color: colors.text }]}>Edit Quote</Text>

          <TextInput
            style={[styles.editorInput, {
              borderColor: colors.border,
              color: colors.text,
              backgroundColor: colors.background // Use background for distinction
            }]}
            onChangeText={(text) => setEditing(prev => (prev ? { ...prev, newText: text } : null))}
            value={editing.newText}
            multiline
            autoFocus
            scrollEnabled
            textAlignVertical="top"
          />

          <View style={styles.editorButtonRow}>
            <Pressable
              onPress={handleCancelEditQuote}
              style={[styles.editorButton, styles.cancelButton]}
            >
              <Text style={[typography.body, styles.cancelText]}>Cancel</Text>
            </Pressable>
            <Pressable
              onPress={handleSaveEditQuote}
              style={[styles.editorButton, styles.saveButton, { backgroundColor: colors.buttonBg }]}
            >
              <Text style={[typography.body, { color: colors.buttonText, fontWeight: 'bold' }]}>Save</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  bookItem: {
    flex: 1,
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

  editorOverlay: {
    padding: spacing.md,
    zIndex: 10,
    borderRadius: 12,
  },
  editorHeader: {
    marginBottom: spacing.md,
  },
  editorInput: {
    flex: 1,
    padding: spacing.md,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: spacing.md,
    fontSize: 16,
  },
  editorButtonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.md,
  },
  editorButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderColor: '#666',
    borderWidth: 1,
  },
  cancelText: {
    color: '#666',
  },
  saveButton: {
  }
});

export default BookListItem;