import { useRouter } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { typography, useThemeColors, spacing } from "../../utils/theme";


export default function AboutScreen() {
  const router = useRouter();
  const colors = useThemeColors(); // shared theme

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      {/* inspirational app vision + instructions */}
<View style={{ marginBottom: spacing.lg }}>
  <Text style={[typography.body, { color: colors.text, textAlign: "justify", marginBottom: spacing.xs }]}>
    1. Scroll through a book
  </Text>
  <Text style={[typography.body, { color: colors.text, textAlign: "justify", marginBottom: spacing.xs }]}>
    2. Find a quote that speaks to you
  </Text>
  <Text style={[typography.body, { color: colors.text, textAlign: "justify" }]}>
    3. Save it here
  </Text>
</View>
<Text
  style={[
    typography.body,
    {
      color: colors.secondaryText,
      textAlign: "justify",
      marginBottom: spacing.lg,
      fontStyle: "italic",
    },
  ]}
>
  You'll be surprised — this habit will inspire you to read more books...
 
</Text>

      {/* profile photo */}
      <Image
        source={require("../../assets/images/about-photo.jpg")}
        style={styles.photo}
        resizeMode="cover"
      />

      {/* secondary inspirational line */}
      <Text
        style={[
          typography.body,
          {
            color: colors.secondaryText,
            textAlign: "center",
            marginBottom: spacing.lg, // 24
            fontStyle: "italic",
          },
        ]}
      >
        “In a world of endless scrolling, this is a place for slow reading, for
        words worth keeping...” ChatGPT
      </Text>

      {/* navigation button */}
      <Pressable
        style={[styles.button, { backgroundColor: colors.buttonBg }]}
        onPress={() => router.push("/+not-found")}
        accessibilityRole="button"
      >
        <Text style={[typography.body, styles.buttonText, { color: colors.buttonText }]}>
          Discover Quotes
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
    padding: spacing.lg,     // 24
    paddingTop: spacing.xxl, // 48
  },
  photo: {
    width: 220,
    height: 160,
    borderRadius: 20,
    marginBottom: spacing.md, // 16
  },
  button: {
    borderRadius: 10,
    paddingVertical: spacing.md,   // 16
    paddingHorizontal: spacing.lg, // 24
    alignItems: "center",
    marginTop: spacing.lg,         // 24
  },
  buttonText: { fontWeight: "600" },
});
