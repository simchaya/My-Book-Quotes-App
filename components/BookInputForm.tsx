// components/BookInputForm.tsx

import React, { useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

import { spacing, typography, useThemeColors } from "@/utils"; // using consolidated index

// Refactoring // NEW: Component definition and prop typing
interface BookInputFormProps {
  onSave: (title: string, quote: string, coverUri?: string) => void;
}


// Refactoring // NEW: Functional component definition, receiving 'onSave'
const BookInputForm: React.FC<BookInputFormProps> = ({ onSave }) => {
  const [title, setTitle] = useState("");
  const [quote, setQuote] = useState("");
  const [coverUri, setCoverUri] = useState<string | null>(null);
  const colors = useThemeColors();

  // Refactoring // Pick photo from camera (Logic MOVED from index.tsx)
  const handlePickCover = async () => {
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

  // Refactoring // Handle saving new quote (Logic MOVED from indec.tsx, one line changed)
  const handleSaveQuote = () => {
    if (!title.trim() || !quote.trim()) return;
    // Refactoring // CHANGED: Using the onSave prop instead of the hook function
    onSave(title, quote, coverUri ?? undefined); 
    setQuote("");
    setTitle("");
    setCoverUri(null);
  };

  // Refactoring // JSX structure MOVED from renderHeader
  return (
    <View>
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

      {/* REFACTORING: Take Photo button (style key updated) */}
      <Pressable
        style={[styles.actionButton, { backgroundColor: colors.card }]}
        onPress={handlePickCover}
      >
        <Text style={[typography.body, styles.buttonText, { color: colors.text }]}>
          Take Book Cover Photo
        </Text>
      </Pressable>

      {/* Show preview before saving */}
      {coverUri && (
        <Image
          source={{ uri: coverUri }}
          style={styles.previewImage} // REFACTORING: NEW: Using a StyleSheet key
          resizeMode="cover"
        />
      )}

      {/* Save button (REFACTORING: style key updated) */}
      <Pressable
        style={[styles.actionButton, { backgroundColor: colors.buttonBg }]}
        onPress={handleSaveQuote}
        accessibilityRole="button"
      >
        <Text
          style={[
            typography.body,
            styles.buttonText,
            { color: colors.buttonText },
          ]}
        >
          Save Quote
        </Text>
      </Pressable>
    </View>
  );
};

// Refactoring: NEW: Dedicated StyleSheet block for the component

const styles = StyleSheet.create({
// Refactoring: MOVED: input style is identical
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  // Refactoring: CHANGED KEY: Renamed from saveButton for clarity
  actionButton: { 
    borderRadius: 10,
    paddingVertical: spacing.md,
    alignItems: "center",
    marginBottom: spacing.lg,
  },
   // Refactoring: MOVED: buttonText style is identical
  buttonText: { fontWeight: "600" },
  //  Refactoring: NEW KEY: Extracted image styles from inline JSX
  previewImage: { 
    width: "100%", 
    height: 150, 
    borderRadius: 8, 
    marginBottom: spacing.md 
  }
});

export default BookInputForm;