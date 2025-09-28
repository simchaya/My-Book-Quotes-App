/* eslint-disable react/no-unescaped-entities */
import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { typography, useThemeColors } from "../utils/theme";

export default function NotFoundScreen() {
  const colors = useThemeColors(); // shared theme

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      {/*keeps nav bar with title */}
      <Stack.Screen options={{ title: "Not Found" }} />

      <View style={styles.container}>
        <Text
          style={[
            typography.largeTitle,
            { color: colors.text, textAlign: "center", marginBottom: 15 },
          ]}
        >
          Page Not Found
        </Text>

        <Text
          style={[
            typography.body,
            {
              color: colors.secondaryText,
              textAlign: "center",
              marginBottom: 30,
            },
          ]}
        >
          The page you're looking for doesn't exist. You can return to the home
          screen below.
        </Text>

        {/* home navigation button (web safe) */}
        <Link href="/" style={{ textDecorationLine: "none" }}>
          <View style={[styles.button, { backgroundColor: colors.buttonBg }]}>
            <Text
              style={[
                typography.body,
                styles.buttonText,
                { color: colors.buttonText },
              ]}
            >
              Go Home
            </Text>
          </View>
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1, // ⬅️ fill screen
  },
  container: {
    flex: 1,                 // fill space inside safe area
    justifyContent: "center",// vertical center
    alignItems: "center",    // horizontal center
    padding: 20,
  },
  button: {
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: "center",
    minWidth: 160,
  },
  buttonText: {
    fontWeight: "600",
    textAlign: "center",
  },
});
