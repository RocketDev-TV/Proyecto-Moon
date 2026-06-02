// =====================================================================
// CAPA DE PERSISTENCIA DATA: GESTOR DE HISTORIAL DE PUNTUACIONES
// =====================================================================
const GestorScores = {
    /**
     * Recupera el listado selectivo del Top 7 histórico de la base de datos
     */
    obtenerTopScores: async function() {
        if (!supabaseClient) {
            console.warn("Conectividad nula. Retornando tabla mock temporal.");
            return [];
        }
        
        const { data, error } = await supabaseClient
            .from('leaderboard')
            .select('name, score')
            .order('score', { ascending: false }) // Prioriza marcas más altas
            .limit(7);                            // Mapea el Top 7 clásico
            
        if (error) {
            console.error("Fallo del servidor al leer los marcajes:", error.message);
            return [];
        }
        return data;
    },

    /**
     * Inserta un nuevo registro de puntaje forzando mayúsculas y límite de caracteres
     */
    registrarNuevoScore: async function(nombre, puntuacion) {
        if (!supabaseClient) return;
        
        const { error } = await supabaseClient
            .from('leaderboard')
            .insert([{ 
                name: nombre.substring(0, 6).toUpperCase().trim(), 
                score: parseInt(puntuacion) || 0 
            }]);

        if (error) {
            console.error("Fallo del servidor al inyectar nueva marca:", error.message);
        }
    }
};