import { Suspense } from "react";
import { MiniPCClient } from "@/components/MiniPCClient";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Search, Filter, ChevronDown } from "lucide-react";
import { Metadata } from "next";

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

// Componente de Loading completo que replica toda la estructura
const MiniPCPageSkeleton = () => (
  <>
    {/* Header skeleton */}
    <div className="mb-4">
      <div className="h-12 w-48 bg-muted rounded-lg mb-2 animate-pulse"></div>
      <div className="h-5 w-96 bg-muted rounded mb-6 animate-pulse"></div>

      {/* Search bar skeleton */}
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <div className="h-10 w-full bg-muted rounded-md pl-10 animate-pulse"></div>
      </div>
    </div>

    {/* Filters skeleton */}
    <Card className="mb-8 p-0 rounded-md shadow-xs">
      <CardHeader className="px-3 py-1 h-9 items-center cursor-pointer hover:bg-muted/50 transition-colors gap-0">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Filter className="h-4 w-4" />
            <div className="h-4 w-12 bg-muted rounded animate-pulse"></div>
          </div>
          <div className="flex items-center gap-2">
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
      </CardHeader>
    </Card>

    {/* Results counter skeleton */}
    <div className="flex justify-between items-center mb-6">
      <div className="h-5 w-48 bg-muted animate-pulse rounded"></div>
    </div>

    {/* Grid skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
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

              {/* Skeleton del precio ocasional */}
              {i % 3 === 0 && (
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-muted rounded mr-2"></div>
                  <div className="h-4 w-20 bg-muted rounded"></div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>

    {/* Pagination skeleton */}
    <div className="mt-8 flex justify-center">
      <div className="flex items-center space-x-2">
        <div className="h-8 w-20 bg-muted rounded animate-pulse"></div>
        <div className="flex items-center space-x-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-8 w-8 bg-muted rounded animate-pulse"></div>
          ))}
        </div>
        <div className="h-8 w-16 bg-muted rounded animate-pulse"></div>
      </div>
    </div>
  </>
);

export default async function MiniPCPage({ searchParams }: Props) {
  const awaitedParams = await searchParams;
  // Fetch datos en paralelo
  const [miniPCData, brandsData] = await Promise.all([
    fetchMiniPCs(awaitedParams),
    fetchBrands(),
  ]);

  return (
    <div className="container mx-auto px-4 py-8 md:max-w-3xl lg:max-w-4xl">
      <Suspense fallback={<MiniPCPageSkeleton />}>
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
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  return {
    title: "Mini PCs Collection",
    description:
      "Explore our collection of Mini PCs with detailed specifications and updated deals",
    keywords: [
      "mini PC",
      "mini PCs",
      "mini computer",
      "mini computers",
      "mini PC comparison",
      "best mini PC",
      "mini PC deals",
      "mini PC reviews",
      "mini PC ranking",
      "mini PC for gaming",
      "mini PC for work",
      "mini PC for home",
      "Windows mini PC",
      "Linux mini PC",
      "Intel mini PC",
      "AMD mini PC",
      "mini PC specs",
      "mini PC brands",
      "small form factor PC",
      "compact PC",
      "mini desktop PC"
    ]
  };
}