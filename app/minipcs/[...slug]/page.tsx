import 'css/prism.css'
import 'katex/dist/katex.css'

import { allBlogs } from 'contentlayer/generated'
import { notFound } from 'next/navigation'
import miniPcsData from '@/data/minipcs/data'
import { MINI_PC_ID } from '@/data/minipcs/id'
import Image from '@/components/Image'
import siteMetadata from '@/data/siteMetadata'
import { Metadata } from 'next'
import MiniPCModelVariants from '@/components/MiniPcModelFeatures'

export async function generateMetadata(props: {
  params: Promise<{ slug: string[] }>
}): Promise<Metadata | undefined> {
  const params = await props.params
  const slug = decodeURI(params.slug.join('/'))
  const miniPc = miniPcsData.find((p) => p.id.replaceAll(' ', '') === slug)

  if (!miniPc) {
    return
  }

  const imageList = miniPc.imgSrc ? [miniPc.imgSrc] : [siteMetadata.socialBanner]
  const ogImages = imageList.map((img) => ({
    url: img.includes('http') ? img : siteMetadata.siteUrl + img,
  }))

  return {
    title: miniPc.title,
    description: miniPc.description,
    openGraph: {
      title: miniPc.title,
      description: miniPc.description,
      siteName: siteMetadata.title,
      locale: 'en_US',
      type: 'article',
      url: `${siteMetadata.siteUrl}/minipcs/${miniPc.id.replaceAll(' ', '')}`,
      images: ogImages,
    },
    twitter: {
      card: 'summary_large_image',
      title: miniPc.title,
      description: miniPc.description,
      images: imageList,
    },
  }
}

export const generateStaticParams = async () => {
  return allBlogs.map((p) => ({
    slug: p.slug.split('/').map((name) => decodeURI(name)),
  }))
}

export default async function Page(props: { params: Promise<{ slug: string[] }> }) {
  const params = await props.params
  const slug = decodeURI(params.slug.join('/'))

  const id = Object.values(MINI_PC_ID).find((s) => s.replaceAll(' ', '') === slug)
  const data = miniPcsData.find((data) => data.id === id)
  if (!data) {
    return notFound()
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-4">
      <div className="flex w-full flex-col gap-6 md:flex-row md:items-start">
        {data.imgSrc && (
          <div className="flex h-auto w-full justify-center md:w-1/3">
            <Image
              alt={data.model}
              src={data.imgSrc}
              className="max-h-[300px] w-full rounded-md object-cover"
              width={300}
              height={300}
            />
          </div>
        )}

        <div className="flex w-full flex-col gap-4 md:p-6">
          <h1 className="mb-2 text-xl font-bold tracking-tight md:text-2xl">
            {data.brand} {data.model}
          </h1>

          {/* Aquí colocamos el componente de variantes */}
          <MiniPCModelVariants data={data} className="w-full" />
        </div>
      </div>

      <div className="grid w-full grid-cols-1 gap-6 rounded-lg bg-gray-100 p-3 p-6 shadow-sm md:grid-cols-3 dark:bg-gray-800">
        <div>
          <h2 className="mb-2 border-b border-gray-300 pb-2 text-lg font-semibold dark:border-gray-600">
            CPU
          </h2>
          <p>
            {data.cpu.brand} {data.cpu.model}
          </p>
          <p>
            {data.cpu.cores} cores / {data.cpu.threads} threads
          </p>
          {data.cpu.baseClockGHz && <p>Base: {data.cpu.baseClockGHz} GHz</p>}
          {data.cpu.boostClockGHz && <p>Boost: {data.cpu.boostClockGHz} GHz</p>}
          {data.cpu.cache && (
            <p>
              Cache: {data.cpu.cache.capacityMB} MB {data.cpu.cache.type}
            </p>
          )}
        </div>

        <div>
          <h2 className="mb-2 border-b border-gray-300 pb-2 text-lg font-semibold dark:border-gray-600">
            Graphics
          </h2>
          <p>{data.graphics.integrated ? 'Integrated' : 'Discrete'} GPU</p>
          {data.graphics.brand && (
            <p>
              {data.graphics.brand} {data.graphics.model}
            </p>
          )}
          {data.graphics.frequencyMHz && <p>Clock: {data.graphics.frequencyMHz} MHz</p>}
          {data.graphics.maxTOPS && <p>TOPS: {data.graphics.maxTOPS}</p>}
        </div>

        <div>
          <h2 className="mb-2 border-b border-gray-300 pb-2 text-lg font-semibold dark:border-gray-600">
            Memory & Storage
          </h2>
          {data.variants.slice(0, 1).map((variant, index) => (
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
        </div>

        <div>
          <h2 className="mb-2 border-b border-gray-300 pb-2 text-lg font-semibold dark:border-gray-600">
            Connectivity
          </h2>
          <p>WiFi: {data.connectivity.wifi}</p>
          <p>Bluetooth: {data.connectivity.bluetooth}</p>
        </div>

        <div>
          <h2 className="mb-2 flex items-center justify-between border-b border-gray-300 pb-2 text-lg font-semibold dark:border-gray-600">
            Ports
            {data.ports.imageSrc && (
              <a className="text-primary-600 text-sm" href={data.ports.imageSrc} target="_blank">
                See image of all ports
              </a>
            )}
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(data.ports).map(([key, value]) => {
              if (key === 'imageSrc' || value === undefined) return null
              return (
                <p key={key}>
                  {typeof value === 'boolean'
                    ? `${key.toUpperCase()}`
                    : `${key.toUpperCase()} x ${value}`}
                </p>
              )
            })}
          </div>
        </div>

        <div>
          <h2 className="mb-2 border-b border-gray-300 pb-2 text-lg font-semibold dark:border-gray-600">
            Dimensions & Weight
          </h2>
          <p>
            Size: {data.dimensions.widthMm} x {data.dimensions.heightMm} x {data.dimensions.depthMm}{' '}
            mm
          </p>
          <p>Weight: {data.weightKg} kg</p>
        </div>
      </div>
    </div>
  )
}
