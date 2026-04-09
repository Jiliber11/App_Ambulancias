// app/(auth)/_layout.jsx
// Este layout envuelve todas las pantallas de autenticación (login, registro).
// Usa Stack para que haya una transición natural entre login y registro.
import { Stack } from "expo-router";

export default function AuthLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
