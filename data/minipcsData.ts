interface MiniPcInterface {
  id: string
  title: string
  brand: string
  model: string
  description: string
  href?: string
  imgSrc?: string
  cpu: {
    brand: string
    model: string
    cores: number
    threads: number
    baseClockGHz: number
    boostClockGHz?: number
  }
  ramGB: number
  ramType: string
  maxRamGB?: number
  graphics: {
    integrated: boolean
    brand?: string
    model?: string
  }
  storage: {
    type: 'SSD' | 'HDD' | 'eMMC' | 'SSD + HDD'
    capacityGB: number
  }
  ports: {
    usbA?: number
    usbC?: number
    hdmi?: number
    displayPort?: number
    ethernet?: number
    audioJack?: boolean
    sdCardReader?: boolean
  }
  connectivity: {
    wifi: string // ej: "Wi-Fi 6E"
    bluetooth: string // ej: "Bluetooth 5.2"
  }
  dimensions: {
    widthMm: number
    heightMm: number
    depthMm: number
  }
  weightKg: number
  powerConsumptionW?: number
  osIncluded?: string
  releaseYear?: number
  priceUsd?: number
  rating?: number // valoración promedio del usuario
}

const miniPcsData: MiniPcInterface[] = [
  {
    id: 'beelink-ser5-pro',
    title: 'Beelink SER5 Pro',
    brand: 'Beelink',
    model: 'SER5 Pro',
    description:
      'Mini PC compacto con potente CPU Ryzen, ideal para uso doméstico y productividad.',
    href: 'https://example.com/beelink-ser5-pro',
    imgSrc: '/static/images/BeelinkSER5Pro.jpeg',
    cpu: {
      brand: 'AMD',
      model: 'Ryzen 7 5800H',
      cores: 8,
      threads: 16,
      baseClockGHz: 3.2,
      boostClockGHz: 4.4,
    },
    ramGB: 16,
    ramType: 'DDR4',
    maxRamGB: 64,
    graphics: {
      integrated: true,
      brand: 'AMD',
      model: 'Radeon Graphics',
    },
    storage: {
      type: 'SSD',
      capacityGB: 512,
    },
    ports: {
      usbA: 4,
      usbC: 1,
      hdmi: 2,
      ethernet: 1,
      audioJack: true,
      sdCardReader: false,
    },
    connectivity: {
      wifi: 'Wi-Fi 6',
      bluetooth: 'Bluetooth 5.2',
    },
    dimensions: {
      widthMm: 126,
      heightMm: 42,
      depthMm: 113,
    },
    weightKg: 0.45,
    powerConsumptionW: 65,
    osIncluded: 'Windows 11 Pro',
    releaseYear: 2023,
    priceUsd: 499,
    rating: 4.5,
  },
  {
    id: 'msi-cubi-5',
    title: 'MSI Cubi 5',
    brand: 'MSI',
    model: 'Cubi 5 12M',
    description: 'Pequeño, eficiente y silencioso, ideal para oficina y multimedia básica.',
    href: 'https://example.com/msi-cubi-5',
    imgSrc: '/static/images/MSICUBI5.jpeg',
    cpu: {
      brand: 'Intel',
      model: 'Core i5-1235U',
      cores: 10,
      threads: 12,
      baseClockGHz: 1.3,
      boostClockGHz: 4.4,
    },
    ramGB: 8,
    ramType: 'DDR4',
    maxRamGB: 64,
    graphics: {
      integrated: true,
      brand: 'Intel',
      model: 'Iris Xe Graphics',
    },
    storage: {
      type: 'SSD',
      capacityGB: 256,
    },
    ports: {
      usbA: 3,
      usbC: 2,
      hdmi: 1,
      ethernet: 1,
      audioJack: true,
      sdCardReader: true,
    },
    connectivity: {
      wifi: 'Wi-Fi 6E',
      bluetooth: 'Bluetooth 5.3',
    },
    dimensions: {
      widthMm: 124,
      heightMm: 53,
      depthMm: 124,
    },
    weightKg: 0.55,
    powerConsumptionW: 40,
    osIncluded: 'Windows 11 Home',
    releaseYear: 2023,
    priceUsd: 459,
    rating: 4.3,
  },
]

export default miniPcsData
