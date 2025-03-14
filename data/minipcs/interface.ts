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
