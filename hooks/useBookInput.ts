/**
 * useBookInput.ts
 * ----------------
 * Custom React hook that encapsulates all logic for the Book Input Form.
 */

import { fetchBookCover } from "@/utils/fetchBookCover"; // NEW: Helper for automatic cover fetching
import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";

export const useBookInput = (
  onSave: (title: string, quote: string, coverUri?: string) => void
) => {
  const [title, setTitle] = useState("");
  const [quote, setQuote] = useState("");
  const [coverUri, setCoverUri] = useState<string | null>(null);

  const [isOcrLoading, setIsOcrLoading] = useState(false);
  const [isTitleOcrLoading, setIsTitleOcrLoading] = useState(false);

  // ------------------------------------------
  // NEW: Auto-fetch book cover when title changes
  // ------------------------------------------
  useEffect(() => {
    if (!title) return;

    const delay = setTimeout(async () => {
      try {
        const fetchedCover = await fetchBookCover(title);
        if (fetchedCover && fetchedCover !== coverUri) {
          setCoverUri(fetchedCover);
        }
      } catch (err) {
        console.warn("Auto-cover fetch failed:", err);
      }
    }, 800); // debounce delay

    return () => clearTimeout(delay);
  }, [title]);

  // ------------------------------------------
  // Handle manual photo capture (still available)
  // ------------------------------------------
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

    if (result.canceled || !result.assets?.[0]?.uri) return;
    setCoverUri(result.assets[0].uri);
  }, []);

  // ------------------------------------------
  // Handle save logic
  // ------------------------------------------
  const handleSave = useCallback(() => {
    if (!title.trim() || !quote.trim()) {
      Alert.alert("Missing Fields", "Please enter both a title/author and a quote.");
      return;
    }

    onSave(title, quote, coverUri ?? undefined);
    setTitle("");
    setQuote("");
    setCoverUri(null);
  }, [title, quote, coverUri, onSave]);

  // ------------------------------------------
  // OCR Logic (Cloud Function integration)
  // ------------------------------------------
  const OCR_FUNCTION_URL =
    "https://us-central1-capstone-475218.cloudfunctions.net/ocrHandler";

  // OCR for Book Title / Author
  async function handleOcrFromTitleImage() {
    try {
      setIsTitleOcrLoading(true);
      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Permission required", "Photo library access is needed.");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 1.0,
        aspect: [3, 4],
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
        setTitle((prev: string) => prev + data.quoteText);
      } else {
        Alert.alert("No text detected", "Try cropping closer to the text.");
      }
    } catch (err) {
      console.error("Title OCR Error:", err);
      Alert.alert("Error", "OCR processing failed for title.");
    } finally {
      setIsTitleOcrLoading(false);
    }
  }

  // OCR for Quote Text
  async function handleOcrFromImage() {
    try {
      setIsOcrLoading(true);
      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Permission required", "Photo library access is needed.");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 1.0,
        aspect: [3, 4],
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
    } finally {
      setIsOcrLoading(false);
    }
  }

  // ------------------------------------------
  // Return hook API
  // ------------------------------------------
  return {
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
  };
};
