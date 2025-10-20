// app/(tabs)/_layout.tsx (CORRECTED)

import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "blue", // You can customize this
      }}
    >
      <Tabs.Screen
        name="index" // Links to app/(tabs)/index.tsx
        options={{
          title: "Books",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="about" // ⬅️ CRITICAL FIX: The name must match the file: about.tsx
        options={{
          title: "Explore", // The display title can remain "Explore"
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="rocket-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}