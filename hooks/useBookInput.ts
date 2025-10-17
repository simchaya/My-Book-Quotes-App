/**
 * useBookInput.ts
 * ----------------
 * Custom React hook that encapsulates all logic for the Book Input Form.
 * 
 * Responsibilities:
 * - Manages local state for title, quote, and coverUri.
 * - Handles camera permissions and image capture via expo-image-picker.
 * - Validates user input before saving.
 * - Calls the external onSave callback provided by the parent.
 * 
 * This separation keeps BookInputForm.tsx purely presentational,
 * improves testability, and follows the principle of separation of concerns.
 */

import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";
import { useCallback, useState } from "react";
import { Alert } from "react-native";

export const useBookInput = (
  onSave: (title: string, quote: string, coverUri?: string) => void
) => {
  const [title, setTitle] = useState("");
  const [quote, setQuote] = useState("");
  const [coverUri, setCoverUri] = useState<string | null>(null);

  const handlePickCover = useCallback(async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Camera access is needed to capture a book cover photo."
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.7,
    });

    if (!result.canceled) setCoverUri(result.assets[0].uri);
  }, []);

  const handleSave = useCallback(() => {
    const t = title.trim();
    const q = quote.trim();
    if (!t || !q) {
      Alert.alert("Missing Information", "Please fill in both fields.");
      return;
    }

    onSave(t, q, coverUri ?? undefined);
    setTitle("");
    setQuote("");
    setCoverUri(null);
  }, [title, quote, coverUri, onSave]);
  
  const OCR_FUNCTION_URL =
  "https://us-central1-capstone-475218.cloudfunctions.net/ocrHandler";

async function handleOcrFromImage() {
  try {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Photo library access is needed.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1.0,
      mediaTypes: "images",
    });

    if (result.canceled || !result.assets?.[0]?.uri) return;
    const uri = result.assets[0].uri;

    const base64 = await FileSystem.readAsStringAsync(uri, { encoding: "base64" });

    const response = await fetch(OCR_FUNCTION_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: base64 }),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    if (data.quoteText) {
      setQuote((prev: string) => prev + data.quoteText);
    } else {
      Alert.alert("No text detected", "Try cropping closer to the text.");
    }
  } catch (err) {
    console.error("OCR Error:", err);
    Alert.alert("Error", "OCR processing failed. See console for details.");
  }
}

return {
  title,
  setTitle,
  quote,
  setQuote,
  coverUri,
  handlePickCover,
  handleSave,
  handleOcrFromImage,
};
};
