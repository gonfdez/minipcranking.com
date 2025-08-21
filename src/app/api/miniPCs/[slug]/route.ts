import { NextRequest, NextResponse } from "next/server";
import { backendSupabase as supabase } from '../../supabaseBackClient';
import { generateSlug } from "@/app/minipc/[slug]/generateSlug";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Query principal para obtener el MiniPC con todas las relaciones
    const { data: miniPCData, error: miniPCError } = await supabase
      .from("MiniPCs")
      .select(`
        *,
        brand:Brands!MiniPCs_brand_fkey (
          id,
          name,
          imgHref
        ),
        CPU:CPUs!MiniPCs_CPU_fkey (
          id,
          model,
          cores,
          threads,
          baseClockGHz,
          boostClockGHz,
          brand:Brands!CPUs_brand_fkey (
            id,
            name,
            imgHref
          )
        ),
        graphics:Graphics!MiniPCs_graphics_fkey (
          id,
          model,
          integrated,
          frequencyMHz,
          maxTOPS,
          graphicCoresCU,
          brand:Brands!Graphics_brand_fkey (
            id,
            name,
            imgHref
          )
        )
      `);

    if (miniPCError) {
      console.error("Error fetching MiniPCs:", miniPCError);
      return NextResponse.json(
        { error: "Failed to fetch Mini PCs" },
        { status: 500 }
      );
    }

    if (!miniPCData || miniPCData.length === 0) {
      return NextResponse.json(
        { error: "No Mini PCs found" },
        { status: 404 }
      );
    }

    // Buscar el MiniPC que coincida con el slug
    let targetMiniPC = null;
    for (const miniPC of miniPCData) {
      const generatedSlug = generateSlug(
        miniPC.brand.name,
        miniPC.model,
        miniPC.CPU.model,
        miniPC.graphics.model
      );
      
      if (generatedSlug === slug) {
        targetMiniPC = miniPC;
        break;
      }
    }

    if (!targetMiniPC) {
      return NextResponse.json(
        { error: "Mini PC not found" },
        { status: 404 }
      );
    }

    // Obtener connectivity details
    const { data: connectivityData, error: connectivityError } = await supabase
      .from("Connectivity")
      .select("*")
      .in("id", targetMiniPC.connectivity);

    if (connectivityError) {
      console.error("Error fetching connectivity:", connectivityError);
      return NextResponse.json(
        { error: "Failed to fetch connectivity data" },
        { status: 500 }
      );
    }

    // Obtener variants
    const { data: variantsData, error: variantsError } = await supabase
      .from("Variants")
      .select("*")
      .eq("mini_pc", targetMiniPC.id);

    if (variantsError) {
      console.error("Error fetching variants:", variantsError);
      return NextResponse.json(
        { error: "Failed to fetch variants data" },
        { status: 500 }
      );
    }

    // Calcular precio mínimo
    let minPrice = null;
    if (variantsData && variantsData.length > 0) {
      const allPrices: number[] = [];
      variantsData.forEach(variant => {
        if (variant.offers && Array.isArray(variant.offers)) {
          variant.offers.forEach((offer: any) => {
            if (offer.price && typeof offer.price === 'number') {
              allPrices.push(offer.price);
            }
          });
        }
      });
      
      if (allPrices.length > 0) {
        minPrice = Math.min(...allPrices);
      }
    }

    // Construir respuesta completa
    const response = {
      miniPC: {
        ...targetMiniPC,
        connectivity: connectivityData || [],
        variants: variantsData || [],
        minPrice
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}