// app/_layout.tsx
// Layout raíz: decide a dónde mandar al usuario según su estado de autenticación.
// Flujo:
//   Sin sesión            → (auth)/login
//   Con sesión, sin perfil → (auth)/onboarding
//   Con sesión, con perfil → (app)/

import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";


export default function RootLayout() {
  const [session, setSession] = useState(null);
  // undefined = todavía cargando | null = no tiene perfil | string = rol del usuario
  const [role, setRole] = useState<string | null | undefined>(undefined);
  const router = useRouter();
  const segments = useSegments();

  // Carga el perfil del usuario desde la tabla profiles
  async function cargarPerfil(userId: string) {
    try {
      const { data } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single();
      setRole(data?.role ?? null);
    } catch {
      // Si la tabla no existe todavía (credenciales placeholder), tratamos como sin perfil
      setRole(null);
    }
  }

  useEffect(() => {
    // Verificamos si hay una sesión guardada al arrancar
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) cargarPerfil(session.user.id);
      else setRole(null);
    });

    // Escuchamos cambios de auth (login, logout, token renovado)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) cargarPerfil(session.user.id);
      else setRole(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Redirigimos cada vez que cambia la sesión o el rol
  useEffect(() => {
    // Mientras cargamos, no hacemos nada
    if (role === undefined) return;

    const enAuth = (segments[0] as string) === "(auth)";

    if (!session) {
      // No autenticado → login
      if (!enAuth) router.replace("/(auth)/login" as any);
    } else if (!role) {
      // Autenticado pero sin rol elegido → onboarding
      router.replace("/(auth)/onboarding" as any);
    } else {
      // Autenticado con rol → app principal
      if (enAuth) router.replace("/(app)/" as any);
    }
  }, [session, role]);

  // Mientras verificamos, no renderizamos nada (evita flash de pantalla incorrecta)
  if (role === undefined) return null;

  return <Stack screenOptions={{ headerShown: false }} />;
}
