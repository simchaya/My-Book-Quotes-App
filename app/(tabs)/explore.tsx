import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { typography, useThemeColors } from "../../utils/theme";

export default function ExploreScreen() {
  const router = useRouter();
  const colors = useThemeColors(); // shared theme

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <Text style={[typography.largeTitle, { color: colors.text, marginBottom: 8 }]}>
        Explore
      </Text>

      <Text style={[typography.body, { color: colors.secondaryText, textAlign: "center", marginBottom: 20 }]}>
        This tab is ready for future enhancements.
      </Text>

      {/* navigation button */}
      <Pressable
        style={[styles.button, { backgroundColor: colors.buttonBg }]}
        onPress={() => router.push("/+not-found")}
        accessibilityRole="button"
      >
        <Text style={[typography.body, styles.buttonText, { color: colors.buttonText }]}>
          Trigger Not Found
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  button: {
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  buttonText: { fontWeight: "600" },
});
