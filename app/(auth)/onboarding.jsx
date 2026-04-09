// app/(auth)/onboarding.jsx
// Pantalla de onboarding: el usuario elige si es civil o conductor.
// Al elegir, se guarda el rol en la tabla `profiles` de Supabase
// y el _layout.tsx detecta el cambio y redirige a la app principal.
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "../../lib/supabase";

const ROLES = [
  {
    id: "civil",
    titulo: "Soy civil",
    descripcion: "Necesito solicitar una ambulancia en caso de emergencia.",
    icono: "🧑",
  },
  {
    id: "conductor",
    titulo: "Soy conductor",
    descripcion: "Conduzco una ambulancia y atiendo emergencias.",
    icono: "🚑",
  },
];

export default function OnboardingScreen() {
  const [rolSeleccionado, setRolSeleccionado] = useState(null);
  const [cargando, setCargando] = useState(false);
  const router = useRouter();

  async function handleConfirmar() {
    if (!rolSeleccionado) {
      Alert.alert("Selecciona un rol", "Elige si eres civil o conductor para continuar.");
      return;
    }

    setCargando(true);

    // Obtenemos el usuario actual de la sesión activa
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      Alert.alert("Error", "No se encontró el usuario. Intenta iniciar sesión de nuevo.");
      setCargando(false);
      return;
    }

    // Guardamos el perfil en la tabla `profiles`
    // upsert: si ya existe una fila con este id, la actualiza; si no, la crea.
    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      role: rolSeleccionado,
      full_name: user.user_metadata?.full_name ?? null,
    });

    setCargando(false);

    if (error) {
      Alert.alert("Error", "No se pudo guardar tu perfil. Intenta de nuevo.\n\n" + error.message);
      return;
    }

    // El _layout.tsx volverá a cargar el perfil via onAuthStateChange,
    // pero como el auth no cambió, lo forzamos navegando directamente.
    router.replace("/(app)/");
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>¿Cuál es tu rol?</Text>
        <Text style={styles.subtitulo}>
          Esto personalizará tu experiencia en la app.{"\n"}Podrás cambiarlo más adelante.
        </Text>
      </View>

      <View style={styles.opciones}>
        {ROLES.map((rol) => {
          const seleccionado = rolSeleccionado === rol.id;
          return (
            <TouchableOpacity
              key={rol.id}
              style={[styles.tarjeta, seleccionado && styles.tarjetaSeleccionada]}
              onPress={() => setRolSeleccionado(rol.id)}
              activeOpacity={0.8}
            >
              <Text style={styles.icono}>{rol.icono}</Text>
              <View style={styles.tarjetaTexto}>
                <Text style={[styles.tarjetaTitulo, seleccionado && styles.textoSeleccionado]}>
                  {rol.titulo}
                </Text>
                <Text style={styles.tarjetaDescripcion}>{rol.descripcion}</Text>
              </View>
              {seleccionado && <Text style={styles.check}>✓</Text>}
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity
        style={[
          styles.boton,
          !rolSeleccionado && styles.botonDeshabilitado,
          cargando && styles.botonDeshabilitado,
        ]}
        onPress={handleConfirmar}
        disabled={!rolSeleccionado || cargando}
      >
        {cargando ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.botonTexto}>Continuar</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  header: {
    marginBottom: 32,
  },
  titulo: {
    fontSize: 28,
    fontWeight: "700",
    color: "#222",
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  opciones: {
    gap: 16,
    marginBottom: 32,
  },
  tarjeta: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e0e0e0",
    gap: 16,
  },
  tarjetaSeleccionada: {
    borderColor: "#d32f2f",
    backgroundColor: "#fff5f5",
  },
  icono: {
    fontSize: 36,
  },
  tarjetaTexto: {
    flex: 1,
    gap: 4,
  },
  tarjetaTitulo: {
    fontSize: 17,
    fontWeight: "600",
    color: "#222",
  },
  textoSeleccionado: {
    color: "#d32f2f",
  },
  tarjetaDescripcion: {
    fontSize: 13,
    color: "#777",
    lineHeight: 18,
  },
  check: {
    fontSize: 20,
    color: "#d32f2f",
    fontWeight: "700",
  },
  boton: {
    backgroundColor: "#d32f2f",
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
  },
  botonDeshabilitado: {
    opacity: 0.4,
  },
  botonTexto: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
