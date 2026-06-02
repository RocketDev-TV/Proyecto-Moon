// =====================================================================
// CONFIGURACIÓN DE ENTORNO EN LA NUBE: SUPABASE INITIALIZER
// =====================================================================
const SUPABASE_URL = "https://ezrlzhbuuwykxcpwawdp.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_huc013uURMctl82jCM4kpw_Cn-Y7XPM";

// Inicialización del cliente de forma global en la ventana del navegador
const supabaseClient = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

if (!supabaseClient) {
    console.error("⚠️ Crítico: No se pudo enlazar el SDK de Supabase al entorno local.");
}