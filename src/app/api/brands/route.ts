import { NextResponse } from 'next/server';
import { backendSupabase as supabase } from '../supabaseBackClient';

export async function GET() {
  try {
    // Obtener todas las marcas
    const { data: brands, error: brandsError } = await supabase
      .from("Brands")
      .select("id, name, imgHref")
      .order("name");

    if (brandsError) throw brandsError;

    // Obtener marcas de CPU únicas
    const { data: cpuData, error: cpuError } = await supabase
      .from("CPUs")
      .select(`
        brand:Brands!inner(id, name)
      `);

    if (cpuError) throw cpuError;

    // Extraer marcas únicas de CPU
    const uniqueCpuBrands = cpuData?.reduce((acc: any[], item: any) => {
      const brand = item.brand;
      if (!acc.find((b) => b.id === brand.id)) {
        acc.push(brand);
      }
      return acc;
    }, []) || [];

    const cpuBrands = uniqueCpuBrands.sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json({
      brands: brands || [],
      cpuBrands: cpuBrands
    });

  } catch (error) {
    console.error("Error fetching brands:", error);
    return NextResponse.json(
      { error: "Failed to fetch brands" },
      { status: 500 }
    );
  }
}