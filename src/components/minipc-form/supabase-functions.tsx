import { createClient } from "@supabase/supabase-js";
import { FormData } from "./MiniPCForm";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface CreateMiniPCResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export async function createMiniPC(
  formData: FormData
): Promise<CreateMiniPCResponse> {
  try {
    const miniPCData = {
      brand: parseInt(formData.brand),
      model: formData.model,
      description: formData.description,
      fromURL: formData.fromURL,
      manualURL: formData.manualURL,
      manualCollect: formData.manualCollect,
      mainImgUrl: formData.mainImgUrl.map((img) => img.url),
      CPU: parseInt(formData.CPU),
      maxRAMCapacityGB: formData.maxRAMCapacityGB || null,
      maxStorageCapacityGB: formData.maxStorageCapacityGB || null,
      graphics: parseInt(formData.graphics),
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

    const variantsData = formData.variants.map((variant) => ({
      RAMGB: variant.RAMGB,
      RAM_type: variant.RAM_type,
      storageGB: variant.storageGB,
      storage_type: variant.storage_type,
      offers: variant.offers,
      mini_pc: miniPCId,
    }));

    const { data: variantsResult, error: variantsError } = await supabase
      .from("Variants")
      .insert(variantsData)
      .select();

    if (variantsError) {
      console.error("Error creating variants:", variantsError);
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

// Función auxiliar para validar que los IDs existen en las tablas referenciadas
export async function validateReferences(
  formData: FormData
): Promise<{ isValid: boolean; errors: string[] }> {
  const errors: string[] = [];

  try {
    const { data: brandData, error: brandError } = await supabase
      .from("Brands")
      .select("id")
      .eq("id", parseInt(formData.brand))
      .single();

    if (brandError || !brandData) {
      errors.push("Selected brand does not exist");
    }

    const { data: cpuData, error: cpuError } = await supabase
      .from("CPUs")
      .select("id")
      .eq("id", parseInt(formData.CPU))
      .single();

    if (cpuError || !cpuData) {
      errors.push("Selected CPU does not exist");
    }

    const { data: graphicsData, error: graphicsError } = await supabase
      .from("Graphics")
      .select("id")
      .eq("id", parseInt(formData.graphics))
      .single();

    if (graphicsError || !graphicsData) {
      errors.push("Selected graphics card does not exist");
    }

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