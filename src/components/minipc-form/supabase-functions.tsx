import { supabase } from "@/lib/supabaseClient";
import { FormData } from "./MiniPCForm";


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
        lengthMM: formData.dimensions.lengthMM,
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

export async function updateMiniPC(
  minipcId: string,
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
        lengthMM: formData.dimensions.lengthMM,
      },
      weightKg: formData.weightKg || null,
      powerConsumptionW: formData.powerConsumptionW || null,
      releaseYear: formData.releaseYear || null,
      ports: formData.ports,
      connectivity: formData.connectivity,
    };

    // Actualizamos MiniPC
    const { error: miniPCError } = await supabase
      .from("MiniPCs")
      .update(miniPCData)
      .eq("id", minipcId);

    if (miniPCError) {
      console.error("Error updating MiniPC:", miniPCError);
      return { success: false, error: miniPCError.message };
    }

    // Obtenemos las variantes existentes
    const { data: existingVariants } = await supabase
      .from("Variants")
      .select("id")
      .eq("mini_pc", minipcId);

    const existingVariantIds = existingVariants?.map((v) => v.id) || [];
    const formVariantIds = formData.variants
      .map((v) => v.id)
      .filter((id) => id !== undefined) as number[];
    // Borramos variantes que ya no están en el formulario
    const variantsToDelete = existingVariantIds.filter(
      (id) => !formVariantIds.includes(id)
    );

    if (variantsToDelete.length > 0) {
      const { error: deleteError } = await supabase
        .from("Variants")
        .delete()
        .in("id", variantsToDelete);

      if (deleteError) {
        console.error("Error deleting variants:", deleteError);
        return { success: false, error: deleteError.message };
      }
    }

    // Separamos variantes nuevas de las que se van a actualizar
    const variantsToUpdate = formData.variants.filter((v) => v.id);
    const variantsToCreate = formData.variants.filter((v) => !v.id);

    // Actualizamos variantes existentes
    for (const variant of variantsToUpdate) {
      const { error: updateError } = await supabase
        .from("Variants")
        .update({
          RAMGB: variant.RAMGB,
          RAM_type: variant.RAM_type,
          storageGB: variant.storageGB,
          storage_type: variant.storage_type,
          offers: variant.offers,
        })
        .eq("id", variant.id);

      if (updateError) {
        console.error("Error updating variant:", updateError);
        return { success: false, error: updateError.message };
      }
    }

    // Creamos variantes nuevas
    if (variantsToCreate.length > 0) {
      const variantsData = variantsToCreate.map((variant) => ({
        RAMGB: variant.RAMGB,
        RAM_type: variant.RAM_type,
        storageGB: variant.storageGB,
        storage_type: variant.storage_type,
        offers: variant.offers,
        mini_pc: minipcId,
      }));

      const { error: variantsError } = await supabase
        .from("Variants")
        .insert(variantsData);

      if (variantsError) {
        console.error("Error inserting new variants:", variantsError);
        return { success: false, error: variantsError.message };
      }
    }

    return {
      success: true,
      data: {
        miniPC: { id: minipcId },
        variants: {
          deleted: variantsToDelete,
          updated: variantsToUpdate,
          created: variantsToCreate,
        },
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
