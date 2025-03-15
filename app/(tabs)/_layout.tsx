// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: "Game" }} />
      <Tabs.Screen name="shop" options={{ title: "Shop" }} />
      <Tabs.Screen name="realestate" options={{ title: "Real Estate" }} />
      <Tabs.Screen name="garden" options={{ title: "Garden" }} />
      <Tabs.Screen name="cats" options={{ title: "Cats" }} />
    </Tabs>
  );
}