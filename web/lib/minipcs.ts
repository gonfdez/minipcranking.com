import fs from 'fs'
import path from 'path'
import MiniPcExtractedData from '@/data/minipcs/miniPcExtractedData'
import MiniPcWithBrand from '@/data/minipcs/miniPcWithBrand'

export const CARDS_PER_PAGE = 6

// Función auxiliar para leer archivos de manera recursiva
function getFilesRecursively(directory: string): string[] {
  const filesInDirectory = fs.readdirSync(directory)
  const files: string[] = []

  for (const file of filesInDirectory) {
    const absolute = path.join(directory, file)
    if (fs.statSync(absolute).isDirectory()) {
      files.push(...getFilesRecursively(absolute))
    } else if (file.endsWith('.json')) {
      files.push(absolute)
    }
  }

  return files
}

// Función para extraer el provider de una URL
function extractProviderFromUrl(url: string): string {
  try {
    const urlObj = new URL(url)
    const hostname = urlObj.hostname.toLowerCase()

    // Mapeo de dominios a nombres de providers
    const providerMap: Record<string, string> = {
      'amazon.com': 'Amazon',
      'amazon.es': 'Amazon',
      'amazon.de': 'Amazon',
      'amazon.fr': 'Amazon',
      'amazon.co.uk': 'Amazon',
      'ebay.com': 'eBay',
      'ebay.es': 'eBay',
      'aliexpress.com': 'AliExpress',
      'aliexpress.us': 'AliExpress',
      'geekbuying.com': 'Geekbuying',
      'banggood.com': 'Banggood',
      'gearbest.com': 'GearBest',
      'newegg.com': 'Newegg',
      'pccomponentes.com': 'PcComponentes',
      'mediamarkt.es': 'MediaMarkt',
      'elcorteingles.es': 'El Corte Inglés',
      'carrefour.es': 'Carrefour',
      'fnac.es': 'Fnac',
    }

    // Busca coincidencias exactas primero
    if (providerMap[hostname]) {
      return providerMap[hostname]
    }

    // Busca coincidencias parciales (para subdominios)
    for (const [domain, provider] of Object.entries(providerMap)) {
      if (hostname.includes(domain)) {
        return provider
      }
    }

    // Si no encuentra coincidencia, devuelve el hostname limpio
    return (
      hostname.replace('www.', '').split('.')[0].charAt(0).toUpperCase() +
      hostname.replace('www.', '').split('.')[0].slice(1)
    )
  } catch (error) {
    console.warn(`Error parsing URL: ${url}`, error)
    return 'Unknown'
  }
}

// Función para crear una clave única para identificar Mini PCs duplicados
function createMiniPcKey(miniPc: MiniPcExtractedData, brand: string): string {
  // Normaliza el modelo (quita espacios, convierte a minúsculas)
  const normalizedModel = miniPc.model.toLowerCase().replace(/\s+/g, '').trim()
  const normalizedBrand = brand.toLowerCase().replace(/\s+/g, '').trim()

  // Combina brand + model como clave única
  return `${normalizedBrand}-${normalizedModel}`
}

// Obtiene todos los Mini PCs de los archivos JSON
export async function getAllMiniPcs(): Promise<MiniPcWithBrand[]> {
  const outputDirectory = path.join(process.cwd(), 'data', 'minipcs', 'output')

  // Verifica si el directorio existe
  if (!fs.existsSync(outputDirectory)) {
    console.error(`Directory not found: ${outputDirectory}`)
    return []
  }

  // Obtiene todos los archivos JSON de manera recursiva
  const jsonFiles = getFilesRecursively(outputDirectory)

  // Map para controlar duplicados
  const uniqueMiniPcs = new Map<string, MiniPcWithBrand>()

  await Promise.all(
    jsonFiles.map(async (filePath) => {
      try {
        const fileContents = fs.readFileSync(filePath, 'utf8')
        const miniPcData = JSON.parse(fileContents) as MiniPcExtractedData

        // Extrae la marca del path (nombre del directorio padre)
        const brandDir = path.dirname(filePath)
        const brand = path.basename(brandDir)

        // Procesa las variantes para añadir el provider
        const processedVariants = miniPcData.variants.map((variant) => ({
          ...variant,
          oferts: variant.oferts.map((offer) => ({
            ...offer,
            provider: extractProviderFromUrl(offer.url),
          })),
        }))

        // Crea una nueva instancia con la marca añadida y variants procesadas
        const miniPcWithBrand: MiniPcWithBrand = {
          ...miniPcData,
          brand: brand,
          variants: processedVariants,
        }

        // Crea clave única para este Mini PC
        const uniqueKey = createMiniPcKey(miniPcData, brand)

        // Solo añade si no existe ya, o si existe pero tiene menos ofertas
        const existing = uniqueMiniPcs.get(uniqueKey)
        if (!existing) {
          uniqueMiniPcs.set(uniqueKey, miniPcWithBrand)
        } else {
          // Si ya existe, mantén el que tenga más ofertas
          const existingOffersCount = existing.variants.reduce(
            (sum, variant) => sum + variant.oferts.length,
            0
          )
          const newOffersCount = miniPcWithBrand.variants.reduce(
            (sum, variant) => sum + variant.oferts.length,
            0
          )

          if (newOffersCount > existingOffersCount) {
            uniqueMiniPcs.set(uniqueKey, miniPcWithBrand)
            console.log(`Replaced duplicate ${uniqueKey} with version having more offers`)
          } else {
            console.log(`Skipped duplicate ${uniqueKey}`)
          }
        }
      } catch (error) {
        console.error(`Error reading file ${filePath}:`, error)
      }
    })
  )

  console.log(`Loaded ${uniqueMiniPcs.size} unique Mini PCs from ${jsonFiles.length} files`)

  return Array.from(uniqueMiniPcs.values())
}

// Obtiene un Mini PC por su slug
export async function getMiniPcBySlug(slug: string): Promise<MiniPcWithBrand | undefined> {
  const allMiniPcs = await getAllMiniPcs()
  return allMiniPcs.find((pc) => {
    // Create a slug from the model
    const pcSlug = pc.model?.replaceAll(' ', '')?.toLowerCase() || ''
    return pcSlug === slug.toLowerCase()
  })
}
