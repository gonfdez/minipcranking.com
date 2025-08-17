"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Gpu,
  ChevronDown,
  ChevronUp,
  X,
  BadgeDollarSign,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Brand {
  id: number;
  name: string;
  imgHref?: string;
}

interface CPU {
  id: number;
  model: string;
  cores: number;
  threads: number;
  brand: Brand;
}

interface Graphics {
  id: number;
  model: string;
  integrated: boolean;
  brand: Brand;
}

interface MiniPC {
  id: number;
  model: string;
  description: { en?: string };
  mainImgUrl: string[];
  brand: Brand;
  CPU: CPU;
  graphics: Graphics;
  maxRAMCapacityGB?: number;
  maxStorageCapacityGB?: number;
  releaseYear?: number;
  powerConsumptionW?: number;
  weightKg?: number;
  minPrice?: number | null;
}

interface MiniPCData {
  data: MiniPC[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
}

interface BrandsData {
  brands: Brand[];
  cpuBrands: Brand[];
}

interface Filters {
  search: string;
  brand: string;
  cpuBrand: string;
  minRam: string;
  maxPrice: string;
  releaseYear: string;
  integratedGraphics: string;
}

interface Props {
  initialData: MiniPCData;
  brandsData: BrandsData;
  initialFilters: any;
}

export function MiniPCClient({ initialData, brandsData, initialFilters }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  
  const [data, setData] = useState<MiniPCData>(initialData);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    search: initialFilters.search || "",
    brand: initialFilters.brand || "",
    cpuBrand: initialFilters.cpuBrand || "",
    minRam: initialFilters.minRam || "",
    maxPrice: initialFilters.maxPrice || "",
    releaseYear: initialFilters.releaseYear || "",
    integratedGraphics: initialFilters.integratedGraphics || "",
  });

  // Contar filtros activos
  const getActiveFiltersCount = () => {
    return Object.entries(filters).filter(
      ([key, value]) => key !== "search" && value !== ""
    ).length;
  };

  // Actualizar URL y datos
  const updateFilters = (newFilters: Partial<Filters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);

    // Crear nuevos searchParams
    const params = new URLSearchParams();
    Object.entries(updatedFilters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    
    // Reset page si no es una navegación de página
    if (!newFilters.hasOwnProperty('page')) {
      params.delete('page');
    }

    startTransition(() => {
      router.push(`/minipc?${params.toString()}`);
    });
  };

  // Manejar cambio de página
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    
    startTransition(() => {
      router.push(`/minipc?${params.toString()}`);
    });
  };

  const handleFilterChange = (key: keyof Filters, value: string) => {
    updateFilters({ [key]: value });
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      brand: "",
      cpuBrand: "",
      minRam: "",
      maxPrice: "",
      releaseYear: "",
      integratedGraphics: "",
    });
    
    startTransition(() => {
      router.push('/minipc');
    });
  };

  const formatPrice = (price: number | null) => {
    if (!price) return null;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Actualizar datos cuando cambian los searchParams
  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = new URLSearchParams(searchParams);
        const response = await fetch(`/api/miniPCs?${params.toString()}`);
        if (response.ok) {
          const newData = await response.json();
          setData(newData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [searchParams]);

  const activeFiltersCount = getActiveFiltersCount();

  const getYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= 2018; year--) {
      years.push(year);
    }
    return years;
  };

  return (
    <>
      <div className="mb-4">
        <h1 className="text-4xl font-bold mb-2">Mini PC's</h1>
        <p className="text-muted-foreground mb-6">
          Explore our collection of Mini PC's with detailed specifications and
          updated deals
        </p>

        {/* Barra de búsqueda principal */}
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by model or brand..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Filtros Colapsibles */}
      <Card className="mb-8 p-0 rounded-md">
        <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
          <CollapsibleTrigger asChild className="px-3 py-1 h-9 items-center">
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors gap-0">
              <div className="flex items-center justify-between">
                <div className={`flex items-center gap-3 ${activeFiltersCount === 0 ? "text-muted-foreground" : ""}`}>
                  <Filter className="h-4 w-4" />
                  <CardTitle className="text-md font-normal">
                    Filters
                  </CardTitle>
                  {activeFiltersCount > 0 && (
                    <span className="bg-primary text-primary-foreground text-xs px-1 rounded-full">
                      {activeFiltersCount}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {activeFiltersCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        clearFilters();
                      }}
                      className="h-7 px-2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Clear
                    </Button>
                  )}
                  {isFiltersOpen ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </div>
              </div>
            </CardHeader>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <CardContent className="p-4">
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium mb-3 text-muted-foreground">
                    Brand & Specifications
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Marca */}
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground">
                        Brand
                      </label>
                      <Select
                        value={filters.brand}
                        onValueChange={(value) =>
                          handleFilterChange(
                            "brand",
                            value === "all" ? "" : value
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="All brands" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All brands</SelectItem>
                          {brandsData.brands.map((brand) => (
                            <SelectItem
                              key={brand.id}
                              value={brand.id.toString()}
                            >
                              {brand.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* CPU Brand */}
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground">
                        Processor
                      </label>
                      <Select
                        value={filters.cpuBrand}
                        onValueChange={(value) =>
                          handleFilterChange(
                            "cpuBrand",
                            value === "all" ? "" : value
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="All processors" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All processors</SelectItem>
                          {brandsData.cpuBrands.map((brand) => (
                            <SelectItem
                              key={brand.id}
                              value={brand.id.toString()}
                            >
                              {brand.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* RAM mínima */}
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground">
                        Memory (RAM)
                      </label>
                      <Select
                        value={filters.minRam}
                        onValueChange={(value) =>
                          handleFilterChange(
                            "minRam",
                            value === "all" ? "" : value
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Any RAM" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Any RAM</SelectItem>
                          <SelectItem value="8">8GB or more</SelectItem>
                          <SelectItem value="16">16GB or more</SelectItem>
                          <SelectItem value="32">32GB or more</SelectItem>
                          <SelectItem value="64">64GB or more</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-3 text-muted-foreground">
                    Additional Filters
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Año de lanzamiento */}
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground">
                        Release Year
                      </label>
                      <Select
                        value={filters.releaseYear}
                        onValueChange={(value) =>
                          handleFilterChange(
                            "releaseYear",
                            value === "all" ? "" : value
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Any year" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Any year</SelectItem>
                          {getYearOptions().map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Gráficos integrados */}
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground">
                        Graphics Type
                      </label>
                      <Select
                        value={filters.integratedGraphics}
                        onValueChange={(value) =>
                          handleFilterChange(
                            "integratedGraphics",
                            value === "all" ? "" : value
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Any graphics" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Any graphics</SelectItem>
                          <SelectItem value="true">
                            Integrated Graphics
                          </SelectItem>
                          <SelectItem value="false">
                            Dedicated Graphics
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-end">
                      <Button
                        variant="outline"
                        onClick={clearFilters}
                        className="w-full"
                        disabled={activeFiltersCount === 0}
                      >
                        Reset All Filters
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Resultados y paginación info */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-muted-foreground">
          Showing {(data.currentPage - 1) * data.itemsPerPage + 1} -{" "}
          {Math.min(data.currentPage * data.itemsPerPage, data.totalCount)} of {data.totalCount}{" "}
          Mini PC's
        </p>
      </div>

      {/* Grid de Mini PC's */}
      {isPending ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <Card
              key={i}
              className="group overflow-hidden p-0 gap-0 animate-pulse"
            >
              <div className="relative h-48 w-full bg-muted">
                <div className="absolute bottom-0 left-0 bg-muted-foreground/20 backdrop-blur-sm p-3 w-fit rounded-tr-lg">
                  <div className="h-6 w-32 bg-muted-foreground/30 rounded"></div>
                </div>
              </div>
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
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {data.data.map((miniPC) => (
            <Link key={miniPC.id} href={`/minipc/${miniPC.id}`}>
              <Card className="group overflow-hidden hover:shadow-xl transition-shadow cursor-pointer p-0 gap-0">
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={miniPC.mainImgUrl[0] || "/placeholder-minipc.jpg"}
                    alt={`${miniPC.brand.name} ${miniPC.model}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />

                  {/* Nombre del PC con fondo blur */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/40 backdrop-blur-sm p-3 w-fit rounded-tr-lg">
                    <h3 className="text-white font-semibold text-lg leading-tight">
                      {miniPC.brand.name} {miniPC.model}
                    </h3>
                  </div>
                </div>

                {/* Especificaciones fuera de la imagen */}
                <CardContent className="p-4">
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Cpu className="w-4 h-4 mr-2" />
                      <span className="text-foreground">
                        {miniPC.CPU.brand.name} {miniPC.CPU.model}
                      </span>
                    </div>

                    <div className="flex items-center">
                      <Gpu className="w-4 h-4 mr-2" />
                      <span className="text-foreground">
                        {miniPC.graphics.brand.name} {miniPC.graphics.model}
                      </span>
                    </div>

                    {/* Mostrar precio también en el contenido si no hay precio en la imagen */}
                    {miniPC.minPrice && (
                      <div className="flex items-center">
                        <BadgeDollarSign className="w-4 h-4 mr-2 text-green-600" />
                        <span className="text-green-600 font-semibold">
                          From {formatPrice(miniPC.minPrice)}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Mensaje si no hay resultados */}
      {!isPending && data.data.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg mb-4">
            No Mini PC's found with the applied filters
          </p>
          <Button variant="outline" onClick={clearFilters}>
            Clear filters
          </Button>
        </div>
      )}

      {/* Paginación */}
      {data.totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(Math.max(data.currentPage - 1, 1))}
              disabled={data.currentPage === 1 || isPending}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, data.totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <Button
                    key={pageNum}
                    variant={data.currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageNum)}
                    disabled={isPending}
                  >
                    {pageNum}
                  </Button>
                );
              })}

              {data.totalPages > 5 && (
                <>
                  <span className="px-2">...</span>
                  <Button
                    variant={data.currentPage === data.totalPages ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(data.totalPages)}
                    disabled={isPending}
                  >
                    {data.totalPages}
                  </Button>
                </>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(Math.min(data.currentPage + 1, data.totalPages))}
              disabled={data.currentPage === data.totalPages || isPending}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}