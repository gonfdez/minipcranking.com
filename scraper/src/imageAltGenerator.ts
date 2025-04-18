import { pipeline, Pipeline } from '@xenova/transformers';

/**
 * Inicializa el procesador de imágenes
 * @returns Instancia del procesador de imágenes
 */
async function setupImageProcessor(): Promise<Pipeline> {
  // Inicializar el modelo cuantizado
  const processor = await pipeline('image-to-text', 'openbmb/MiniCPM-V-2_6', {
    quantized: true,
    revision: 'q4_K_M' // Utiliza la revisión cuantizada (q4_K_M para 4-bit, o q8_0 para 8-bit)
  });
  return processor;
}

/**
 * Genera texto alternativo para una imagen
 * @param imagePath Ruta de la imagen
 * @returns Texto alternativo generado o null si ocurre un error
 */
export async function generateAltText(imagePath: string): Promise<string | null> {
  try {
    const processor = await setupImageProcessor();
    const result = await processor(imagePath, { 
      question: "Generate a concise and descriptive alt text for this image." 
    });
    
    // Verificar si hay un resultado válido
    if (result && typeof result === 'string') {
      return result;
    } else if (Array.isArray(result) && result.length > 0) {
      // Algunos modelos pueden devolver un array de resultados
      return result[0].generated_text || null;
    }
    
    return null;
  } catch (error) {
    console.error('Error al generar texto alternativo:', error);
    return null;
  }
}

// Exportación por defecto para permitir ambos tipos de importación
export default { generateAltText };