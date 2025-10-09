// components/SwipeDeleteButton.tsx

import React from 'react';
import { Pressable, StyleSheet, Text, Alert } from 'react-native'; // Refactor // NEW: Added StyleSheet
import { spacing } from '@/utils'; // Refactor // NEW: Adjusted import path

// Refactor // NEW: Prop interface for typing
interface SwipeDeleteButtonProps {
    onPress: () => void; // void specifies that the function passed via the onPress prop does not retuen any meaningful value
}

// Refactor //  NEW: Component definition
const SwipeDeleteButton = ({ onPress }: SwipeDeleteButtonProps) => {

    // Function to handle the press and show the confirmation alert
    const handleDeletePress = () => {
        Alert.alert(
            "Confirm Deletion", // Title
            "Are you sure you want to delete this book and all its quotes?", // Message
            [
                // Option 1: Cancel (does nothing)
                {
                    text: "Cancel",
                    style: "cancel"
                },
                // Option 2: Delete (calls the actual delete function)
                {
                    text: "Delete",
                    style: "destructive", // Shows the button in red/warning color
                    onPress: onPress     // Executes the prop function (removeBook)
                }
            ],
            { cancelable: true } // Allows tapping outside the alert to close it
        );
    };

    return (
        <Pressable
            // Refactor // CHANGED: Replaced long inline style with styles.hiddenButton
            style={styles.hiddenButton}
            // Use the confirmation handler
            onPress={handleDeletePress}
        >
            {/* Refactor// CHANGED: Replaced inline style with styles.text */}
            <Text style={styles.text}>Delete</Text>
        </Pressable>
    );
};

// Refactor // NEW: Dedicated StyleSheet block
const styles = StyleSheet.create({
    // Refactor // MOVED & CHANGED: Extracted all inline styles from App/index.tsx
    hiddenButton: {
        flex: 1,
        justifyContent: "center",
        alignItems: "flex-end",
        backgroundColor: "red",
        paddingRight: spacing.md,
        borderRadius: 12,
        marginBottom: spacing.lg, // Refactor //Critical for alignment with BookListItem
    },
    // Refactor // MOVED & CHANGED: Extracted inline styles for text
    text: {
        color: "white",
        fontWeight: "600"
    },
});

export default SwipeDeleteButton;