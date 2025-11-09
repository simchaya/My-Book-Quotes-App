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
            MarkItDown will help you re-establish your relationship with printed books 
            by chasing after meaningful quotes in a fun and easy way.
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
            Write notes to remember why each quote moved you—creating your own little diary of meaningful moments
            </Text>
          </View>

          <View style={styles.step}>
            <Text style={[typography.body, { color: colors.text }]}>
              4. Read more intentionally
            </Text>
            <Text style={[typography.body, { color: colors.secondaryText, marginTop: spacing.xs }]}>
            Chasing just one quote makes opening that unread book easy. 
            You might find yourself lost in its pages—at home, at work, or wherever life takes you.
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
          I'm Simcha, and I love books! I love reading from a hard copy, seeing them on my nightstand and shelves.
          But between my young family, work and screens, I wasn't reading nearly as much as I wanted to. 
          So I built MarkItDown — to help myself (and fellow bookworms everywhere) read more.
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