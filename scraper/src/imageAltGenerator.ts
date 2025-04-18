import { pipeline, Pipeline } from "@xenova/transformers";
import OpenAI from "openai";

/**
 * Inicializa el procesador de imágenes
 * @returns Instancia del procesador de imágenes
 */
async function setupImageProcessorLocal(): Promise<Pipeline> {
  const processor = await pipeline("image-to-text", "openbmb/MiniCPM-V-2_6", {
    quantized: true,
    revision: "q4_K_M", // Utiliza la revisión cuantizada (q4_K_M para 4-bit, o q8_0 para 8-bit)
  });
  return processor;
}

/**
 * Genera texto alternativo para una imagen usando el modelo local
 * @param imagePath Ruta de la imagen
 * @returns Texto alternativo generado o null si ocurre un error
 */
export async function generateAltTextLocal(
  imagePath: string
): Promise<string | null> {
  try {
    const processor = await setupImageProcessorLocal();
    const result = await processor(imagePath, {
      question:
        "Generate a concise descriptive alt text for this image. Response must be a single phrase.",
    });

    if (result && typeof result === "string") {
      return result;
    } else if (Array.isArray(result) && result.length > 0) {
      return result[0].generated_text || null;
    }

    return null;
  } catch (error) {
    console.error("Error al generar texto alternativo local:", error);
    return null;
  }
}

/**
 * Genera texto alternativo para una imagen usando la API de OpenRouter con Llama 4 Maverick
 * @param imageUrl URL de la imagen (debe ser accesible públicamente)
 * @param apiKey Clave API de OpenRouter
 * @param refererUrl URL del sitio para las clasificaciones en openrouter.ai (opcional)
 * @param siteName Nombre del sitio para las clasificaciones en openrouter.ai (opcional)
 * @returns Texto alternativo generado o null si ocurre un error
 */
export async function generateAltTextAPI(
  imageUrl: string
): Promise<string | null> {
  try {
    const client = new OpenAI({
      baseURL: process.env.OPENAI_BASE_URL_IMG,
      apiKey: process.env.OPENAI_API_KEY_IMG,
    });

    const completion = await client.chat.completions.create({
      model: "meta-llama/llama-4-maverick:free",
      max_tokens: 50,
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content:
            'Classify mini PC images and provide ONLY a simple text response in one of these exact formats:\n\n1. If it shows a main/frontal view of the mini PC: "MAIN_IMAGE: Brief factual description of the PC"\n\n2. If it shows connection ports: "PORTS IMAGE: USB 3.0 (2), HDMI (1), USB-C (1)" - list ALL visible ports with their type, info and quantity in parentheses\n\n3. If it shows neither of the above: "null"\n\nRULES:\n- Return ONLY plain text.\n- No explanations, code blocks, or additional text\n- Never use "you", "user", "I", or personal pronouns\n- Be concise and specific about visible features',
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Classify",
            },
            {
              type: "image_url",
              image_url: {
                url: imageUrl,
              },
            },
          ],
        },
      ],
    });

    if (!completion || !completion.choices || completion.choices.length < 1) {
      throw new Error("No hay respuesta de la API de procesamiento de imagen");
    }

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Error al generar texto alternativo API:", error);
    return null;
  }
}

export default { generateAltTextLocal, generateAltTextAPI };
