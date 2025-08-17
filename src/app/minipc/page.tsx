import { Suspense } from "react";
import { MiniPCClient } from "@/components/MiniPCClient";
import { Card, CardContent } from "@/components/ui/card";

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
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const params = new URLSearchParams();

  Object.entries(searchParams).forEach(([key, value]) => {
    if (value) params.append(key, value);
  });

  try {
    const response = await fetch(
      `${baseUrl}/api/miniPCs?${params.toString()}`,
      {
        cache: "no-store", // Para asegurar datos actualizados
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch Mini PCs");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching Mini PCs:", error);
    return { data: [], totalCount: 0, currentPage: 1, totalPages: 0 };
  }
}

async function fetchBrands() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  try {
    const response = await fetch(`${baseUrl}/api/brands`, {
      cache: "force-cache", // Las marcas cambian poco
    });

    if (!response.ok) {
      throw new Error("Failed to fetch brands");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching brands:", error);
    return { brands: [], cpuBrands: [] };
  }
}

export default async function MiniPCPage({ searchParams }: Props) {
  const awaitedParams = await searchParams;
  // Fetch datos en paralelo
  const [miniPCData, brandsData] = await Promise.all([
    fetchMiniPCs(awaitedParams),
    fetchBrands(),
  ]);

  return (
    <div className="container mx-auto px-4 py-8 md:max-w-3xl lg:max-w-4xl">
      <Suspense
        fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <Card
                key={i}
                className="group overflow-hidden p-0 gap-0 animate-pulse"
              >
                {/* Skeleton de la imagen */}
                <div className="relative h-48 w-full bg-muted">
                  {/* Skeleton del overlay del título */}
                  <div className="absolute bottom-0 left-0 bg-muted-foreground/20 backdrop-blur-sm p-3 w-fit rounded-tr-lg">
                    <div className="h-6 w-32 bg-muted-foreground/30 rounded"></div>
                  </div>
                </div>

                {/* Skeleton del contenido */}
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-muted rounded mr-2"></div>
                      <div className="h-4 w-24 bg-muted rounded"></div>
                    </div>

                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-muted rounded mr-2"></div>
                      <div className="h-4 w-28 bg-muted rounded"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        }
      >
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
    title: "Mini PCs Collection",
    description:
      "Explore our collection of Mini PCs with detailed specifications and updated deals",
  };
}
