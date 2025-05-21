import 'css/prism.css'
import 'katex/dist/katex.css'

import { allBlogs } from 'contentlayer/generated'
import { notFound } from 'next/navigation'
import Image from 'components/Image'
import siteMetadata from 'data/siteMetadata'
import { Metadata } from 'next'
import MiniPCModelVariants from 'components/MiniPcModelFeatures'
import fs from 'fs'
import path from 'path'
import type MiniPcExtractedData from 'data/minipcs/miniPcExtractedData'

// Function to get all mini PC data files
async function getAllMiniPcs(): Promise<MiniPcExtractedData[]> {
  const miniPcsDirectory = path.join(process.cwd(), 'data/minipcs/output')
  const brands = fs.readdirSync(miniPcsDirectory)

  const allMiniPcs: MiniPcExtractedData[] = []

  for (const brand of brands) {
    const brandPath = path.join(miniPcsDirectory, brand)
    if (fs.statSync(brandPath).isDirectory()) {
      const files = fs.readdirSync(brandPath).filter((file) => file.endsWith('.json'))

      for (const file of files) {
        const filePath = path.join(brandPath, file)
        const fileContents = fs.readFileSync(filePath, 'utf8')
        const miniPcData = JSON.parse(fileContents) as MiniPcExtractedData
        allMiniPcs.push(miniPcData)
      }
    }
  }

  return allMiniPcs
}

// Function to get a specific mini PC by slug
async function getMiniPcBySlug(slug: string): Promise<MiniPcExtractedData | undefined> {
  const allMiniPcs = await getAllMiniPcs()
  return allMiniPcs.find((pc) => {
    // Create a slug from the brand and model
    const pcSlug = pc.model.replaceAll(' ', '').toLowerCase()
    return pcSlug === slug.toLowerCase()
  })
}

export async function generateMetadata(props: {
  params: { slug: string[] }
}): Promise<Metadata | undefined> {
  const slug = decodeURI(await props.params.slug.join('/'))
  const miniPc = await getMiniPcBySlug(slug)

  if (!miniPc) {
    return
  }

  const imageList =
    miniPc.mainImgUrl && miniPc.mainImgUrl.length > 0
      ? [miniPc.mainImgUrl[0]]
      : [siteMetadata.socialBanner]

  const ogImages = imageList.map((img) => ({
    url: img.includes('http') ? img : siteMetadata.siteUrl + img,
  }))

  return {
    title: `${miniPc.model}`,
    description: miniPc.description['en'],
    openGraph: {
      title: miniPc.model,
      description: miniPc.description['en'],
      siteName: siteMetadata.title,
      locale: 'en_US',
      type: 'article',
      url: `${siteMetadata.siteUrl}/minipcs/${miniPc.model.replaceAll(' ', '')}`,
      images: ogImages,
    },
    twitter: {
      card: 'summary_large_image',
      title: miniPc.model,
      description: miniPc.description['es'],
      images: imageList,
    },
  }
}

export const generateStaticParams = async () => {
  const miniPcs = await getAllMiniPcs()
  const miniPcSlugs = miniPcs.map((p) => ({
    slug: [p.model.replaceAll(' ', '')],
  }))

  // Also include blog slugs for compatibility
  const blogSlugs = allBlogs.map((p) => ({
    slug: p.slug.split('/').map((name) => decodeURI(name)),
  }))

  return [...miniPcSlugs, ...blogSlugs]
}

export default async function Page(props: { params: { slug: string[] } }) {
  const slug = decodeURI(props.params.slug.join('/'))
  const miniPc = await getMiniPcBySlug(slug)

  if (!miniPc) {
    return notFound()
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-4">
      <div className="flex w-full flex-col gap-6 md:flex-row md:items-start">
        {miniPc.mainImgUrl && miniPc.mainImgUrl.length > 0 && (
          <div className="flex h-auto w-full justify-center md:w-1/3">
            <Image
              alt={miniPc.model}
              src={miniPc.mainImgUrl[0]}
              className="max-h-[300px] w-full rounded-md object-cover"
              width={300}
              height={300}
            />
          </div>
        )}

        <div className="flex w-full flex-col gap-4 md:p-6">
          <h1 className="mb-2 text-xl font-bold tracking-tight md:text-2xl">{miniPc.model}</h1>

          {/* Model variants component */}
          <MiniPCModelVariants data={miniPc} className="w-full" />
        </div>
      </div>

      <div className="grid w-full grid-cols-1 gap-6 rounded-lg bg-gray-100 p-3 p-6 shadow-sm md:grid-cols-3 dark:bg-gray-800">
        <div>
          <h2 className="mb-2 border-b border-gray-300 pb-2 text-lg font-semibold dark:border-gray-600">
            CPU
          </h2>
          <p>
            {miniPc.cpu.brand} {miniPc.cpu.model}
          </p>
          <p>
            {miniPc.cpu.cores} cores / {miniPc.cpu.threads} threads
          </p>
          {miniPc.cpu.baseClockGHz && <p>Base: {miniPc.cpu.baseClockGHz} GHz</p>}
          {miniPc.cpu.boostClockGHz && <p>Boost: {miniPc.cpu.boostClockGHz} GHz</p>}
          {miniPc.cpu.cache && (
            <p>
              Cache: {miniPc.cpu.cache.capacityMB} MB {miniPc.cpu.cache.type}
            </p>
          )}
        </div>

        <div>
          <h2 className="mb-2 border-b border-gray-300 pb-2 text-lg font-semibold dark:border-gray-600">
            Graphics
          </h2>
          <p>{miniPc.graphics.integrated ? 'Integrated' : 'Discrete'} GPU</p>
          {miniPc.graphics.brand && (
            <p>
              {miniPc.graphics.brand} {miniPc.graphics.model}
            </p>
          )}
          {miniPc.graphics.frequencyMHz && <p>Clock: {miniPc.graphics.frequencyMHz} MHz</p>}
          {miniPc.graphics.maxTOPS && <p>TOPS: {miniPc.graphics.maxTOPS}</p>}
          {miniPc.graphics.graphicCoresCU && (
            <p>Graphics Cores: {miniPc.graphics.graphicCoresCU}</p>
          )}

          {/* Display Port information */}
          {miniPc.graphics.displayPorts && (
            <div className="mt-2">
              <p className="font-semibold">Display Ports:</p>
              <div className="pl-2">
                {miniPc.graphics.displayPorts.thunderbolt && (
                  <p>
                    Thunderbolt {miniPc.graphics.displayPorts.thunderbolt.type} x{' '}
                    {miniPc.graphics.displayPorts.thunderbolt.amount}
                  </p>
                )}
                {miniPc.graphics.displayPorts.dp && (
                  <p>
                    DisplayPort {miniPc.graphics.displayPorts.dp.type} x{' '}
                    {miniPc.graphics.displayPorts.dp.amount}
                  </p>
                )}
                {miniPc.graphics.displayPorts.hdmi && (
                  <p>
                    HDMI {miniPc.graphics.displayPorts.hdmi.type} x{' '}
                    {miniPc.graphics.displayPorts.hdmi.amount}
                  </p>
                )}
                {miniPc.graphics.displayPorts.usb4 && (
                  <p>
                    USB4 {miniPc.graphics.displayPorts.usb4.type} x{' '}
                    {miniPc.graphics.displayPorts.usb4.amount}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <div>
          <h2 className="mb-2 border-b border-gray-300 pb-2 text-lg font-semibold dark:border-gray-600">
            Memory & Storage
          </h2>
          {miniPc.variants.slice(0, 1).map((variant, index) => (
            <div key={index} className="mb-2">
              <div>
                <span className="text-gray-500">RAM: </span>
                <span className="font-mono">
                  {variant.ram.capacityGB} GB ({variant.ram.type})
                </span>
              </div>
              <div>
                <span className="text-gray-500">Storage: </span>
                <span className="font-mono">
                  {variant.storage.capacityGB} GB ({variant.storage.type})
                </span>
              </div>
            </div>
          ))}
          {miniPc.maxRAMCapacityGB && <p>Max RAM Capacity: {miniPc.maxRAMCapacityGB} GB</p>}
          {miniPc.maxStorageCapacityGB && (
            <p>Max Storage Capacity: {miniPc.maxStorageCapacityGB} GB</p>
          )}
        </div>

        <div>
          <h2 className="mb-2 border-b border-gray-300 pb-2 text-lg font-semibold dark:border-gray-600">
            Connectivity
          </h2>
          <p>WiFi: {miniPc.connectivity.wifi}</p>
          <p>Bluetooth: {miniPc.connectivity.bluetooth}</p>
          {miniPc.builtinMicrophone && <p>Built-in Microphone: Yes</p>}
          {miniPc.builtinSpeakers && <p>Built-in Speakers: Yes</p>}
        </div>

        <div>
          <h2 className="mb-2 flex items-center justify-between border-b border-gray-300 pb-2 text-lg font-semibold dark:border-gray-600">
            Ports
            {miniPc.portsImgUrl && miniPc.portsImgUrl.length > 0 && (
              <a className="text-primary-600 text-sm" href={miniPc.portsImgUrl[0]} target="_blank">
                See image of all ports
              </a>
            )}
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(miniPc.ports).map(([key, value]) => {
              if (value === undefined) return null
              return (
                <p key={key}>
                  {typeof value === 'boolean'
                    ? `${key.replace(/([A-Z])/g, ' $1').trim()}`
                    : `${key.replace(/([A-Z])/g, ' $1').trim()} x ${value}`}
                </p>
              )
            })}
          </div>
        </div>

        <div>
          <h2 className="mb-2 border-b border-gray-300 pb-2 text-lg font-semibold dark:border-gray-600">
            Dimensions & Weight
          </h2>
          {miniPc.dimensions.widthMm && miniPc.dimensions.heightMm && miniPc.dimensions.depthMm && (
            <p>
              Size: {miniPc.dimensions.widthMm} x {miniPc.dimensions.heightMm} x{' '}
              {miniPc.dimensions.depthMm} mm
            </p>
          )}
          {miniPc.dimensions.volumeL && <p>Volume: {miniPc.dimensions.volumeL} L</p>}
          <p>Weight: {miniPc.weightKg} kg</p>
          {miniPc.powerConsumptionW && <p>Power Consumption: {miniPc.powerConsumptionW}W</p>}
          {miniPc.releaseYear && <p>Release Year: {miniPc.releaseYear}</p>}
          {miniPc.supportExternalDiscreteGraphicsCard && <p>Supports External GPU: Yes</p>}
        </div>
      </div>

      {/* Source information */}
      <div className="mt-4 text-sm text-gray-500">
        <p>
          Source:{' '}
          <a href={miniPc.fromURL} target="_blank" rel="noopener noreferrer" className="underline">
            {miniPc.fromURL}
          </a>
        </p>
      </div>
    </div>
  )
}
