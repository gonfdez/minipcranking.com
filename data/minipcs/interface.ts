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
  variants: {
    ramGB: number
    ramType: string
    storage: {
      type: string
      capacityGB: number
    }
    priceUsd?: number
  }[]
  maxRAMCapacityGB?: number
  maxStorageGB?: number
  graphics: {
    integrated: boolean
    brand?: string
    model?: string
    frequencyMHz?: number
  }
  integratedMicrophone: boolean
  ports: {
    usb4?: number
    usb3?: number
    usb2?: number
    hdmi?: number
    dp1?: number
    usbC?: number
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
  releaseYear?: number
}
