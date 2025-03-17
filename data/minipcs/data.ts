import { CPU_BRAND, MINI_PC_BRAND, MINI_PC_PROVIDER } from './brands'
import { MINI_PC_ID } from './id'

const miniPcsData: MiniPcInterface[] = [
  {
    id: MINI_PC_ID.BeelinkSER9ProAMDRyzenAI9HX370,
    title: 'Beelink SER9 Pro AMD Ryzen AI 9 HX 370',
    brand: MINI_PC_BRAND.Beelink,
    model: 'SER9 Pro AMD Ryzen AI 9 HX 370',
    description:
      "12 Zen5 CPU cores, combined with a new Radeon 890M iGPU, a new generation XDNA 2 NPU and 80 AI TOPS, the Ryzen AI 9 HX370 processor's fully upgraded architecture significantly boosts the SER9's overall performance, delivering a faster, smarter, and more secure Al PC experience!",
    href: 'https://example.com/beelink-ser5-pro',
    imgSrc: '/static/images/beelink/BeelinkSER9ProAMDRyzenAI9HX370.webp',
    cpu: {
      brand: CPU_BRAND.AMD,
      model: 'Ryzen AI 9 HX 370',
      cores: 12,
      threads: 24,
      boostClockGHz: 5.1,
      cache: {
        type: 'L2+L3 Cache',
        capacityMB: 36,
      },
    },
    variants: [
      {
        ram: {
          capacityGB: 32,
          type: 'LPDDR5X 7500MHz',
        },
        storage: {
          type: 'Dual M.2 2280 PCle4.0 X4',
          capacityGB: 1000,
        },
        oferts: [
          {
            url: 'https://www.bee-link.com/products/beelink-ser9-ai-9-hx-370',
            provider: MINI_PC_PROVIDER.BeelinkOfficialWebsite,
            priceUsd: 999,
          },
        ],
      },
      {
        ram: {
          capacityGB: 64,
          type: 'LPDDR5X 7500MHz',
        },
        storage: {
          type: 'Dual M.2 2280 PCle4.0 X4',
          capacityGB: 2000,
        },
        oferts: [
          {
            url: 'https://www.bee-link.com/products/beelink-ser9-ai-9-hx-370',
            provider: MINI_PC_PROVIDER.BeelinkOfficialWebsite,
            priceUsd: 1119,
          },
        ],
      },
    ],
    maxRAMCapacityGB: 96,
    maxStorageCapacityGB: 8000,
    graphics: {
      integrated: true,
      brand: CPU_BRAND.AMD,
      model: 'Radeon 890M',
      frequencyMHz: 2900,
      displayPorts: {
        dp: {
          amount: 1,
          type: 'v1.4 4K 120Hz',
        },
        hdmi: {
          amount: 1,
          type: '4K 120Hz',
        },
        usb4: {
          amount: 1,
          type: '40Gbps/TBT3/PD/DP1.4',
        },
      },
    },
    ports: {
      imageSrc: '/static/images/beelink/BeelinkSER9ProAMDRyzenAI9HX370Ports.webp',
      usb3: 2,
      usb2: 1,
      usb4: 1,
      ethernet: 1,
      usbC: 1,
      audioJack: true,
      sdCardReader: false,
    },
    builtinMicrophone: true,
    builtinSpeakers: true,
    connectivity: {
      wifi: 'Wi-Fi 6 Intel AX200 2.4Gbps',
      bluetooth: 'Bluetooth 5.2',
    },
    dimensions: {
      widthMm: 135,
      heightMm: 44.7,
      depthMm: 135,
    },
    weightKg: 0.78,
    powerConsumptionW: 65,
    releaseYear: undefined,
  },
  {
    id: MINI_PC_ID.BeelinkSER9ProAMDRyzenAI9365,
    title: 'Beelink SER9 Pro AMD Ryzen AI 9 365',
    brand: MINI_PC_BRAND.Beelink,
    model: 'SER9 Pro AMD Ryzen AI 9 365',
    description:
      "With CPU, GPU, and NPU on one chip, the brand-new architecture design of the AMD Ryzen Al 9 365 chipset significantly boosts the SER9 Pro's core count and overall performance, delivering a faster, smarter, and more secure Al PC experience.",
    href: 'https://example.com/beelink-ser5-pro',
    imgSrc: '/static/images/beelink/BeelinkSER9ProAMDRyzenAI9365.webp',
    cpu: {
      brand: CPU_BRAND.AMD,
      model: 'Ryzen AI 9 365',
      cores: 10,
      threads: 20,
      boostClockGHz: 5.0,
    },
    variants: [
      {
        ram: {
          capacityGB: 32,
          type: 'LPDDR5X 7500MHz',
        },
        storage: {
          type: 'Dual M.2 2280 PCle4.0 X4',
          capacityGB: 1000,
        },
        oferts: [
          {
            url: 'https://www.bee-link.com/products/beelink-ser9-pro-365',
            provider: MINI_PC_PROVIDER.BeelinkOfficialWebsite,
            priceUsd: 929,
          },
        ],
      },
    ],
    maxRAMCapacityGB: 96,
    maxStorageCapacityGB: 8000,
    graphics: {
      integrated: true,
      brand: CPU_BRAND.AMD,
      model: 'Radeon 880M',
      frequencyMHz: 2900,
      graphicCoresCU: 12,
      displayPorts: {
        dp: {
          amount: 1,
          type: 'v1.4 4K 240Hz',
        },
        hdmi: {
          amount: 1,
          type: '4K 240Hz',
        },
        usb4: {
          amount: 1,
          type: '40Gbps/TBT3/PD/DP1.4',
        },
      },
    },
    ports: {
      imageSrc: '/static/images/beelink/BeelinkSER9ProAMDRyzenAI9365Ports.webp',
      usb3: 2,
      usb2: 1,
      usb4: 1,
      usbC: 1,
      ethernet: 1,
      audioJack: true,
      sdCardReader: false,
    },
    builtinMicrophone: true,
    builtinSpeakers: true,
    connectivity: {
      wifi: 'Wi-Fi 6',
      bluetooth: 'Bluetooth 5.2',
    },
    dimensions: {
      widthMm: 135,
      heightMm: 44.7,
      depthMm: 135,
    },
    weightKg: 0.78,
    powerConsumptionW: 65,
    releaseYear: undefined,
  },
  {
    id: MINI_PC_ID.BeelinkGTi14UltraAIPCIntelCoreUltra9185H,
    title: 'Beelink GTi14 Ultra AI PC Intel Core Ultra 9 185H',
    brand: MINI_PC_BRAND.Beelink,
    model: 'GTi14 Ultra AI PC Intel Core Ultra 9 185H',
    description:
      'Powerful Intel® Core Ultra 9 185H CPU and Intel® Arc Graphics GPU allow you to step in to AI-powered Workspace with Confidence! CPU & GPU & NPU on one chip. Brand-new Al acceleration and hardware ray-tracing will completely transform your experiences in office multi-tasking, graphics-intensive gaming and local Al computing.',
    href: 'https://example.com/beelink-ser5-pro',
    imgSrc: '/static/images/beelink/BeelinkGTi14UltraAIPCIntelCoreUltra9185H.webp',
    cpu: {
      brand: CPU_BRAND.INTEL,
      model: 'Intel Core Ultra 9 185H',
      cores: 16,
      threads: 22,
      boostClockGHz: 5.1,
      cache: {
        capacityMB: 24,
        type: 'Intel Smart Cache',
      },
    },
    variants: [
      {
        ram: {
          capacityGB: 32,
          type: 'Dual SO-DIMM DDR5 5600MHz',
        },
        storage: {
          type: 'Dual M.2 2280 PCle4.0 X4',
          capacityGB: 1000,
        },
        oferts: [
          {
            url: 'https://www.bee-link.com/products/beelink-gti14-ultra9-185h',
            provider: MINI_PC_PROVIDER.BeelinkOfficialWebsite,
            priceUsd: 879,
          },
        ],
      },
      {
        ram: {
          capacityGB: 64,
          type: 'Dual SO-DIMM DDR5 5600MHz',
        },
        storage: {
          type: 'Dual M.2 2280 PCle4.0 X4',
          capacityGB: 2000,
        },
        oferts: [
          {
            url: 'https://www.bee-link.com/products/beelink-gti14-ultra9-185h',
            provider: MINI_PC_PROVIDER.BeelinkOfficialWebsite,
            priceUsd: 979,
          },
        ],
      },
      {
        ram: {
          capacityGB: 96,
          type: 'Dual SO-DIMM DDR5 5600MHz',
        },
        storage: {
          type: 'Dual M.2 2280 PCle4.0 X4',
          capacityGB: 2000,
        },
        oferts: [
          {
            url: 'https://www.bee-link.com/products/beelink-gti14-ultra9-185h',
            provider: MINI_PC_PROVIDER.BeelinkOfficialWebsite,
            priceUsd: 1069,
          },
        ],
      },
    ],
    maxRAMCapacityGB: 96,
    maxStorageCapacityGB: 8000,
    graphics: {
      integrated: true,
      brand: CPU_BRAND.INTEL,
      model: 'Intel Arc Graphics',
      frequencyMHz: 2350,
      maxTOPS: 34.5,
      displayPorts: {
        dp: {
          amount: 1,
          type: 'v1.4 4K 144Hz',
        },
        thunderbolt: {
          amount: 1,
          type: 'v4 40Gbps/TBT4/PD/DP1.4',
        },
        hdmi: {
          amount: 1,
          type: '4K 60Hz',
        },
      },
    },
    ports: {
      imageSrc: '/static/images/beelink/BeelinkGTi14UltraAIPCIntelCoreUltra9185HPorts.webp',
      usb3: 5,
      usbC: 2,
      ethernet: 2,
      audioJack: true,
      sdCardReader: true,
    },
    builtinMicrophone: true,
    builtinSpeakers: true,
    connectivity: {
      wifi: 'Wi-Fi 6',
      bluetooth: 'Bluetooth 5.2',
    },
    dimensions: {
      widthMm: 158,
      heightMm: 55.8,
      depthMm: 158,
    },
    weightKg: 1.29,
    powerConsumptionW: 65,
    releaseYear: undefined,
  },
  {
    id: MINI_PC_ID.BeelinkGTi13UltraIntelCorei913900HK,
    title: 'Beelink GTi13 Ultra Intel Core i9-13900HK',
    brand: MINI_PC_BRAND.Beelink,
    model: 'GTi13 Ultra Intel Core i9-13900HK',
    description:
      'Seamless multitasking with a hybrid CPU architecture of performance and efficiency cores, intelligent scheduling between apps for smooth transitions.',
    href: 'https://example.com/beelink-ser5-pro',
    imgSrc: '/static/images/beelink/BeelinkGTi13UltraIntelCorei913900HK.webp',
    cpu: {
      brand: CPU_BRAND.INTEL,
      model: 'Intel Core i9-13900HK',
      cores: 14,
      threads: 20,
      boostClockGHz: 5.4,
    },
    variants: [
      {
        ram: {
          capacityGB: 32,
          type: 'Dual SO-DIMM DDR5 5200MHz',
        },
        storage: {
          type: 'Dual M.2 2280 PCle4.0 X4',
          capacityGB: 1000,
        },
        oferts: [
          {
            url: 'https://www.bee-link.com/products/beelink-gti13-ultra-13900hk',
            provider: MINI_PC_PROVIDER.BeelinkOfficialWebsite,
            priceUsd: 599,
          },
        ],
      },
      {
        ram: {
          capacityGB: 64,
          type: 'Dual SO-DIMM DDR5 5200MHz',
        },
        storage: {
          type: 'Dual M.2 2280 PCle4.0 X4',
          capacityGB: 2000,
        },
        oferts: [
          {
            url: 'https://www.bee-link.com/products/beelink-gti13-ultra-13900hk',
            provider: MINI_PC_PROVIDER.BeelinkOfficialWebsite,
            priceUsd: 759,
          },
        ],
      },
      {
        ram: {
          capacityGB: 96,
          type: 'Dual SO-DIMM DDR5 5200MHz',
        },
        storage: {
          type: 'Dual M.2 2280 PCle4.0 X4',
          capacityGB: 2000,
        },
        oferts: [
          {
            url: 'https://www.bee-link.com/products/beelink-gti13-ultra-13900hk',
            provider: MINI_PC_PROVIDER.BeelinkOfficialWebsite,
            priceUsd: 839,
          },
        ],
      },
    ],
    maxRAMCapacityGB: 96,
    maxStorageCapacityGB: 8000,
    graphics: {
      integrated: true,
      brand: CPU_BRAND.INTEL,
      model: 'Intel Iris Xe Graphics eligible',
      frequencyMHz: 1500,
      displayPorts: {
        dp: {
          amount: 1,
          type: 'v1.4 4K 144Hz',
        },
        thunderbolt: {
          amount: 1,
          type: 'v4 40Gbps/TBT4/PD/DP1.4',
        },
        hdmi: {
          amount: 1,
          type: '4K 60Hz',
        },
      },
    },
    ports: {
      imageSrc: '/static/images/beelink/BeelinkGTi13UltraIntelCorei913900HKPorts.webp',
      usb3: 5,
      usbC: 2,
      ethernet: 2,
      audioJack: true,
      sdCardReader: true,
    },
    builtinMicrophone: true,
    builtinSpeakers: true,
    supportExternalDiscreteGraphicsCard: true,
    connectivity: {
      wifi: 'Wi-Fi 6',
      bluetooth: 'Bluetooth 5.2',
    },
    dimensions: {
      widthMm: 158,
      heightMm: 55.8,
      depthMm: 158,
    },
    weightKg: 1.29,
    powerConsumptionW: 65,
    releaseYear: undefined,
  },
  {
    id: MINI_PC_ID.BeelinkGTi14UltraAIPCIntelCoreUltra7155H,
    title: 'Beelink GTi14 Ultra AI PC Intel Core Ultra 7 155H',
    brand: MINI_PC_BRAND.Beelink,
    model: 'GTi14 Ultra AI PC Intel Core Ultra 7 155H',
    description:
      'Seamless multitasking with a hybrid CPU architecture of performance and efficiency cores, intelligent scheduling between apps for smooth transitions.',
    href: 'https://example.com/beelink-ser5-pro',
    imgSrc: '/static/images/beelink/BeelinkGTi14UltraAIPCIntelCoreUltra7155H.webp',
    cpu: {
      brand: CPU_BRAND.INTEL,
      model: 'Intel Core Ultra 7 155H',
      cores: 16,
      threads: 22,
      boostClockGHz: 4.8,
    },
    variants: [
      {
        ram: {
          capacityGB: 32,
          type: 'Dual SO-DIMM DDR5 5600MHz',
        },
        storage: {
          type: 'Dual M.2 2280 PCle4.0 X4',
          capacityGB: 1000,
        },
        oferts: [
          {
            url: 'https://www.bee-link.com/products/beelink-gti14-ultra7-155h',
            provider: MINI_PC_PROVIDER.BeelinkOfficialWebsite,
            priceUsd: 819,
          },
        ],
      },
    ],
    maxRAMCapacityGB: 96,
    maxStorageCapacityGB: 8000,
    graphics: {
      integrated: true,
      brand: CPU_BRAND.INTEL,
      model: 'Intel Arc Graphics',
      frequencyMHz: 2250,
      maxTOPS: 32,
      displayPorts: {
        dp: {
          amount: 1,
          type: 'v1.4 4K 144Hz',
        },
        thunderbolt: {
          amount: 1,
          type: 'v4 40Gbps/TBT4/PD/DP1.4',
        },
        hdmi: {
          amount: 1,
          type: '4K 60Hz',
        },
      },
    },
    ports: {
      imageSrc: '/static/images/beelink/BeelinkGTi14UltraAIPCIntelCoreUltra7155HPorts.webp',
      usb3: 5,
      usbC: 2,
      ethernet: 2,
      audioJack: true,
      sdCardReader: true,
    },
    builtinMicrophone: true,
    builtinSpeakers: true,
    connectivity: {
      wifi: 'Wi-Fi 6',
      bluetooth: 'Bluetooth 5.2',
    },
    dimensions: {
      widthMm: 158,
      heightMm: 55.8,
      depthMm: 158,
    },
    weightKg: 1.29,
    powerConsumptionW: 65,
    releaseYear: undefined,
  },
  {
    id: MINI_PC_ID.BeelinkSEi14IntelCoreUltra9185H,
    title: 'Beelink SEi14 Intel Core Ultra 9 185H',
    brand: MINI_PC_BRAND.Beelink,
    model: 'SEi14 Intel Core Ultra 9 185H',
    description:
      'Powerful Intel® Core Ultra 9 185H CPU and Intel® Arc Graphics GPU allow you to step into AI-powered Workspace with Confidence!',
    href: 'https://example.com/beelink-ser5-pro',
    imgSrc: '/static/images/beelink/BeelinkSEi14IntelCoreUltra9185H.webp',
    cpu: {
      brand: CPU_BRAND.INTEL,
      model: 'Intel Core Ultra 9 185H',
      cores: 16,
      threads: 22,
      boostClockGHz: 5.1,
      cache: {
        capacityMB: 24,
        type: 'Intel Smart Cache',
      },
    },
    variants: [
      {
        ram: {
          capacityGB: 32,
          type: 'Dual SO-DIMM DDR5 5600MHz',
        },
        storage: {
          type: 'Dual M.2 2280 PCle4.0 X4',
          capacityGB: 1000,
        },
        oferts: [
          {
            url: 'https://www.bee-link.com/products/beelink-gti14-ultra7-155h',
            provider: MINI_PC_PROVIDER.BeelinkOfficialWebsite,
            priceUsd: 819,
            warrantyYears: 1,
          },
        ],
      },
      {
        ram: {
          capacityGB: 64,
          type: 'Dual SO-DIMM DDR5 5600MHz',
        },
        storage: {
          type: 'Dual M.2 2280 PCle4.0 X4',
          capacityGB: 2000,
        },
        oferts: [
          {
            url: 'https://www.bee-link.com/products/beelink-gti14-ultra7-155h',
            provider: MINI_PC_PROVIDER.BeelinkOfficialWebsite,
            priceUsd: 819,
            warrantyYears: 1,
          },
        ],
      },
      {
        ram: {
          capacityGB: 96,
          type: 'Dual SO-DIMM DDR5 5600MHz',
        },
        storage: {
          type: 'Dual M.2 2280 PCle4.0 X4',
          capacityGB: 2000,
        },
        oferts: [
          {
            url: 'https://www.bee-link.com/products/beelink-gti14-ultra7-155h',
            provider: MINI_PC_PROVIDER.BeelinkOfficialWebsite,
            priceUsd: 819,
            warrantyYears: 1,
          },
        ],
      },
    ],
    maxRAMCapacityGB: 96,
    maxStorageCapacityGB: 8000,
    graphics: {
      integrated: true,
      brand: CPU_BRAND.INTEL,
      model: 'Intel Arc Graphics',
      frequencyMHz: 2350,
      maxTOPS: 34.5,
      displayPorts: {
        dp: {
          amount: 1,
          type: 'v1.4 4K 144Hz',
        },
        thunderbolt: {
          amount: 1,
          type: 'v4 40Gbps/TBT4/PD/DP1.4',
        },
        hdmi: {
          amount: 1,
          type: '4K 60Hz',
        },
      },
    },
    ports: {
      imageSrc: '/static/images/beelink/BeelinkSEi14IntelCoreUltra9185HPorts.webp',
      usb3: 2,
      usb2: 1,
      usbC: 2,
      ethernet: 1,
      audioJack: true,
      sdCardReader: false,
    },
    builtinMicrophone: false,
    builtinSpeakers: false,
    connectivity: {
      wifi: 'Wi-Fi 6 Intel AX200',
      bluetooth: 'Bluetooth 5.2',
    },
    dimensions: {
      volumeL: 0.814,
    },
    weightKg: 0.75,
  },
  {
    id: MINI_PC_ID.BeelinkSER8AMDRyzen78845HS,
    title: 'Beelink SER8 AMD Ryzen 7 8845HS',
    brand: MINI_PC_BRAND.Beelink,
    model: 'SER8 AMD Ryzen 7 8845HS',
    description:
      'AMD Ryzen 7 8845HS has CPU & GPU & NPU on one chip. The new Ryzen Al Engine has 16 TOPS of AI performance and supports multiple Al architectures as well as large-scale models, empowering users to handle different Al applications and heavy Al workloads effortlessly.',
    href: 'https://example.com/beelink-ser5-pro',
    imgSrc: '/static/images/beelink/BeelinkSER8AMDRyzen78845HS.webp',
    cpu: {
      brand: CPU_BRAND.AMD,
      model: 'AMD Ryzen 7 8845HS',
      cores: 16,
      threads: 22,
      boostClockGHz: 5.1,
      cache: {
        capacityMB: 24,
        type: 'Intel Smart Cache',
      },
    },
    variants: [
      {
        ram: {
          capacityGB: 32,
          type: 'Dual SO-DIMM DDR5 5600MHz',
        },
        storage: {
          type: 'Dual M.2 2280 PCle4.0 X4',
          capacityGB: 1000,
        },
        oferts: [
          {
            url: 'https://www.bee-link.com/products/beelink-gti14-ultra7-155h',
            provider: MINI_PC_PROVIDER.BeelinkOfficialWebsite,
            priceUsd: 819,
            warrantyYears: 1,
          },
        ],
      },
      {
        ram: {
          capacityGB: 64,
          type: 'Dual SO-DIMM DDR5 5600MHz',
        },
        storage: {
          type: 'Dual M.2 2280 PCle4.0 X4',
          capacityGB: 2000,
        },
        oferts: [
          {
            url: 'https://www.bee-link.com/products/beelink-gti14-ultra7-155h',
            provider: MINI_PC_PROVIDER.BeelinkOfficialWebsite,
            priceUsd: 819,
            warrantyYears: 1,
          },
        ],
      },
    ],
    maxRAMCapacityGB: 96,
    maxStorageCapacityGB: 8000,
    graphics: {
      integrated: true,
      brand: CPU_BRAND.INTEL,
      model: 'Intel Arc Graphics',
      frequencyMHz: 2350,
      maxTOPS: 34.5,
      displayPorts: {
        dp: {
          amount: 1,
          type: 'v1.4 4K 144Hz',
        },
        thunderbolt: {
          amount: 1,
          type: 'v4 40Gbps/TBT4/PD/DP1.4',
        },
        hdmi: {
          amount: 1,
          type: '4K 60Hz',
        },
      },
    },
    ports: {
      imageSrc: '/static/images/beelink/BeelinkSEi14IntelCoreUltra9185HPorts.webp',
      usb3: 2,
      usb2: 1,
      usbC: 2,
      ethernet: 1,
      audioJack: true,
      sdCardReader: false,
    },
    builtinMicrophone: false,
    builtinSpeakers: false,
    connectivity: {
      wifi: 'Wi-Fi 6 Intel AX200',
      bluetooth: 'Bluetooth 5.2',
    },
    dimensions: {
      volumeL: 0.814,
    },
    weightKg: 0.75,
  },
]

export default miniPcsData
