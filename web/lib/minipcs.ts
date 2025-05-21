import fs from 'fs'
import path from 'path'
import MiniPcExtractedData from '@/data/minipcs/miniPcExtractedData'
import MiniPcWithBrand from '@/data/minipcs/miniPcWithBrand'

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

  const allMiniPcs = await Promise.all(
    jsonFiles.map(async (filePath) => {
      try {
        const fileContents = fs.readFileSync(filePath, 'utf8')
        const miniPcData = JSON.parse(fileContents) as MiniPcExtractedData

        // Extrae la marca del path (nombre del directorio padre)
        const brandDir = path.dirname(filePath)
        const brand = path.basename(brandDir)

        // Crea una nueva instancia con la marca añadida
        const miniPcWithBrand: MiniPcWithBrand = {
          ...miniPcData,
          brand: brand,
        }

        return miniPcWithBrand
      } catch (error) {
        console.error(`Error reading file ${filePath}:`, error)
        return null
      }
    })
  )

  // Filtra los posibles nulos por errores
  return allMiniPcs.filter((pc): pc is MiniPcWithBrand => pc !== null)
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
