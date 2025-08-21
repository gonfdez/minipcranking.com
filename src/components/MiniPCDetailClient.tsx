"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  ChevronLeft,
  Cpu,
  Gpu,
  HardDrive,
  Monitor,
  Wifi,
  Speaker,
  Calendar,
  Ruler,
  Cable,
  ShoppingCart,
  Package2,
  MemoryStick,
} from "lucide-react";

interface Brand {
  id: number;
  name: string;
  imgHref?: string;
}

interface CPU {
  id: number;
  model: string;
  brand: Brand;
  cores: number;
  threads: number;
  baseClockGHz?: number;
  boostClockGHz?: number;
}

interface Graphics {
  id: number;
  model: string;
  integrated: boolean;
  brand: Brand;
  frequencyMHz?: number;
  maxTOPS?: number;
  graphicCoresCU?: number;
}

interface Connectivity {
  id: number;
  type: string;
  speed?: {
    value: number;
    units: string;
  };
}

interface Ports {
  usb3?: number;
  usb2?: number;
  usb4?: number;
  usbC?: number;
  hdmi?: number;
  displayPort?: number;
  ethernet?: number;
  jack35mm?: number;
  sdCard?: number;
  microSD?: number;
  vga?: number;
  dvi?: number;
  thunderbolt?: number;
}

interface Dimensions {
  widthMM?: number;
  heightMM?: number;
  lengthMM?: number;
}

interface Variant {
  id: number;
  RAMGB: number;
  RAM_type: string;
  storageGB: number;
  storage_type: string;
  offers: Array<{
    url: string;
    price: number;
  }>;
}

interface MiniPC {
  id: number;
  model: string;
  mainImgUrl: string[];
  portsImgUrl: string[];
  brand: Brand;
  CPU: CPU;
  graphics: Graphics;
  description?: {
    en?: string;
  };
  fromURL: string;
  manualURL?: string;
  manualCollect: boolean;
  maxRAMCapacityGB?: number;
  maxStorageCapacityGB?: number;
  weightKg?: number;
  powerConsumptionW?: number;
  releaseYear?: number;
  dimensions: Dimensions;
  ports: Ports;
  connectivity: Connectivity[];
  builtinMicrophone?: boolean;
  builtinSpeakers?: boolean;
  supportExternalDiscreteGraphicsCard?: boolean;
  variants: Variant[];
  minPrice?: number;
}

interface Props {
  miniPCData: {
    miniPC: MiniPC;
  };
}

export function MiniPCDetailClient({ miniPCData }: Props) {
  const { miniPC } = miniPCData;
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    miniPC.variants?.[0] || null
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getMinPrice = (variant: Variant) => {
    if (!variant.offers || variant.offers.length === 0) return null;
    return Math.min(...variant.offers.map((offer) => offer.price));
  };

  const formatDimensions = (dimensions: Dimensions) => {
    const { widthMM, heightMM, lengthMM } = dimensions;
    if (!widthMM || !heightMM || !lengthMM) return "N/A";
    return `${widthMM} × ${heightMM} × ${lengthMM} mm`;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 mb-6 text-sm">
        <Link
          href="/minipc"
          className="text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4 inline mr-1" />
          Mini PC's
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="font-medium">{miniPC.brand.name}</span>
        <span className="font-medium">{miniPC.model}</span>
      </nav>

      {/* Title and basic info */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          {miniPC.brand.name} {miniPC.model}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
          <span className="flex items-center gap-1">
            <Cpu className="h-4 w-4" />
            {miniPC.CPU.brand.name} {miniPC.CPU.model}
          </span>
          <span className="flex items-center gap-1">
            <Gpu className="h-4 w-4" />
            {miniPC.graphics.brand.name} {miniPC.graphics.model}
          </span>
          {miniPC.releaseYear && (
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {miniPC.releaseYear}
            </span>
          )}
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        {/* Product & ports images carousel */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Monitor className="h-4 w-4" />
              Product Images
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Carousel className="mx-9 my-5">
              <CarouselContent>
                {miniPC.mainImgUrl
                  .concat(miniPC.portsImgUrl)
                  .map((imageUrl, index) => (
                    <CarouselItem key={index}>
                      <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                        <Image
                          src={imageUrl || "/placeholder-minipc.jpg"}
                          alt={`${miniPC.brand.name} ${miniPC.model} - Image ${
                            index + 1
                          }`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                      </div>
                    </CarouselItem>
                  ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>

            {/* Descripción debajo del carousel */}
            {miniPC.description?.en && (
              <div className="mt-4">
                <h4 className="font-medium text-sm mb-2">Description</h4>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  {miniPC.description.en}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* CPU Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Cpu className="h-4 w-4" />
                Processor
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Brand</span>
                <span className="font-medium">{miniPC.CPU.brand.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Model</span>
                <span className="font-medium">{miniPC.CPU.model}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Cores</span>
                <span className="font-medium">{miniPC.CPU.cores}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Threads</span>
                <span className="font-medium">{miniPC.CPU.threads}</span>
              </div>
              {miniPC.CPU.baseClockGHz && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Base Clock</span>
                  <span className="font-medium">
                    {miniPC.CPU.baseClockGHz} GHz
                  </span>
                </div>
              )}
              {miniPC.CPU.boostClockGHz && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Boost Clock</span>
                  <span className="font-medium">
                    {miniPC.CPU.boostClockGHz} GHz
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Graphics Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Gpu className="h-4 w-4" />
                Graphics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Brand</span>
                <span className="font-medium">
                  {miniPC.graphics.brand.name}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Model</span>
                <span className="font-medium">{miniPC.graphics.model}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Type</span>
                <span className="font-medium">
                  {miniPC.graphics.integrated ? "Integrated" : "Discrete"}
                </span>
              </div>
              {miniPC.graphics.frequencyMHz && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Frequency</span>
                  <span className="font-medium">
                    {miniPC.graphics.frequencyMHz} MHz
                  </span>
                </div>
              )}
              {miniPC.graphics.maxTOPS && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Max TOPS</span>
                  <span className="font-medium">{miniPC.graphics.maxTOPS}</span>
                </div>
              )}
              {miniPC.graphics.graphicCoresCU && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Cores/CUs</span>
                  <span className="font-medium">
                    {miniPC.graphics.graphicCoresCU}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Model Specifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Ruler className="h-4 w-4" />
                Model Specifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {miniPC.maxRAMCapacityGB && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Max RAM</span>
                  <span className="font-medium">
                    {miniPC.maxRAMCapacityGB} GB
                  </span>
                </div>
              )}
              {miniPC.maxStorageCapacityGB && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Max Storage</span>
                  <span className="font-medium">
                    {miniPC.maxStorageCapacityGB} GB
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-1 text-muted-foreground">
                  Microphone
                </span>
                <span className="font-medium">
                  {miniPC.builtinMicrophone ? "Yes" : "No"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-1 text-muted-foreground">
                  Speakers
                </span>
                <span className="font-medium">
                  {miniPC.builtinSpeakers ? "Yes" : "No"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-1 text-muted-foreground">
                  External GPU
                </span>
                <span className="font-medium">
                  {miniPC.supportExternalDiscreteGraphicsCard ? "Yes" : "No"}
                </span>
              </div>
              {formatDimensions(miniPC.dimensions) !== "N/A" && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Dimensions</span>
                  <span className="font-medium text-xs">
                    {formatDimensions(miniPC.dimensions)}
                  </span>
                </div>
              )}
              {miniPC.weightKg && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Weight</span>
                  <span className="font-medium">{miniPC.weightKg} kg</span>
                </div>
              )}
              {miniPC.powerConsumptionW && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Power</span>
                  <span className="font-medium">
                    {miniPC.powerConsumptionW}W
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Connectivity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Cable className="h-4 w-4" />
                Connectivity & Ports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-y-3 gap-x-4 overflow-y-auto">
                {/* USB Ports */}
                {miniPC.ports.usb3 && miniPC.ports.usb3 > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <Cable className="h-3 w-3 text-blue-500" />
                    <span className="text-muted-foreground">
                      {miniPC.ports.usb3}× USB 3.0
                    </span>
                  </div>
                )}
                {miniPC.ports.usb2 && miniPC.ports.usb2 > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <Cable className="h-3 w-3 text-blue-400" />
                    <span className="text-muted-foreground">
                      {miniPC.ports.usb2}× USB 2.0
                    </span>
                  </div>
                )}
                {miniPC.ports.usb4 && miniPC.ports.usb4 > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <Cable className="h-3 w-3 text-blue-600" />
                    <span className="text-muted-foreground">
                      {miniPC.ports.usb4}× USB 4.0
                    </span>
                  </div>
                )}
                {miniPC.ports.usbC && miniPC.ports.usbC > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <Cable className="h-3 w-3 text-purple-500" />
                    <span className="text-muted-foreground">
                      {miniPC.ports.usbC}× USB-C
                    </span>
                  </div>
                )}
                {miniPC.ports.thunderbolt && miniPC.ports.thunderbolt > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <Cable className="h-3 w-3 text-yellow-500" />
                    <span className="text-muted-foreground">
                      {miniPC.ports.thunderbolt}× Thunderbolt
                    </span>
                  </div>
                )}

                {/* Display Ports */}
                {miniPC.ports.hdmi && miniPC.ports.hdmi > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <Monitor className="h-3 w-3 text-red-500" />
                    <span className="text-muted-foreground">
                      {miniPC.ports.hdmi}× HDMI
                    </span>
                  </div>
                )}
                {miniPC.ports.displayPort && miniPC.ports.displayPort > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <Monitor className="h-3 w-3 text-green-500" />
                    <span className="text-muted-foreground">
                      {miniPC.ports.displayPort}× DisplayPort
                    </span>
                  </div>
                )}
                {miniPC.ports.vga && miniPC.ports.vga > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <Monitor className="h-3 w-3 text-gray-500" />
                    <span className="text-muted-foreground">
                      {miniPC.ports.vga}× VGA
                    </span>
                  </div>
                )}
                {miniPC.ports.dvi && miniPC.ports.dvi > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <Monitor className="h-3 w-3 text-gray-600" />
                    <span className="text-muted-foreground">
                      {miniPC.ports.dvi}× DVI
                    </span>
                  </div>
                )}

                {/* Network & Other */}
                {miniPC.ports.ethernet && miniPC.ports.ethernet > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <Wifi className="h-3 w-3 text-green-600" />
                    <span className="text-muted-foreground">
                      {miniPC.ports.ethernet}× Ethernet
                    </span>
                  </div>
                )}
                {miniPC.ports.jack35mm && miniPC.ports.jack35mm > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <Speaker className="h-3 w-3 text-orange-500" />
                    <span className="text-muted-foreground">
                      {miniPC.ports.jack35mm}× 3.5mm Jack
                    </span>
                  </div>
                )}

                {/* Storage Ports */}
                {miniPC.ports.sdCard && miniPC.ports.sdCard > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <HardDrive className="h-3 w-3 text-indigo-500" />
                    <span className="text-muted-foreground">
                      {miniPC.ports.sdCard}× SD Card
                    </span>
                  </div>
                )}
                {miniPC.ports.microSD && miniPC.ports.microSD > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <HardDrive className="h-3 w-3 text-indigo-400" />
                    <span className="text-muted-foreground">
                      {miniPC.ports.microSD}× MicroSD
                    </span>
                  </div>
                )}
              </div>

              {/* Wireless Connectivity */}
              {miniPC.connectivity && miniPC.connectivity.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <h5 className="text-sm font-medium mb-2">Wireless</h5>

                  {miniPC.connectivity.map((conn, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span className="flex items-center gap-2 text-sm">
                        <Wifi className="h-3 w-3 text-blue-500" />
                        <span className="text-muted-foreground">
                          {conn.type}
                        </span>
                      </span>
                      {conn.speed && (
                        <Badge variant="outline" className="text-xs">
                          {conn.speed.value} {conn.speed.units}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Variants Grid - 3 columnas */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Available Configurations</h2>
        {miniPC.variants && miniPC.variants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {miniPC.variants.map((variant, index) => (
              <Card
                key={variant.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedVariant?.id === variant.id
                    ? "border-primary shadow-md"
                    : "border-border"
                }`}
                onClick={() => setSelectedVariant(variant)}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <MemoryStick className="h-4 w-4 text-muted-foreground" />
                        {variant.RAMGB}GB RAM {variant.RAM_type}
                      </div>
                      <div className="flex items-center gap-2">
                        <Package2 className="h-4 w-4 text-muted-foreground" />
                        {variant.storageGB}GB {variant.storage_type}
                      </div>
                    </div>
                  </CardTitle>
                  {getMinPrice(variant) && (
                    <p className="text-xl font-bold text-green-600">
                      From {formatPrice(getMinPrice(variant)!)}
                    </p>
                  )}
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Offers */}
                  {variant.offers && variant.offers.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        {variant.offers.length} offer
                        {variant.offers.length > 1 ? "s" : ""} available
                      </p>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {variant.offers.map((offer, offerIndex) => (
                          <div
                            key={offerIndex}
                            className="flex justify-between items-center p-2 bg-muted/50 rounded-md"
                          >
                            <span className="font-semibold text-green-600 text-sm">
                              {formatPrice(offer.price)}
                            </span>
                            <Button size="sm" asChild>
                              <Link
                                href={offer.url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ShoppingCart className="h-3 w-3 mr-1" />
                                Buy
                              </Link>
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground">
                No variant information available
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
