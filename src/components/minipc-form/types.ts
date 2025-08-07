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