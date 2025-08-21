import { Suspense } from "react";
import { notFound } from "next/navigation";
import { MiniPCDetailClient } from "@/components/MiniPCDetailClient";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { generateSlug } from "./generateSlug";

interface Params {
  slug: string;
}

interface Props {
  params: Promise<Params>;
}

// Función para parsear slug y extraer información
function parseSlug(slug: string) {
  const parts = slug.split('-');
  return {
    brand: parts[0],
    model: parts[1],
    cpu: parts[2],
    graphics: parts[3]
  };
}

async function fetchMiniPCDetail(slug: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  
  try {
    const response = await fetch(`${baseUrl}/api/miniPCs/${slug}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error("Failed to fetch Mini PC details");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching Mini PC details:", error);
    return null;
  }
}

// Loading skeleton completo
const MiniPCDetailSkeleton = () => (
  <div className="container mx-auto px-4 py-8 max-w-7xl">
    {/* Breadcrumb skeleton */}
    <nav className="flex items-center space-x-2 mb-6 text-sm">
      <Skeleton className="h-4 w-16" />
      <span className="text-muted-foreground">/</span>
      <Skeleton className="h-4 w-20" />
      <span className="text-muted-foreground">/</span>
      <Skeleton className="h-4 w-32" />
    </nav>

    {/* Title and basic info skeleton */}
    <div className="mb-8">
      <Skeleton className="h-10 w-96 mb-2" />
      <div className="flex flex-wrap items-center gap-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>

    {/* Main content grid - coincide con lg:grid-cols-2 */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
      {/* Product images carousel skeleton */}
      <Card className="h-fit">
        <CardHeader>
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent>
          {/* Carousel skeleton */}
          <div className="mx-9 my-5">
            <Skeleton className="aspect-square rounded-lg" />
          </div>
          {/* Description skeleton */}
          <div className="mt-4">
            <Skeleton className="h-4 w-20 mb-2" />
            <div className="space-y-1">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-3 w-5/6" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Right side grid - coincide con grid-cols-1 lg:grid-cols-2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CPU Details skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-24" />
          </CardHeader>
          <CardContent className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex justify-between text-sm">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Graphics Details skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-20" />
          </CardHeader>
          <CardContent className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex justify-between text-sm">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Model Specifications skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-36" />
          </CardHeader>
          <CardContent className="space-y-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex justify-between text-sm">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Connectivity & Ports skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-32" />
          </CardHeader>
          <CardContent>
            {/* Grid de puertos */}
            <div className="grid grid-cols-2 gap-y-3 gap-x-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <Skeleton className="h-3 w-3 rounded-sm" />
                  <Skeleton className="h-3 w-16" />
                </div>
              ))}
            </div>
            {/* Wireless section */}
            <div className="mt-4 pt-4 border-t">
              <Skeleton className="h-4 w-16 mb-2" />
              <div className="space-y-2">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-3 w-3 rounded-sm" />
                      <Skeleton className="h-3 w-12" />
                    </div>
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>

    {/* Available Configurations skeleton */}
    <div className="space-y-6">
      <Skeleton className="h-8 w-64" />
      {/* Grid de 3 columnas como en el componente real */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-28" />
                </div>
              </div>
              <Skeleton className="h-6 w-20 mt-2" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-4 w-32" />
              <div className="space-y-2">
                {Array.from({ length: 2 }).map((_, j) => (
                  <div key={j} className="flex justify-between items-center p-2 bg-muted/50 rounded-md">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-8 w-16 rounded-md" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </div>
);

export default async function MiniPCDetailPage({ params }: Props) {
  const { slug } = await params;
  const miniPCData = await fetchMiniPCDetail(slug);

  if (!miniPCData) {
    notFound();
  }

  return (
    <Suspense fallback={<MiniPCDetailSkeleton />}>
      <MiniPCDetailClient miniPCData={miniPCData} />
    </Suspense>
  );
}

// Función para generar rutas estáticas (SEO y performance)
export async function generateStaticParams() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  
  try {
    const response = await fetch(`${baseUrl}/api/miniPCs?limit=all`, {
      cache: "force-cache",
    });

    if (!response.ok) {
      console.error("Failed to fetch Mini PCs for static generation");
      return [];
    }

    const data = await response.json();
    
    if (!data.data || !Array.isArray(data.data)) {
      return [];
    }

    return data.data.map((miniPC: any) => ({
      slug: generateSlug(
        miniPC.brand?.name || "",
        miniPC.model || "",
        miniPC.CPU?.model || "",
        miniPC.graphics?.model || ""
      ),
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

// Generar metadata dinámicamente
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const miniPCData = await fetchMiniPCDetail(slug);

  if (!miniPCData) {
    return {
      title: "Mini PC Not Found",
      description: "The requested Mini PC could not be found.",
    };
  }

  const { miniPC } = miniPCData;
  const title = `${miniPC.brand.name} ${miniPC.model} - ${miniPC.CPU.brand.name} ${miniPC.CPU.model}`;
  const description = miniPC.description?.en || 
    `${miniPC.brand.name} ${miniPC.model} Mini PC with ${miniPC.CPU.brand.name} ${miniPC.CPU.model} processor and ${miniPC.graphics.brand.name} ${miniPC.graphics.model} graphics. View specifications, prices and deals.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: miniPC.mainImgUrl?.[0] ? [
        {
          url: miniPC.mainImgUrl[0],
          width: 1200,
          height: 630,
          alt: title,
        }
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: miniPC.mainImgUrl?.[0] ? [miniPC.mainImgUrl[0]] : [],
    },
  };
}