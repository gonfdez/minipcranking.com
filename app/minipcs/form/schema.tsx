import { MINI_PC_BRAND, MINI_PC_PROVIDER } from '@/data/minipcs/brands'
import { RJSFSchema } from '@rjsf/utils'

export const miniPcSchema: RJSFSchema = {
  title: 'Mini PC Form',
  type: 'object',
  properties: {
    id: { type: 'string', title: 'ID', readOnly: true },
    title: { type: 'string', title: 'Título', readOnly: true },
    brand: {
      type: 'string',
      title: 'Marca',
      enum: Object.values(MINI_PC_BRAND),
    },
    model: { type: 'string', title: 'Modelo' },
    description: { type: 'string', title: 'Descripción' },
    imgSrc: { type: 'string', title: 'URL de la imagen principal del producto', format: 'uri' },

    cpu: {
      type: 'object',
      title: 'Procesador',
      properties: {
        brand: {
          type: 'string',
          title: 'Marca',
          enum: Object.values(MINI_PC_BRAND),
        },
        model: { type: 'string', title: 'Modelo' },
        cores: { type: 'integer', title: 'Núcleos' },
        threads: { type: 'integer', title: 'Hilos' },
        baseClockGHz: { type: 'number', title: 'Frecuencia Base (GHz)' },
        boostClockGHz: { type: 'number', title: 'Frecuencia Boost (GHz)' },
        cache: {
          type: 'object',
          title: 'Caché del procesador (Si tiene)',
          properties: {
            type: { type: 'string', title: 'Tipo' },
            capacityMB: { type: 'integer', title: 'Capacidad (MB)' },
          },
        },
      },
      required: ['brand', 'model', 'cores', 'threads', 'baseClockGHz'],
    },

    graphics: {
      type: 'object',
      title: 'Gráficos',
      properties: {
        integrated: { type: 'boolean', title: 'Integrado', default: true },
        supportExternalGraphicsCard: {
          type: 'boolean',
          title: 'Soporta tarjeta gráfica externa',
        },
        brand: {
          type: 'string',
          title: 'Marca',
          enum: Object.values(MINI_PC_BRAND),
        },
        model: { type: 'string', title: 'Modelo' },
        frequencyMHz: { type: 'number', title: 'Frecuencia (MHz)' },
        maxTOPS: { type: 'number', title: 'TOPS máximo' },
        graphicCoresCU: { type: 'integer', title: 'Núcleos gráficos (CU)' },
      },
      required: ['brand', 'model'],
    },

    connectivity: {
      type: 'object',
      title: 'Conectividad',
      properties: {
        wifi: { type: 'string', title: 'WiFi' },
        bluetooth: { type: 'string', title: 'Bluetooth' },
      },
      required: ['wifi', 'bluetooth'],
    },

    dimensions: {
      type: 'object',
      title: 'Dimensiones',
      properties: {
        widthMm: { type: 'number', title: 'Ancho (mm)' },
        heightMm: { type: 'number', title: 'Alto (mm)' },
        depthMm: { type: 'number', title: 'Profundidad (mm)' },
        volumeL: { type: 'number', title: 'Volumen (L)' },
      },
      // required: ['widthMm', 'heightMm', 'depthMm'],
    },

    weightKg: { type: 'number', title: 'Peso (Kg)' },
    powerConsumptionW: { type: 'number', title: 'Consumo de Energía (W)' },
    releaseYear: { type: 'integer', title: 'Año de lanzamiento' },

    ports: {
      type: 'object',
      title: 'Puertos',
      properties: {
        imageSrc: { type: 'string', title: 'URL de la imagen de los puertos', format: 'uri' },
        usb4: { type: 'integer', title: 'USB4 (Unidades)' },
        usb3: { type: 'integer', title: 'USB3 (Unidades)' },
        usb2: { type: 'integer', title: 'USB2 (Unidades)' },
        usbC: { type: 'integer', title: 'USB-C (Unidades)' },
        ethernet: { type: 'integer', title: 'Ethernet (Unidades)' },
        audioJack: { type: 'boolean', title: 'Jack de audio' },
        sdCardReader: { type: 'boolean', title: 'Lector de tarjetas SD' },
      },
      required: ['usb4', 'usb3', 'usbC', 'ethernet'],
    },

    variants: {
      type: 'array',
      title: 'Variante',
      items: {
        type: 'object',
        properties: {
          ram: {
            type: 'object',
            title: 'RAM',
            properties: {
              capacityGB: { type: 'integer', title: 'Capacidad (GB)' },
              type: { type: 'string', title: 'Tipo' },
            },
            required: ['capacityGB', 'type'],
          },
          storage: {
            type: 'object',
            title: 'Almacenamiento',
            properties: {
              capacityGB: { type: 'integer', title: 'Capacidad (GB)' },
              type: { type: 'string', title: 'Tipo' },
            },
            required: ['capacityGB', 'type'],
          },
          offers: {
            type: 'array',
            title: 'Oferta',
            items: {
              type: 'object',
              properties: {
                provider: {
                  type: 'string',
                  title: 'Proveedor',
                  enum: Object.values(MINI_PC_PROVIDER),
                },
                priceUsd: { type: 'number', title: 'Precio (USD)' },
                warrantyYears: { type: 'integer', title: 'Años de garantía' },
                url: { type: 'string', title: 'URL de la oferta', format: 'uri' },
              },
              required: ['provider', 'priceUsd', 'url'],
            },
          },
        },
        required: ['ram', 'storage'],
      },
    },
  },

  required: [
    'id',
    'title',
    'brand',
    'model',
    'cpu',
    'graphics',
    'connectivity',
    'ports',
    'weightKg',
    'dimensions',
  ],
}
