// app/login.tsx (FIREBASE VERSION)
import { useAuthContext } from "@/context/AuthContext";
import { useState } from "react";
import { ActivityIndicator, Button, StyleSheet, Text, View } from "react-native";

export default function LoginScreen() {
  const { signIn } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await signIn();
    } catch (err: any) {
      setError(err.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign in to MarkItDown</Text>
      
      {error && <Text style={styles.error}>{error}</Text>}
      
      {loading ? (
        <ActivityIndicator size="large" color="#4285F4" />
      ) : (
        <Button
          title="Sign in with Google"
          onPress={handleSignIn}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: "600",
  },
  error: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
});