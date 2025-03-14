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
    frequencyMHz?: number
  }
  integratedMicrophone: boolean
  storage: {
    type: string
    capacityGB: number
    maxCapacityGB: number
  }
  ports: {
    usb4?: number
    usb3?: number
    usb2?: number
    hdmi?: number
    dp1?: number
    typeC?: number
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
