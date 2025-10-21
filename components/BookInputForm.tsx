/**
 * BookInputForm.tsx
 * -----------------
 * Presentational component for adding a new book quote.
 */

import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import FormButton from "@/components/FormButton";
import FormInput from "@/components/FormInput";
import { useBookInput } from "@/hooks/useBookInput";
import { spacing, typography, useThemeColors } from "@/utils";

interface BookInputFormProps {
  onSave: (title: string, quote: string, coverUri?: string) => void;
}

// ----------------------
// Internal helper
// ----------------------
const QuotePlaceholder = () => {
  const colors = useThemeColors();

  return (
    <View pointerEvents="none" style={styles.placeholderContainer}>
      <Text
        style={[
          typography.body,
          styles.placeholderText,
          { color: colors.placeholder },
        ]}
      >
        Enter your quote
      </Text>
    </View>
  );
};

// ----------------------
// Main component
// ----------------------
const BookInputForm: React.FC<BookInputFormProps> = ({ onSave }) => {
  
  const {
    title,
    setTitle,
    quote,
    setQuote,
    coverUri,
    handlePickCover, 
    handleSave,
    handleOcrFromImage,
    isOcrLoading,             
    handleOcrFromTitleImage,  
    isTitleOcrLoading,        
  } = useBookInput(onSave);
  

  const colors = useThemeColors();
  const isIOS = Platform.OS === "ios";
  
  // NEW: Extracted a reusable icon component for the camera with loading state
  const CameraIcon = ({ onPress, isLoading }: {
    onPress: () => void;
    isLoading: boolean;
  }) => (
    // FIX: The comment // Using the original style for positioning is REMOVED to fix the JSX error
    <View style={styles.iconButton}> 
      {isLoading ? (
        <ActivityIndicator size="small" color={colors.secondaryText} />
      ) : (
        <Pressable
          onPress={onPress}
          accessibilityLabel="Capture text from image"
          style={{ padding: spacing.xs }}
        >
          <Feather
            name="camera"
            size={22}
            color={colors.secondaryText}
          />
        </Pressable>
      )}
    </View>
  );

  return (
    <View>
      {/* Header */}
      <Text style={[typography.largeTitle, styles.title, { color: colors.text }]}>
        MarkItDown
      </Text>
      <Text style={[typography.callout, styles.subtitle, { color: colors.secondaryText }]}>
        to be kept forever.
      </Text>

      {/* --- Book Title / Author Input with OCR camera icon --- */}
      <View style={styles.inputWithIcon}>
        <FormInput
          label="Book Title / Author"
          placeholder="Book title and author"
          value={title}
          onChangeText={setTitle}
          style={{ paddingRight: 40 }} 
        />
        
        {/* Title OCR Icon */}
        <CameraIcon
            onPress={handleOcrFromTitleImage} 
            isLoading={isTitleOcrLoading}      
        />

        {/* Removed: The Pressable for handlePickCover is gone */}
      </View>

      {/* --- Favorite Quote Input with OCR camera icon --- */}
      <View style={styles.inputWithIcon}>
        <TextInput
          style={[
            typography.body,
            styles.quoteInput,
            {
              borderColor: colors.border,
              color: colors.text,
              backgroundColor: colors.card,
              paddingRight: 40, // space for the camera icon
            },
          ]}
          multiline
          value={quote}
          onChangeText={setQuote}
          textAlignVertical="top"
        />
        {!quote && <QuotePlaceholder />}

        {/* Quote OCR Camera icon */}
        <CameraIcon
          onPress={handleOcrFromImage}
          isLoading={isOcrLoading} 
        />
      </View>


      {/* Optional cover preview */}
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

// ----------------------
// Styles
// ----------------------
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
  // This style is now used for the single CameraIcon on both fields
  iconButton: {
    position: "absolute",
    right: spacing.md,
    top: "50%",
    transform: [{ translateY: -11 }],
  },
  // Removed: twoIconsContainer and iconButtonCover styles are no longer needed
  quoteInputContainer: {
    position: "relative",
    marginBottom: spacing.md,
  },
  quoteInput: {
    borderWidth: 1,
    borderRadius: 10,
    padding: spacing.md,
    minHeight: 100,
  },
  placeholderContainer: {
    position: "absolute",
    top: spacing.md,
    left: spacing.md,
    right: spacing.md * 2,
  },
  placeholderText: {
    fontSize: 16,
    lineHeight: 22, 
  },
  placeholderHint: { 
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2,
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