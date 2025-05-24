interface MiniPcExtractedData {
  model: string;
  description: Record<"en" | "es", string>; // min 100 palabras max 250
  fromURL: string;
  manualCollect: boolean;
  mainImgUrls: string[];
  portsImgUrls: string[];
  cpu: {
    brand: string;
    model: string;
    cores: number;
    threads: number;
    baseClockGHz?: number;
    boostClockGHz?: number;
    cache?: {
      type: string;
      capacityMB: number;
    };
  };
  variants: {
    ram: {
      capacityGB: number;
      type: string;
    };
    storage: {
      type: string;
      capacityGB: number;
    };
    oferts: {
      url: string;
      priceUsd?: number;
      warrantyYears?: number;
    }[];
  }[];
  maxRAMCapacityGB?: number;
  maxStorageCapacityGB?: number;
  graphics: {
    integrated: boolean;
    brand: string;
    model: string;
    frequencyMHz?: number;
    maxTOPS?: number;
    graphicCoresCU?: number;
    displayPorts: {
      thunderbolt?: {
        amount: number;
        type: string;
      };
      dp?: {
        amount: number;
        type: string;
      };
      hdmi?: {
        amount: number;
        type: string;
      };
      usb4?: {
        amount: number;
        type: string;
      };
    };
  };
  ports: {
    usb4?: number;
    usb3?: number;
    usb2?: number;
    usbC?: number;
    ethernet?: number;
    audioJack?: boolean;
    sdCardReader?: boolean;
  };
  builtinMicrophone?: boolean;
  builtinSpeakers?: boolean;
  supportExternalDiscreteGraphicsCard?: boolean;
  connectivity: {
    wifi: string; // ej: "Wi-Fi 6E"
    bluetooth: string; // ej: "Bluetooth 5.2"
  };
  dimensions: {
    widthMm?: number;
    heightMm?: number;
    depthMm?: number;
    volumeL?: number;
  };
  weightKg: number;
  powerConsumptionW?: number;
  releaseYear?: number;
}

export default MiniPcExtractedData;
