// supabase.js
import fetch from "cross-fetch";
globalThis.fetch = fetch;

import { createClient } from "@supabase/supabase-js";

// Claves (idealmente, deben estar en un archivo .env)
const SUPABASE_URL = "https://vhidwcpmekbwzwoqggws.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZoaWR3Y3BtZWtid3p3b3FnZ3dzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyNzQyMjIsImV4cCI6MjA3Njg1MDIyMn0.0VsYBiNE_l-WfbhnzCyWW_I7JzGLleIs3We52A8myL0";

// Crea y exporta el cliente Supabase
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);


// Función para verificar el estado de la conexión e imprimir un aviso
async function checkSupabaseConnection() {
  try {
    // Intenta hacer una consulta mínima. Asegúrate que 'ADMIN' sea una tabla existente.
    const { error } = await supabase
      .from('ADMIN') 
      .select('*', { head: true, count: 'exact' });

    if (error) {
      console.error("❌ ERROR: Conexión a Supabase fallida. Detalles del error:", error.message);
      return false;
    }

    console.log("✅ Conexión a Supabase establecida correctamente.");
    return true;

  } catch (err) {
    console.error("❌ ERROR: Fallo grave en la inicialización o red de Supabase:", err.message);
    return false;
  }
}

// Ejecuta la prueba de conexión al cargar el módulo
checkSupabaseConnection();