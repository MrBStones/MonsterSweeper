import { Stack } from "expo-router";

const bgColor = "#25292e";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: bgColor },
        headerTintColor: "#fff",
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: "Home", headerShown: false }}
      />
      <Stack.Screen
        name="about"
        options={{ title: "Test", gestureEnabled: false }}
      />
    </Stack>
  );
}
