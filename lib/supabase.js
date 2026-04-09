// lib/supabase.js
// POR AHORA: archivo preparado pero sin credenciales reales.
// Cuando Román cree el proyecto en Supabase, reemplaza estos dos valores.
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

// Estos valores vienen del dashboard de Supabase:
// Project Settings > API > Project URL y anon/public key
export const SUPABASE_URL = "https://mzxxdeglootkxmzblilm.supabase.co";
export const SUPABASE_ANON_KEY = "sb_publishable_vsT8bGRxvL6c6j8ReMjFxg_-aomO0_A";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
