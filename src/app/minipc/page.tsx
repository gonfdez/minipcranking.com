import { Suspense } from 'react';
import { MiniPCClient } from '@/components/MiniPCClient';

interface SearchParams {
  search?: string;
  brand?: string;
  cpuBrand?: string;
  minRam?: string;
  releaseYear?: string;
  integratedGraphics?: string;
  page?: string;
}

interface Props {
  searchParams: Promise<SearchParams>;
}

async function fetchMiniPCs(searchParams: SearchParams) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const params = new URLSearchParams();
  
  Object.entries(searchParams).forEach(([key, value]) => {
    if (value) params.append(key, value);
  });

  try {
    const response = await fetch(`${baseUrl}/api/miniPCs?${params.toString()}`, {
      cache: 'no-store' // Para asegurar datos actualizados
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch Mini PCs');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching Mini PCs:', error);
    return { data: [], totalCount: 0, currentPage: 1, totalPages: 0 };
  }
}

async function fetchBrands() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  try {
    const response = await fetch(`${baseUrl}/api/brands`, {
      cache: 'force-cache' // Las marcas cambian poco
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch brands');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching brands:', error);
    return { brands: [], cpuBrands: [] };
  }
}

export default async function MiniPCPage({ searchParams }: Props) {
   const awaitedParams = await searchParams;
  // Fetch datos en paralelo
  const [miniPCData, brandsData] = await Promise.all([
    fetchMiniPCs(awaitedParams),
    fetchBrands()
  ]);

  return (
    <div className="container mx-auto px-4 py-8 md:max-w-3xl lg:max-w-4xl">
      <Suspense fallback={<div>Loading...</div>}>
        <MiniPCClient
          initialData={miniPCData}
          brandsData={brandsData}
          initialFilters={awaitedParams}
        />
      </Suspense>
    </div>
  );
}

// Generar metadata dinámicamente
export async function generateMetadata({ searchParams }: Props) {
  return {
    title: 'Mini PCs Collection',
    description: 'Explore our collection of Mini PCs with detailed specifications and updated deals'
  };
}