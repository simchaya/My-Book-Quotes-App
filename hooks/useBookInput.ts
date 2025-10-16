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

import * as ImagePicker from "expo-image-picker";
import { useState, useCallback } from "react";
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

  return { title, setTitle, quote, setQuote, coverUri, handlePickCover, handleSave };
};
