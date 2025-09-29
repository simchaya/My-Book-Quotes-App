import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { Book, useBookQuotes } from "@/hooks/useBookQuotes";
import { spacing, typography, useThemeColors } from "@/utils/theme";

// Component for displaying one book + its quotes + optional cover photo
const BookItem = ({ book }: { book: Book }) => {
  const colors = useThemeColors();

  return (
    <View style={[styles.bookItem, { backgroundColor: colors.card }]}>
      <Text style={[typography.title2, { color: colors.text }]}>
        {book.title}
      </Text>

      {/* Show cover if saved */}
      {book.coverUri && (
        <Image
          source={{ uri: book.coverUri }}
          style={{
            width: "100%",
            height: 150,
            borderRadius: 8,
            marginTop: spacing.sm,
            marginBottom: spacing.sm,
          }}
          resizeMode="cover"
        />
      )}

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
  const [coverUri, setCoverUri] = useState<string | null>(null);
  const colors = useThemeColors();

  // Pick photo from camera
  const handlePickCover = async () => {
    // Ask for permission first
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Camera permission is required to take a photo");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.7,
    });

    if (!result.canceled) {
      setCoverUri(result.assets[0].uri);
    }
  };

  // Handle saving new quote
  const handleSaveQuote = () => {
    if (!title.trim() || !quote.trim()) return;
    addQuoteToBook(title, quote, coverUri ?? undefined); // pass cover
    setQuote(""); // clear quote field
    setTitle("");   // clear title field
    setCoverUri(null); // reset cover after saving
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{ paddingBottom: spacing.lg }}
          keyboardShouldPersistTaps="handled"
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

          {/* Take Photo button */}
          <Pressable
            style={[styles.saveButton, { backgroundColor: colors.card }]}
            onPress={handlePickCover}
          >
            <Text style={[typography.body, styles.saveButtonText, { color: colors.text }]}>
              Take Book Cover Photo
            </Text>
          </Pressable>

          {/* Show preview before saving */}
          {coverUri && (
            <Image
              source={{ uri: coverUri }}
              style={{ width: "100%", height: 150, borderRadius: 8, marginBottom: spacing.md }}
              resizeMode="cover"
            />
          )}


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

          {books.map((book) => (
            <BookItem key={book.id} book={book} />
          ))}
        </ScrollView>
      </KeyboardAvoidingView>
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
  bookItem: {
    marginBottom: spacing.lg, // 24
    padding: spacing.md, // 16
    borderRadius: 12,
  },
});
