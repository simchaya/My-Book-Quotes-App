/**
 * BookInputForm.tsx
 * -----------------
 * Presentational component for adding a new book quote.
 *
 * Update:
 * - Simplified placeholder text for a calmer, less intrusive look.
 * - Keeps the WhatsApp-style inline camera icon for cover capture.
 */

import { Feather } from "@expo/vector-icons";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import FormButton from "@/components/FormButton";
import FormInput from "@/components/FormInput";
import { useBookInput } from "@/hooks/useBookInput";
import { spacing, typography, useThemeColors } from "@/utils";

interface BookInputFormProps {
  onSave: (title: string, quote: string, coverUri?: string) => void;
}

const BookInputForm: React.FC<BookInputFormProps> = ({ onSave }) => {
  const { title, setTitle, quote, setQuote, coverUri, handlePickCover, handleSave } =
    useBookInput(onSave);

  const colors = useThemeColors();

  return (
    <View>
      {/* Header */}
      <Text style={[typography.largeTitle, styles.title, { color: colors.text }]}>
        MarkItDown
      </Text>
      <Text style={[typography.callout, styles.subtitle, { color: colors.secondaryText }]}>
        to be kept forever.
      </Text>

      {/* --- Book Title / Author Input with inline camera icon --- */}
      <View style={styles.inputWithIcon}>
        <FormInput
          label="Book Title / Author"
          placeholder="Book title and author"
          value={title}
          onChangeText={setTitle}
          style={{ paddingRight: 40 }}
        />

        <Pressable
          onPress={handlePickCover}
          accessibilityLabel="Take Book Cover Photo"
          style={styles.iconButton}
        >
          <Feather
            name="camera"
            size={22}
            color={coverUri ? colors.buttonBg : colors.secondaryText}
          />
        </Pressable>
      </View>

      {/* Favorite Quote Input */}
      <FormInput
        label="Favorite Quote"
        placeholder="Add your quote"
        value={quote}
        onChangeText={setQuote}
        multiline
      />

      {/* Optional preview image */}
      {coverUri && (
        <Image
          source={{ uri: coverUri }}
          style={[styles.image, { borderColor: colors.border }]}
        />
      )}

      {/* Save Quote Button */}
      <FormButton title="Save Quote" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    textAlign: "center",
    fontWeight: "700",
    marginBottom: spacing.xs,
  },
  subtitle: {
    textAlign: "center",
    fontStyle: "italic",
    marginBottom: spacing.lg,
    letterSpacing: 0.3,
  },
  inputWithIcon: {
    position: "relative",
    marginBottom: spacing.md,
  },
  iconButton: {
    position: "absolute",
    right: spacing.md,
    top: "50%",
    transform: [{ translateY: -11 }],
    padding: spacing.xs,
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    marginBottom: spacing.md,
    borderWidth: 1,
  },
});

export default BookInputForm;
