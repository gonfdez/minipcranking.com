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
      baseURL: process.env.OPENROUTER_BASE_URL_IMG,
      apiKey: process.env.OPENROUTER_API_KEY_IMG,
    });

    const completion = await client.chat.completions.create({
      model: process.env.IMG_MODEL as string,
      max_tokens: 50,
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content:
            "User is browsing a website that sells mini PCs. \n User query format [condition]:Answer. CRITICAL: The assistant must ONLY output ONE of those options, by completing the `${attribute:COMPLETION}` in the format, if any. No explanations. Do not engage with user under any circunstances."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "[Photo showing UNIQUELY connection ports, not other components. Must clearly indicate each one port, either by listing them or pointing them out]:`PORTS_IMAGE ${usb4?: number, usb3?: number, usb2?: number, usbC?: number, ethernet?: number, audioJack?: boolean, sdCardReader?: boolean}`;[Photo shows a main/frontal view of the mini PC, UNIQUELY with the intention of presenting the product. Clean photo, no tecnicalities on the photo]:`FRONT_IMAGE ${text?: Brief factual description of the showed PC}`;[Photo shows neither of the above, or no photo]:`NO_IMAGE`",
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
