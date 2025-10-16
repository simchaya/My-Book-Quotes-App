// components/BookInputForm.tsx

import * as ImagePicker from "expo-image-picker";
// 1. ADD Legacy FileSystem Import for reliable Base64 conversion
import * as FileSystem from 'expo-file-system/legacy';
import React, { useState } from "react";
import {
  ActivityIndicator,
  // 2. ADD Alert and ActivityIndicator for user feedback/loading
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { spacing, typography, useThemeColors } from "@/utils"; // using consolidated index

// 3. ADD OCR FUNCTION URL
const OCR_FUNCTION_URL = "https://us-central1-capstone-475218.cloudfunctions.net/ocrHandler";

// Refactoring // NEW: Component definition and prop typing
interface BookInputFormProps {
  onSave: (title: string, quote: string, coverUri?: string) => void;
}


// Refactoring // NEW: Functional component definition, receiving 'onSave'
const BookInputForm: React.FC<BookInputFormProps> = ({ onSave }) => {
  const [title, setTitle] = useState("");
  const [quote, setQuote] = useState("");
  const [coverUri, setCoverUri] = useState<string | null>(null);
  // 4. ADD OCR STATE: only need loading status
  const [isOcrLoading, setIsOcrLoading] = useState(false);
  const colors = useThemeColors();

  // Refactoring // Pick photo from camera (Logic MOVED from index.tsx)
  const handlePickCover = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      // FIX: Replaced banned alert()
      Alert.alert("Permission Required", "Camera permission is required to take a photo");
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
  
  // 5. NEW: Unified function to SELECT photo from library AND immediately process it for OCR
  // Reverting to Image Library launch to allow manual cropping (highlighting).
  const handleSelectAndOcrQuote = async () => {
    // Request media library permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Required", "Media Library permission is required to select a photo for OCR.");
      return;
    }

    // Launch the Image Library (Gallery) instead of the Camera
    const photoResult = await ImagePicker.launchImageLibraryAsync({
      // CRITICAL FIX: Re-enabling allowsEditing here. For library selection, 
      // this enables the manual zoom/pan crop tool, which allows the user to 
      // precisely frame the text line, solving the focus/gibberish problem.
      allowsEditing: true, 
      quality: 1.0, // Max quality for best OCR results
      aspect: [16, 3], // Requested ratio for wide text, but manual selection is the key
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (photoResult.canceled || !photoResult.assets[0].uri) {
        console.log("[OCR DEBUG] Photo selection was cancelled or failed.");
        return;
    }

    // NEW LOGGING: Confirm the dimensions after cropping/selection check
    const asset = photoResult.assets[0];
    console.log(`[OCR DEBUG] Photo URI: ${asset.uri}`);
    if (asset.width && asset.height) {
        // NOTE: This will now show the dimensions of the cropped area selected by the user.
        console.log(`[OCR DEBUG] Cropped Image Dimensions: ${asset.width}x${asset.height} (Aspect Ratio: ${(asset.width / asset.height).toFixed(2)})`);
    } else {
        console.log("[OCR DEBUG] Image dimensions unavailable or not set by picker.");
    }
    
    // Start OCR process immediately
    await handleOcrQuote(asset.uri);
  };
  
  // 6. NEW: Minimal OCR Processing Logic
  const handleOcrQuote = async (uri: string) => {
    setIsOcrLoading(true);

    try {
        // Use FileSystem for robust Base64 conversion
        const rawBase64 = await FileSystem.readAsStringAsync(uri, {
            encoding: 'base64', 
        });

        // We are sending the rawBase64 without the header, as previously decided.
        const base64ToSend = rawBase64; 

        // CRITICAL DEBUG LOGGING: Check the size of the Base64 string before sending
        console.log("Base64 string size before sending (raw):", rawBase64.length); 


        // 7. Call Cloud Function with correct payload key ('image')
        const response = await fetch(OCR_FUNCTION_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // USE THE RAW STRING
            body: JSON.stringify({ image: base64ToSend }), 
        });

        // NEW LOGGING: Log the raw response status
        console.log(`[OCR DEBUG] Cloud Function Response Status: ${response.status}`);

        if (!response.ok) {
            const errorBody = await response.text();
            // ENHANCED ERROR: Show the status code
            throw new Error(`OCR service failed with status: ${response.status}. Response: ${errorBody}`);
        }

        const data = await response.json();

        // 8. CRITICAL FIX: The Cloud Function returns text under the 'quoteText' key.
        if (data.quoteText) {
            // Success: Append the OCR result to the current quote
            setQuote(currentQuote => currentQuote + data.quoteText);
            // UX IMPROVEMENT: Remove success alert for smoother flow
            // Alert.alert("Success", "Text extracted and added to quote field.");
        } else {
            // Log for deeper inspection if the failure is truly no-text-detected
            console.log("OCR response received, but no text found:", data);
            Alert.alert("OCR Failed", "No text detected in the image.");
        }

    } catch (error) {
        console.error("OCR Error:", error);
        Alert.alert("Error", "OCR processing failed. Check console for details.");
    } finally {
        setIsOcrLoading(false);
    }
  };

  // Refactoring // Handle saving new quote (Logic MOVED from indec.tsx, one line changed)
  const handleSaveQuote = () => {
    if (!title.trim() || !quote.trim()) {
        // FIX: Replaced banned alert()
        Alert.alert("Missing Input", "Please enter both a title and a quote.");
        return;
    }
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
          styles.titleText,
          { color: colors.text },
        ]}
      >
        MarkItDown
      </Text>

      <Text
        style={[
          typography.callout,
          styles.subtitleText,
          {
            color: colors.secondaryText,
          },
        ]}
      >
        to be kept forever.
      </Text>

      {/* Book Title input */}
      <Text
        style={[
          typography.body,
          styles.label,
          { color: colors.secondaryText},
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
          styles.label,
          { color: colors.secondaryText},
        ]}
      >
        Favorite Quote
      </Text>
      
      {/* 9. Wrap TextInput in a View for absolute positioning of the icon */}
      <View style={styles.quoteInputContainer}>
        <TextInput
          style={[
            styles.input,
            styles.quoteInput, // NEW: Added minHeight and alignment styles
            {
              borderColor: colors.border,
              color: colors.text,
              backgroundColor: colors.background,
              paddingRight: 50, // Make room for the camera icon
            },
          ]}
          placeholder="Favorite Quote"
          placeholderTextColor={colors.placeholder}
          value={quote}
          onChangeText={setQuote}
          multiline
          textAlignVertical="top"
        />

        {/* 10. Camera Icon Button for OCR, positioned absolutely */}
        <Pressable
            // Call the new function for library selection/cropping
            onPress={handleSelectAndOcrQuote}
            disabled={isOcrLoading}
            style={({ pressed }) => [
                styles.cameraIconContainer,
                { opacity: pressed || isOcrLoading ? 0.6 : 1 },
            ]}
            // Updated label and icon to reflect selection from library
            accessibilityLabel="Select photo for quote OCR" 
        >
            {isOcrLoading ? (
                <ActivityIndicator color={colors.secondaryText} size="small" />
            ) : (
                // Changed to document (📄) emoji to indicate selection
                <Text style={{ fontSize: 24, color: colors.secondaryText }}>
                    📄
                </Text>
            )}
        </Pressable>
      </View>


      {/* REFACTORING: Take Photo button (style key updated) */}
      <Pressable
        style={({ pressed }) => [
            styles.actionButton, 
            { 
                backgroundColor: colors.card,
                opacity: pressed ? 0.7 : 1,
            }
        ]}
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
        style={({ pressed }) => [
            styles.actionButton, 
            { 
                backgroundColor: colors.buttonBg,
                opacity: pressed ? 0.7 : 1,
            }
        ]}
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
    // title styles
    titleText: {
      textAlign: "center",
        fontWeight: "700", // visually strong, but not all-caps
        marginBottom: spacing.xs, // small separation from subtitle
    },
  // subtitle styles
  subtitleText: {
    textAlign: "center",
    fontStyle: "italic",
    marginBottom: spacing.lg,
    letterSpacing: 0.3, // gentle openness
  },
    // label styles
    label: {
      marginBottom: spacing.xs,
    },
  // Refactoring: MOVED: input style is identical
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  // NEW: Container for TextInput and Camera Icon
  quoteInputContainer: {
    marginBottom: spacing.md,
  },
  // NEW: Adjusted style for multiline quote input
  quoteInput: {
    minHeight: 100,
    paddingTop: spacing.md, // Ensure text starts at the top
  },
  // NEW: Absolute positioning for camera icon
  cameraIconContainer: {
    position: 'absolute',
    top: 10, // Position from the top (align with the first line of input text)
    right: 10, // Position from the right
    padding: spacing.xs,
    zIndex: 1, // Ensure it's above the TextInput
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
