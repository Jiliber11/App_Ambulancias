// app/(app)/index.jsx
// Pantalla principal placeholder — se desarrollará en sprints siguientes.
import { useRouter } from "expo-router";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { supabase } from "../../lib/supabase";

export default function HomeScreen() {
  const router = useRouter();

  async function handleLogout() {
    Alert.alert("Cerrar sesión", "¿Seguro que quieres salir?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Salir",
        style: "destructive",
        onPress: async () => {
          await supabase.auth.signOut();
          // _layout.tsx detecta el logout y redirige a login automáticamente
        },
      },
    ]);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🚑</Text>
      <Text style={styles.titulo}>¡Bienvenido!</Text>
      <Text style={styles.subtitulo}>
        La app principal se implementará en los próximos sprints.
      </Text>

      <TouchableOpacity style={styles.boton} onPress={handleLogout}>
        <Text style={styles.botonTexto}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    gap: 12,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 8,
  },
  titulo: {
    fontSize: 26,
    fontWeight: "700",
    color: "#222",
  },
  subtitulo: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
  },
  boton: {
    marginTop: 32,
    backgroundColor: "#d32f2f",
    borderRadius: 10,
    paddingVertical: 13,
    paddingHorizontal: 32,
  },
  botonTexto: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
});
