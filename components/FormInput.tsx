/**
 * FormInput.tsx
 * --------------
 * A reusable input component that pairs a label with a styled TextInput.
 * 
 * Responsibilities:
 * - Enforces consistent typography, spacing, and theming across all text inputs.
 * - Supports both single-line and multiline fields.
 * - Accepts a forwarded ref for focus control (useful in forms).
 * 
 * This component simplifies forms by abstracting repetitive input styling logic.
 */

import React, { forwardRef } from "react";
import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";
import { spacing, typography, useThemeColors } from "@/utils";

interface FormInputProps extends TextInputProps {
  label: string;
}

const FormInput = forwardRef<TextInput, FormInputProps>(
  ({ label, style, multiline, ...rest }, ref) => {
    const colors = useThemeColors();
    return (
      <View style={styles.container}>
        <Text style={[typography.callout, styles.label, { color: colors.secondaryText }]}>
          {label}
        </Text>
        <TextInput
          ref={ref}
          style={[
            typography.body,
            styles.input,
            multiline && styles.multilineInput,
            {
              borderColor: colors.border,
              color: colors.text,
              backgroundColor: colors.background,
            },
            style,
          ]}
          placeholderTextColor={colors.placeholder}
          textAlignVertical={multiline ? "top" : "center"}
          {...rest}
        />
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: { marginBottom: spacing.md },
  label: { marginBottom: spacing.xs, fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: spacing.md,
  },
  multilineInput: { minHeight: 100 },
});

export default FormInput;
