export type BrandData = {
  id: number;
  name: string;
  imgHref?: string | null;
};

export type CPUWithBrand = {
  id: number;
  brand: number;
  model: string;
  cores: number;
  threads: number;
  baseClockGHz?: number | null;
  boostClockGHz?: number | null;
  brandData?: BrandData;
};

export type GraphicsWithBrand = {
  id: number;
  model: string;
  integrated: boolean;
  brand: number;
  frequencyMHz?: number | null;
  maxTOPS?: number | null;
  graphicCoresCU?: number | null;
  brandData?: BrandData;
};

export type ConnectivityData = {
  id: number;
  type: string;
  speed?: {
    value: number;
    units: string;
  } | null;
};


export interface MiniPC {
  id: number;
  model: string;
  brand: { name: string };
  CPU: {
    model: string;
    brand: { name: string };
  };
  graphics: {
    model: string;
    brand: { name: string };
  };
  maxRAMCapacityGB: number | null;
  maxStorageCapacityGB: number | null;
  weightKg: number | null;
  powerConsumptionW: number | null;
  releaseYear: number | null;
  fromURL: string;
  manualURL?: string | null;
  manualCollect: boolean;
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
    usb4?: number | null;
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
  connectivity: Array<{ id: number; type: string; speed?: string }>;
  builtinMicrophone?: boolean;
  builtinSpeakers?: boolean;
  supportExternalDiscreteGraphicsCard?: boolean;
  variants: {
    id: number;
    RAMGB: number;
    RAM_type: string;
    storageGB: number;
    storage_type: string;
    offers: { url: string; price: number }[];
  }[];
  created_at: string;
}