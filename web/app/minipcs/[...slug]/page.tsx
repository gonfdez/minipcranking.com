import 'css/prism.css'
import 'katex/dist/katex.css'

import { allBlogs } from 'contentlayer/generated'
import { notFound } from 'next/navigation'
import Image from 'components/Image'
import siteMetadata from 'data/siteMetadata'
import { Metadata } from 'next'
import MiniPCModelVariants from 'components/MiniPcModelFeatures'
import type MiniPcExtractedData from 'data/minipcs/miniPcExtractedData'
import { getAllMiniPcs } from 'lib/minipcs'
import MiniPcWithBrand from '@/data/minipcs/miniPcWithBrand'

interface PageProps {
  params: Promise<{ slug: string[] }>
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

// Function to get a specific mini PC by slug
async function getMiniPcBySlug(slug: string): Promise<MiniPcWithBrand | undefined> {
  const allMiniPcs = await getAllMiniPcs()
  return allMiniPcs.find((pc) => {
    // Create a slug from the brand and model
    const pcSlug = pc.model.replaceAll(' ', '').toLowerCase()
    return pcSlug === slug.toLowerCase()
  })
}

export async function generateMetadata(props: PageProps): Promise<Metadata | undefined> {
  const params = await props.params
  const slug = decodeURI(params.slug.join('/'))
  const miniPc = await getMiniPcBySlug(slug)

  if (!miniPc) {
    return
  }

  const imageList =
    miniPc.mainImgUrls && miniPc.mainImgUrls.length > 0
      ? [miniPc.mainImgUrls[0]]
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

export default async function Page(props: PageProps) {
  const params = await props.params
  const slug = decodeURI(params.slug.join('/'))
  const miniPc = await getMiniPcBySlug(slug)

  if (!miniPc) {
    return notFound()
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-4">
      <div className="flex w-full flex-col gap-6 md:flex-row md:items-start">
        {miniPc.mainImgUrls && miniPc.mainImgUrls.length > 0 && (
          <div className="flex h-auto w-full justify-center md:w-1/3">
            <Image
              alt={miniPc.model}
              src={miniPc.mainImgUrls[0]}
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
          <p className="font-semibold">
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
            <p className="font-semibold">
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
                {miniPc.graphics.displayPorts.thunderbolt?.amount && (
                  <p>
                    Thunderbolt{' '}
                    {miniPc.graphics.displayPorts.thunderbolt.type
                      .toLocaleLowerCase()
                      .replaceAll('thunderbolt', '')}{' '}
                    x {miniPc.graphics.displayPorts.thunderbolt.amount}
                  </p>
                )}
                {miniPc.graphics.displayPorts.dp?.amount && (
                  <p>
                    DisplayPort{' '}
                    {miniPc.graphics.displayPorts.dp.type
                      .toLocaleLowerCase()
                      .replaceAll('DisplayPort', '')}{' '}
                    x {miniPc.graphics.displayPorts.dp.amount}
                  </p>
                )}
                {miniPc.graphics.displayPorts.hdmi?.amount && (
                  <p>
                    HDMI{' '}
                    {miniPc.graphics.displayPorts.hdmi.type
                      .toLocaleLowerCase()
                      .replaceAll('hdmi', '')}{' '}
                    x {miniPc.graphics.displayPorts.hdmi.amount}
                  </p>
                )}
                {miniPc.graphics.displayPorts.usb4?.amount && (
                  <p>
                    USB4{' '}
                    {miniPc.graphics.displayPorts.usb4.type
                      .toLocaleLowerCase()
                      .replaceAll('usb4', '')}{' '}
                    x {miniPc.graphics.displayPorts.usb4.amount}
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
                <span className="font-semibold">RAM: </span>
                <span>
                  {variant.ram.capacityGB} GB ({variant.ram.type})
                </span>
              </div>
              <div>
                <span className="font-semibold">Storage: </span>
                <span>
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
          <p>
            {!miniPc.connectivity.wifi.toLocaleLowerCase().includes('wifi') && 'WiFi '}
            {miniPc.connectivity.wifi}
          </p>
          <p>
            {!miniPc.connectivity.bluetooth.toLocaleLowerCase().includes('bluetooth') &&
              'Bluetooth '}
            {miniPc.connectivity.bluetooth}
          </p>
          {miniPc.builtinMicrophone && <p>Built-in Microphone: Yes</p>}
          {miniPc.builtinSpeakers && <p>Built-in Speakers: Yes</p>}
        </div>

        <div>
          <h2 className="mb-2 flex items-center justify-between border-b border-gray-300 pb-2 text-lg font-semibold dark:border-gray-600">
            Ports
            {miniPc.portsImgUrls && miniPc.portsImgUrls.length > 0 && (
              <a className="text-primary-600 text-sm" href={miniPc.portsImgUrls[0]} target="_blank">
                See image of all ports
              </a>
            )}
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(miniPc.ports).map(([key, value]) => {
              if (!value) return null
              return (
                <p key={key}>
                  {typeof value === 'boolean'
                    ? `With ${key.replace(/([A-Z])/g, ' $1').trim()}`
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
    </div>
  )
}
