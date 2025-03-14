import { MINI_PC_BRAND } from './brands'
import { MINI_PC_ID } from './id'

const miniPcsData: MiniPcInterface[] = [
  {
    id: MINI_PC_ID.BeelinkSER5Pro,
    title: 'Beelink SER5 Pro',
    brand: MINI_PC_BRAND.Beelink,
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
    id: MINI_PC_ID.MSICubi5,
    title: 'MSI Cubi 5',
    brand: MINI_PC_BRAND.Beelink,
    model: 'Cubi 5',
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
