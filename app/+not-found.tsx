import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NotFoundScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ title: "Oops!" }} />

      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>😱</Text>
        </View>

        <Text style={styles.errorTitle}>Oops! Page Not Found</Text>
        <Text style={styles.description}>
          The page you're looking for doesn't exist. But don’t worry, we'll help
          you get back on track!
        </Text>

        <Link href="/" style={styles.button}>
          <Text style={styles.buttonText}>Take Me Home</Text>
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F99410",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
  },
  iconContainer: {
    marginBottom: 20,
  },
  icon: {
    fontSize: 60,
    textAlign: "center",
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
    color: "black",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginHorizontal: 20,
    marginBottom: 20,
    lineHeight: 22,
    color: "black",
  },
  button: {
    backgroundColor: "#DFF4F6",
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 90,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.9,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
