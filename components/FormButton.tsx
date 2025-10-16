/**
 * FormButton.tsx
 * ---------------
 * A reusable, theme-aware button component with primary and secondary variants.
 *
 * Responsibilities:
 * - Provides consistent padding, border radius, and typography for all buttons.
 * - Supports visual feedback (press and disabled states) following Apple HIG.
 * - Uses theme-based colors for both background and text.
 *
 * Implementation Notes:
 * - The Pressable `style` prop expects either a plain StyleProp<ViewStyle>
 *   or a function returning one. Mixing both (arrays containing functions)
 *   causes TypeScript inference errors, so I explicitly define a callback
 *   `getButtonStyle` that returns a valid typed style array.
 *
 * - This pattern ensures full type safety while preserving dynamic press feedback.
 */

import { spacing, typography, useThemeColors } from "@/utils";
import React from "react";
import {
    Pressable,
    PressableProps,
    StyleProp,
    StyleSheet,
    Text,
    ViewStyle,
} from "react-native";

interface FormButtonProps extends PressableProps {
  /** Text to display inside the button */
  title: string;
  /** Visual style variant: primary (action) or secondary (neutral) */
  variant?: "primary" | "secondary";
  /** Optional disabled state */
  disabled?: boolean;
}

const FormButton: React.FC<FormButtonProps> = ({
  title,
  variant = "primary",
  disabled,
  style,
  ...rest
}) => {
  const colors = useThemeColors();
  const isPrimary = variant === "primary";

  /**
   * TypeScript-safe callback for dynamic Pressable styling.
   * We explicitly type the parameter and return type to ensure compatibility
   * with `PressableProps.style` (which expects a function returning StyleProp<ViewStyle>).
   */
  const getButtonStyle = ({ pressed }: { pressed: boolean }): StyleProp<ViewStyle> => [
    styles.base,
    isPrimary
      ? { backgroundColor: colors.buttonBg }
      : { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
    pressed && { opacity: 0.85 },
    disabled && { opacity: 0.5 },
    style as StyleProp<ViewStyle>,
  ];

  return (
    <Pressable
      disabled={disabled}
      style={getButtonStyle}
      accessibilityRole="button"
      {...rest}
    >
      <Text
        style={[
          typography.body,
          styles.text,
          isPrimary ? { color: colors.buttonText } : { color: colors.secondaryText },
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 10,
    paddingVertical: spacing.md,
    alignItems: "center",
    marginBottom: spacing.md,
  },
  text: { fontWeight: "600" },
});

export default FormButton;
