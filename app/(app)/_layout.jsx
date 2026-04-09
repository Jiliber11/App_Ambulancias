// app/(app)/_layout.jsx
// Layout de la app principal (pantallas post-autenticación).
import { Stack } from "expo-router";

export default function AppLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
