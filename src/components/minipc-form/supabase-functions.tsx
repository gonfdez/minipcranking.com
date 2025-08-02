import { createClient } from "@supabase/supabase-js";
import { FormData } from "./MiniPCForm";

// Asegúrate de tener estas variables de entorno configuradas
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface CreateMiniPCResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export interface FormDataWithLabels extends FormData {
  brandLabel?: string;
  cpuLabel?: string;
  graphicsLabel?: string;
  connectivityLabels?: string[];
}

export async function createMiniPC(
  formData: FormData
): Promise<CreateMiniPCResponse> {
  try {
    // Transformar los datos del formulario al formato de la base de datos
    const miniPCData = {
      brand: parseInt(formData.brand), // Asumiendo que es un ID numérico
      model: formData.model,
      description: formData.description,
      fromURL: formData.fromURL,
      manualURL: formData.manualURL,
      manualCollect: formData.manualCollect,
      mainImgUrl: formData.mainImgUrl.map((img) => img.url),
      CPU: parseInt(formData.CPU), // Asumiendo que es un ID numérico
      maxRAMCapacityGB: formData.maxRAMCapacityGB || null,
      maxStorageCapacityGB: formData.maxStorageCapacityGB || null,
      graphics: parseInt(formData.graphics), // Asumiendo que es un ID numérico
      builtinMicrophone: formData.builtinMicrophone || false,
      builtinSpeakers: formData.builtinSpeakers || false,
      supportExternalDiscreteGraphicsCard:
        formData.supportExternalDiscreteGraphicsCard || false,
      portsImgUrl: formData.portsImgUrl.map((img) => img.url),
      dimensions: {
        widthMM: formData.dimensions.widthMM,
        heightMM: formData.dimensions.heightMM,
        lengthMM: formData.dimensions.lengthMM
      },
      weightKg: formData.weightKg || null,
      powerConsumptionW: formData.powerConsumptionW || null,
      releaseYear: formData.releaseYear || null,
      ports: formData.ports,
      connectivity: formData.connectivity,
    };

    // Insertar el MiniPC
    const { data: miniPCResult, error: miniPCError } = await supabase
      .from("MiniPCs")
      .insert([miniPCData])
      .select("id")
      .single();

    if (miniPCError) {
      console.error("Error creating MiniPC:", miniPCError);
      return { success: false, error: miniPCError.message };
    }

    const miniPCId = miniPCResult.id;

    // Preparar los datos de las variantes
    const variantsData = formData.variants.map((variant) => ({
      RAMGB: variant.RAMGB,
      RAM_type: variant.RAM_type,
      storageGB: variant.storageGB,
      storage_type: variant.storage_type,
      offers: variant.offers,
      mini_pc: miniPCId,
    }));

    // Insertar las variantes
    const { data: variantsResult, error: variantsError } = await supabase
      .from("Variants")
      .insert(variantsData)
      .select();

    if (variantsError) {
      console.error("Error creating variants:", variantsError);
      // Si hay error con las variantes, deberíamos considerar hacer rollback del MiniPC
      // Por ahora, retornamos el error
      return { success: false, error: variantsError.message };
    }

    return {
      success: true,
      data: {
        miniPC: miniPCResult,
        variants: variantsResult,
      },
    };
  } catch (error) {
    console.error("Unexpected error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

// Función para obtener los labels de las referencias
export async function getFormDataWithLabels(
  formData: FormData
): Promise<FormDataWithLabels> {
  try {
    const formDataWithLabels: FormDataWithLabels = { ...formData };

    // Obtener brand label
    const { data: brandData } = await supabase
      .from("Brands")
      .select("name")
      .eq("id", parseInt(formData.brand))
      .single();

    if (brandData) {
      formDataWithLabels.brandLabel = brandData.name;
    }

    // Obtener CPU label (modelo + marca)
    const { data: cpuData } = await supabase
      .from("CPUs")
      .select("model, brand:Brands(name)")
      .eq("id", parseInt(formData.CPU))
      .single();

    if (cpuData) {
      // Forzar el tipo para evitar problemas con TypeScript
      const cpu = cpuData as unknown as {
        model: string;
        brand: { name: string };
      };
      const brandName = cpu.brand?.name || "Unknown Brand";
      formDataWithLabels.cpuLabel = `${brandName} ${cpu.model}`;
    }

    // Obtener Graphics label (modelo + marca)
    const { data: graphicsData } = await supabase
      .from("Graphics")
      .select("model, brand:Brands(name)")
      .eq("id", parseInt(formData.graphics))
      .single();

    if (graphicsData) {
      // Forzar el tipo para evitar problemas con TypeScript
      const graphics = graphicsData as unknown as {
        model: string;
        brand: { name: string };
      };
      const brandName = graphics.brand?.name || "Unknown Brand";
      formDataWithLabels.graphicsLabel = `${brandName} ${graphics.model}`;
    }

    // Obtener Connectivity labels
    if (formData.connectivity.length > 0) {
      const { data: connectivityData } = await supabase
        .from("Connectivity")
        .select("type")
        .in("id", formData.connectivity);

      if (connectivityData) {
        formDataWithLabels.connectivityLabels = connectivityData.map(
          (item) => item.type
        );
      }
    }

    return formDataWithLabels;
  } catch (error) {
    console.error("Error getting labels:", error);
    return formData;
  }
}

// Función auxiliar para validar que los IDs existen en las tablas referenciadas
export async function validateReferences(
  formData: FormData
): Promise<{ isValid: boolean; errors: string[] }> {
  const errors: string[] = [];

  try {
    // Validar brand
    const { data: brandData, error: brandError } = await supabase
      .from("Brands")
      .select("id")
      .eq("id", parseInt(formData.brand))
      .single();

    if (brandError || !brandData) {
      errors.push("Selected brand does not exist");
    }

    // Validar CPU
    const { data: cpuData, error: cpuError } = await supabase
      .from("CPUs")
      .select("id")
      .eq("id", parseInt(formData.CPU))
      .single();

    if (cpuError || !cpuData) {
      errors.push("Selected CPU does not exist");
    }

    // Validar Graphics
    const { data: graphicsData, error: graphicsError } = await supabase
      .from("Graphics")
      .select("id")
      .eq("id", parseInt(formData.graphics))
      .single();

    if (graphicsError || !graphicsData) {
      errors.push("Selected graphics card does not exist");
    }

    // Validar connectivity IDs
    if (formData.connectivity.length > 0) {
      const { data: connectivityData, error: connectivityError } =
        await supabase
          .from("Connectivity")
          .select("id")
          .in("id", formData.connectivity);

      if (
        connectivityError ||
        !connectivityData ||
        connectivityData.length !== formData.connectivity.length
      ) {
        errors.push("One or more connectivity options do not exist");
      }
    }

    return { isValid: errors.length === 0, errors };
  } catch (error) {
    console.error("Error validating references:", error);
    return { isValid: false, errors: ["Error validating references"] };
  }
}
