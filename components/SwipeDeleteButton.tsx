import React from "react";
import { Pressable, StyleSheet, Text, Alert, View } from "react-native";
import { spacing } from "@/utils";

interface SwipeDeleteButtonProps {
  onPress: () => void;
}

const SwipeDeleteButton = ({ onPress }: SwipeDeleteButtonProps) => {
  const handleDeletePress = () => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this book and all its quotes?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.hiddenContainer}>
      <Pressable onPress={handleDeletePress} style={styles.pressable}>
        <Text style={styles.text}>Delete</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  hiddenContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
    backgroundColor: "red",
    paddingRight: spacing.md,
    borderRadius: 12,
    // FIX: removed marginBottom and added absolute fill so it stays perfectly under row
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
  pressable: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  text: {
    color: "white",
    fontWeight: "600",
  },
});

export default SwipeDeleteButton;
