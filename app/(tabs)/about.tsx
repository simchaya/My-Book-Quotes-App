import { useRouter } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { typography, useThemeColors, spacing } from "../../utils/theme";

export default function AboutScreen() {
  const router = useRouter();
  const colors = useThemeColors();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* App Title */}
        <Text style={[typography.largeTitle, { color: colors.text, marginBottom: spacing.xs }]}>
          MarkItDown
        </Text>

        <Text style={[typography.callout, styles.subtitle, { color: colors.secondaryText }]}>
          to be kept forever.
        </Text>

        {/* What it does */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[typography.title2, { color: colors.text, marginBottom: spacing.md }]}>
            What is MarkItDown?
          </Text>
          <Text style={[typography.body, { color: colors.text }]}>
            MarkItDown helps you capture and organize your favorite book quotes.
            Snap a photo of your book cover, use the camera to capture quotes with
            automatic text recognition, and add your personal thoughts—all in one place.
          </Text>
        </View>

        {/* How it works */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[typography.title2, { color: colors.text, marginBottom: spacing.md }]}>
            How it works
          </Text>

          <View style={styles.step}>
            <Text style={[typography.body, { color: colors.text }]}>
              1. Add your book
            </Text>
            <Text style={[typography.body, { color: colors.secondaryText, marginTop: spacing.xs }]}>
              Snap a photo of the cover—title and author fill automatically
            </Text>
          </View>

          <View style={styles.step}>
            <Text style={[typography.body, { color: colors.text }]}>
              2. Capture quotes
            </Text>
            <Text style={[typography.body, { color: colors.secondaryText, marginTop: spacing.xs }]}>
              Use your camera to instantly extract text from any page
            </Text>
          </View>

          <View style={styles.step}>
            <Text style={[typography.body, { color: colors.text }]}>
              3. Add your thoughts
            </Text>
            <Text style={[typography.body, { color: colors.secondaryText, marginTop: spacing.xs }]}>
              Write notes to remember why each quote matters to you
            </Text>
          </View>

          <View style={styles.step}>
            <Text style={[typography.body, { color: colors.text }]}>
              4. Read more intentionally
            </Text>
            <Text style={[typography.body, { color: colors.secondaryText, marginTop: spacing.xs }]}>
              Knowing you can save great moments makes you notice them more
            </Text>
          </View>
        </View>

        {/* Profile photo */}
        <Image
          source={require("../../assets/images/about-photo.jpg")}
          style={styles.photo}
          resizeMode="cover"
        />

        {/* About the developer */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[typography.title2, { color: colors.text, marginBottom: spacing.md }]}>
            About the Developer
          </Text>
          <Text style={[typography.body, { color: colors.text, marginBottom: spacing.md }]}>
            I love reading, but I kept losing track of the quotes that moved me.
            This app is my solution—a simple way to capture beautiful words and
            engage more deeply with every book I read.
          </Text>
          <Text style={[typography.body, { color: colors.secondaryText }]}>
            Built with love for book lovers everywhere
          </Text>
        </View>

        {/* Tech stack */}
        <Text style={[typography.caption, { color: colors.secondaryText, marginBottom: spacing.xl }]}>
          React Native • Expo • SQLite • Google Cloud Vision
        </Text>

        {/* Primary action button */}
        <Pressable
          style={[styles.button, { backgroundColor: colors.buttonBg }]}
          onPress={() => router.push("/")}
          accessibilityRole="button"
        >
          <Text style={[typography.body, { color: colors.buttonText }]}>
            Start Capturing Quotes
          </Text>
        </Pressable>

        {/* Secondary button */}
        <Pressable
          style={styles.secondaryButton}
          onPress={() => router.push("/+not-found")}
          accessibilityRole="button"
        >
          <Text style={[typography.body, { color: colors.secondaryText }]}>
            Discover Quotes (Coming Soon)
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    alignItems: "center",
    padding: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  section: {
    width: "100%",
    marginBottom: spacing.xl,
  },
  card: {
    width: "100%",
    padding: spacing.lg,
    borderRadius: 16,
    marginBottom: spacing.lg,
  },
  step: {
    marginBottom: spacing.md,
  },
  photo: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginVertical: spacing.lg,
  },
  subtitle: {
    textAlign: "center",
    fontStyle: "italic",
    marginBottom: spacing.lg,
    letterSpacing: 0.3,
  },
  button: {
    width: "100%",
    borderRadius: 12,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
    marginTop: spacing.md,
  },
  secondaryButton: {
    width: "100%",
    borderRadius: 12,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
    marginTop: spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#C7C7CC",
  },

});