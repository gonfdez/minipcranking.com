import { Badge } from "@/components/ui/badge";

interface MiniPCDetailsProps {
  miniPC: {
    brand: { name: string };
    model: string;
    CPU: {
      model: string;
      brand: { name: string };
    };
    graphics: {
      model: string;
      brand: { name: string };
    };
    maxRAMCapacityGB?: number | null;
    maxStorageCapacityGB?: number | null;
    weightKg?: number | null;
    powerConsumptionW?: number | null;
    releaseYear?: number | null;
    manualCollect: boolean;
    fromURL: string;
    manualURL?: string | null;
    mainImgUrl: string[];
    portsImgUrl?: string[];
    description?: {
      en: string;
      es?: string;
      it?: string;
      de?: string;
    };
    dimensions?: {
      widthMM?: number | null;
      heightMM?: number | null;
      lengthMM?: number | null;
    };
    ports?: {
      usb3?: number | null;
      usb2?: number | null;
      usbC?: number | null;
      hdmi?: number | null;
      displayPort?: number | null;
      ethernet?: number | null;
      jack35mm?: number | null;
      sdCard?: number | null;
      microSD?: number | null;
      vga?: number | null;
      dvi?: number | null;
      thunderbolt?: number | null;
    };
    connectivity?: Array<{ type: string; speed?: string }>;
    builtinMicrophone?: boolean;
    builtinSpeakers?: boolean;
    supportExternalDiscreteGraphicsCard?: boolean;
    variants: Array<{
      id?: number;
      RAMGB: number;
      RAM_type: string;
      storageGB: number;
      storage_type: string;
      offers: Array<{ url: string; price: number }>;
    }>;
  };
  showTitle?: boolean;
}

export function MiniPCDetailsView({ miniPC, showTitle = true }: MiniPCDetailsProps) {
  const formatPortName = (portKey: string): string => {
    const portNames: Record<string, string> = {
      usb3: "USB 3.0",
      usb2: "USB 2.0",
      usbC: "USB-C",
      hdmi: "HDMI",
      displayPort: "DisplayPort",
      ethernet: "Ethernet",
      jack35mm: "3.5mm Jack",
      sdCard: "SD Card",
      microSD: "MicroSD",
      vga: "VGA",
      dvi: "DVI",
      thunderbolt: "Thunderbolt"
    };
    return portNames[portKey] || portKey.toUpperCase();
  };

  const truncateUrl = (url: string, maxLength: number = 50): string => {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + "...";
  };

  const renderPortsInfo = () => {
    if (!miniPC.ports) return null;
    
    const activePorts = Object.entries(miniPC.ports).filter(([_, count]) => count && count > 0);
    
    if (activePorts.length === 0) return <span className="text-gray-500">No ports specified</span>;
    
    return (
      <div className="flex flex-wrap gap-2">
        {activePorts.map(([portKey, count]) => (
          <Badge key={portKey} variant="outline" className="text-sm">
            {formatPortName(portKey)}: {count}
          </Badge>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {showTitle && (
        <div className="text-xl font-bold">
          {miniPC.brand.name} {miniPC.model}
        </div>
      )}

      {/* Basic Info */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">Basic Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="font-semibold">Brand:</span> {miniPC.brand.name}
          </div>
          <div>
            <span className="font-semibold">Model:</span> {miniPC.model}
          </div>
          <div>
            <span className="font-semibold">CPU:</span> {miniPC.CPU.brand.name} {miniPC.CPU.model}
          </div>
          <div>
            <span className="font-semibold">Graphics:</span> {miniPC.graphics.brand.name} {miniPC.graphics.model}
          </div>
          <div>
            <span className="font-semibold">Release Year:</span> {miniPC.releaseYear || "N/A"}
          </div>
          <div>
            <span className="font-semibold">Manual Collect:</span> {miniPC.manualCollect ? "Yes" : "No"}
          </div>
        </div>
      </div>

      {/* Specifications */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">Specifications</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="font-semibold">Max RAM:</span>{" "}
            {miniPC.maxRAMCapacityGB ? `${miniPC.maxRAMCapacityGB} GB` : "N/A"}
          </div>
          <div>
            <span className="font-semibold">Max Storage:</span>{" "}
            {miniPC.maxStorageCapacityGB ? `${miniPC.maxStorageCapacityGB} GB` : "N/A"}
          </div>
          <div>
            <span className="font-semibold">Weight:</span>{" "}
            {miniPC.weightKg ? `${miniPC.weightKg} kg` : "N/A"}
          </div>
          <div>
            <span className="font-semibold">Power:</span>{" "}
            {miniPC.powerConsumptionW ? `${miniPC.powerConsumptionW} W` : "N/A"}
          </div>
        </div>
      </div>

      {/* Dimensions */}
      {miniPC.dimensions && (miniPC.dimensions.widthMM || miniPC.dimensions.heightMM || miniPC.dimensions.lengthMM) && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Dimensions</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <span className="font-semibold">Width:</span>{" "}
              {miniPC.dimensions.widthMM ? `${miniPC.dimensions.widthMM} mm` : "N/A"}
            </div>
            <div>
              <span className="font-semibold">Height:</span>{" "}
              {miniPC.dimensions.heightMM ? `${miniPC.dimensions.heightMM} mm` : "N/A"}
            </div>
            <div>
              <span className="font-semibold">Length:</span>{" "}
              {miniPC.dimensions.lengthMM ? `${miniPC.dimensions.lengthMM} mm` : "N/A"}
            </div>
          </div>
        </div>
      )}

      {/* Ports */}
      {miniPC.ports && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Ports</h3>
          {renderPortsInfo()}
        </div>
      )}

      {/* Connectivity */}
      {miniPC.connectivity && miniPC.connectivity.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Connectivity</h3>
          <div className="flex flex-wrap gap-2">
            {miniPC.connectivity.map((conn, index) => {
              const formatSpeed = (speed: string | undefined) => {
                if (!speed) return '';
                try {
                  const speedObj = typeof speed === 'string' ? JSON.parse(speed) : speed;
                  if (speedObj && speedObj.value && speedObj.units) {
                    return <span className="text-blue-600">({speedObj.value} {speedObj.units})</span>;
                  }
                  return speed;
                } catch (error) {
                  return speed;
                }
              };

              return (
                <Badge key={index} variant="secondary">
                  {conn.type} {formatSpeed(conn.speed)}
                </Badge>
              );
            })}
          </div>
        </div>
      )}

      {/* Features */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">Features</h3>
        <div className="flex flex-wrap gap-2">
          {miniPC.builtinMicrophone && (
            <Badge variant="outline">Built-in Microphone</Badge>
          )}
          {miniPC.builtinSpeakers && (
            <Badge variant="outline">Built-in Speakers</Badge>
          )}
          {miniPC.supportExternalDiscreteGraphicsCard && (
            <Badge variant="outline">External GPU Support</Badge>
          )}
        </div>
      </div>

      {/* Description */}
      {miniPC.description && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Description</h3>
          <div className="space-y-2">
            <div>
              <span className="font-semibold">English:</span>
              <p className="mt-1 text-gray-700">{miniPC.description.en}</p>
            </div>
            {miniPC.description.es && (
              <div>
                <span className="font-semibold">Spanish:</span>
                <p className="mt-1 text-gray-700">{miniPC.description.es}</p>
              </div>
            )}
            {miniPC.description.it && (
              <div>
                <span className="font-semibold">Italian:</span>
                <p className="mt-1 text-gray-700">{miniPC.description.it}</p>
              </div>
            )}
            {miniPC.description.de && (
              <div>
                <span className="font-semibold">German:</span>
                <p className="mt-1 text-gray-700">{miniPC.description.de}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* URLs */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">URLs</h3>
        <div className="space-y-2">
          <div>
            <span className="font-semibold">Source URL:</span>{" "}
            <a
              href={miniPC.fromURL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
              title={miniPC.fromURL}
            >
              {truncateUrl(miniPC.fromURL, 40)}
            </a>
          </div>
          {miniPC.manualURL && (
            <div>
              <span className="font-semibold">Manual URL:</span>{" "}
              <a
                href={miniPC.manualURL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
                title={miniPC.manualURL}
              >
                {truncateUrl(miniPC.manualURL, 40)}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Main Images */}
      {miniPC.mainImgUrl && miniPC.mainImgUrl.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Main Images</h3>
          <div className="grid grid-cols-2 gap-4">
            {miniPC.mainImgUrl.map((url, index) => (
              <div key={index} className="space-y-2">
                <img
                  src={url}
                  alt={`${miniPC.model} image ${index + 1}`}
                  className="w-full h-40 object-cover rounded border"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                <p className="text-sm text-gray-500" title={url}>
                  {truncateUrl(url, 40)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ports Images */}
      {miniPC.portsImgUrl && miniPC.portsImgUrl.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Ports Images</h3>
          <div className="grid grid-cols-2 gap-4">
            {miniPC.portsImgUrl.map((url, index) => (
              <div key={index} className="space-y-2">
                <img
                  src={url}
                  alt={`${miniPC.model} ports image ${index + 1}`}
                  className="w-full h-40 object-cover rounded border"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                <p className="text-sm text-gray-500" title={url}>
                  {truncateUrl(url, 40)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Variants */}
      {miniPC.variants && miniPC.variants.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Variants</h3>
          <div className="space-y-4">
            {miniPC.variants.map((variant, index) => (
              <div key={variant.id || index} className="border rounded p-4 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium">RAM:</span>{" "}
                    {variant.RAMGB} GB ({variant.RAM_type})
                  </div>
                  <div>
                    <span className="font-medium">Storage:</span>{" "}
                    {variant.storageGB} GB ({variant.storage_type})
                  </div>
                </div>
                <div>
                  <span className="font-medium">Offers:</span>
                  <div className="mt-2 space-y-2">
                    {variant.offers.map((offer, offerIndex) => (
                      <div
                        key={offerIndex}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded"
                      >
                        <span className="font-medium text-green-600">
                          ${offer.price.toFixed(2)}
                        </span>
                        <a
                          href={offer.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm"
                          title={offer.url}
                        >
                          {truncateUrl(offer.url, 35)}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}