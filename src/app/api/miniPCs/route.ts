import { NextRequest, NextResponse } from 'next/server';
import { backendSupabase as supabase } from '@/lib/supabaseClient';

interface QueryFilters {
  search?: string;
  brand?: string;
  cpuBrand?: string;
  integratedGraphics?: string;
  page?: string;
}

const ITEMS_PER_PAGE = 12;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filters: QueryFilters = {
      search: searchParams.get('search') || undefined,
      brand: searchParams.get('brand') || undefined,
      cpuBrand: searchParams.get('cpuBrand') || undefined,
      integratedGraphics: searchParams.get('integratedGraphics') || undefined,
      page: searchParams.get('page') || '1',
    };

    const currentPage = parseInt(filters.page || '1');

    // Query principal para Mini PCs con joins
    let query = supabase.from("MiniPCs").select(
      `
        id,
        model,
        mainImgUrl,
        brand:Brands!inner(id, name, imgHref),
        CPU:CPUs!inner(
          id,
          model,
          brand:Brands!inner(id, name)
        ),
        graphics:Graphics!inner(
          id,
          model,
          integrated,
          brand:Brands!inner(id, name)
        )
      `,
      { count: "exact" }
    );

    // Aplicar filtros
    if (filters.search) {
      query = query.or(
        `model.ilike.%${filters.search}%,brand.name.ilike.%${filters.search}%`
      );
    }

    if (filters.brand) {
      query = query.eq("brand.id", filters.brand);
    }

    if (filters.cpuBrand) {
      query = query.eq("CPU.brand.id", filters.cpuBrand);
    }

    if (filters.integratedGraphics === "true") {
      query = query.eq("graphics.integrated", true);
    } else if (filters.integratedGraphics === "false") {
      query = query.eq("graphics.integrated", false);
    }

    // Paginación
    const from = (currentPage - 1) * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;

    query = query.range(from, to).order("created_at", { ascending: false });

    const { data: miniPCs, error, count } = await query;

    if (error) throw error;

    // Para cada Mini PC, obtener el precio mínimo de sus variantes
    const miniPCsWithPrices = await Promise.all(
      (miniPCs || []).map(async (miniPC: any) => {
        // Obtener todas las variantes del Mini PC
        const { data: variants, error: variantsError } = await supabase
          .from("Variants")
          .select("offers")
          .eq("mini_pc", miniPC.id);

        if (variantsError) {
          console.error(`Error fetching variants for Mini PC ${miniPC.id}:`, variantsError);
          return {
            ...miniPC,
            minPrice: null
          };
        }

        // Extraer todos los precios de todas las ofertas de todas las variantes
        let allPrices: number[] = [];
        
        if (variants) {
          variants.forEach(variant => {
            if (variant.offers && Array.isArray(variant.offers)) {
              variant.offers.forEach((offer: any) => {
                if (offer && typeof offer.price === 'number' && offer.price > 0) {
                  allPrices.push(offer.price);
                }
              });
            }
          });
        }

        // Encontrar el precio mínimo
        const minPrice = allPrices.length > 0 ? Math.min(...allPrices) : null;

        return {
          id: miniPC.id,
          model: miniPC.model,
          description: miniPC.description,
          mainImgUrl: miniPC.mainImgUrl,
          brand: miniPC.brand,
          CPU: miniPC.CPU,
          graphics: miniPC.graphics,
          minPrice: minPrice
        };
      })
    );

    return NextResponse.json({
      data: miniPCsWithPrices,
      totalCount: count || 0,
      currentPage,
      totalPages: Math.ceil((count || 0) / ITEMS_PER_PAGE),
      itemsPerPage: ITEMS_PER_PAGE
    });

  } catch (error) {
    console.error("Error in Mini PCs API:", error);
    return NextResponse.json(
      { error: "Failed to fetch Mini PCs" },
      { status: 500 }
    );
  }
}