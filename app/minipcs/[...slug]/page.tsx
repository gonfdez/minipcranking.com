import 'css/prism.css'
import 'katex/dist/katex.css'

import { allBlogs } from 'contentlayer/generated'
import { notFound } from 'next/navigation'
import miniPcsData from '@/data/minipcs/data'
import { MINI_PC_ID } from '@/data/minipcs/id'
import Image from '@/components/Image'
import siteMetadata from '@/data/siteMetadata'
import { Metadata } from 'next'

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

  // Filter drafts in production
  const id = Object.values(MINI_PC_ID).find((s) => s.replaceAll(' ', '') === slug)
  const data = miniPcsData.find((data) => data.id === id)
  if (!data) {
    return notFound()
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-4">
      {/* Main section: Image, Title, Description */}
      <div className="flex w-full flex-col gap-6 md:flex-row">
        {data.imgSrc && (
          <div className="flex w-full justify-center md:w-1/3">
            <Image
              alt={data.model}
              src={data.imgSrc}
              className="max-h-[300px] w-full rounded-md object-cover"
              width={300}
              height={300}
            />
          </div>
        )}

        <div className="flex w-full flex-col justify-center md:w-2/3">
          <h1 className="text-3xl font-bold">{data.title}</h1>
          <p className="mb-4 text-sm text-gray-500">
            {data.brand} - {data.model}
          </p>
          <p className="mb-4 text-gray-700 dark:text-gray-300">{data.description}</p>
        </div>
      </div>

      {/* Specifications */}
      <div className="grid w-full grid-cols-1 gap-6 rounded-lg bg-gray-100 p-6 md:grid-cols-3 dark:bg-gray-800">
        <div>
          <h2 className="mb-2 border-b pb-2 text-lg font-semibold">CPU</h2>
          <p>
            {data.cpu.brand} {data.cpu.model}
          </p>
          <p>
            {data.cpu.cores} cores / {data.cpu.threads} threads
          </p>
          <p>{data.cpu.baseClockGHz} GHz</p>
          {data.cpu.boostClockGHz && <p>Boost: {data.cpu.boostClockGHz} GHz</p>}
        </div>

        <div>
          <h2 className="mb-2 border-b pb-2 text-lg font-semibold">Graphics</h2>
          <p>{data.graphics.integrated ? 'Integrated' : 'Dedicated'}</p>
          {data.graphics.brand && (
            <p>
              {data.graphics.brand} {data.graphics.model}
            </p>
          )}
        </div>

        <div>
          <h2 className="mb-2 border-b pb-2 text-lg font-semibold">Memory & Storage</h2>
          <p>
            RAM: {data.variants[0].ramGB} GB ({data.variants[0].ramType})
          </p>
          <p>
            {data.variants[0].storage.capacityGB} GB {data.variants[0].storage.type}
          </p>
        </div>

        <div>
          <h2 className="mb-2 border-b pb-2 text-lg font-semibold">Connectivity</h2>
          <p>WiFi: {data.connectivity.wifi}</p>
          <p>Bluetooth: {data.connectivity.bluetooth}</p>
        </div>

        <div>
          <h2 className="mb-2 border-b pb-2 text-lg font-semibold">Ports</h2>
          {data.ports.usb3 && <p>USB 3.0: {data.ports.usb3}</p>}
          {data.ports.hdmi && <p>HDMI: {data.ports.hdmi}</p>}
          {data.ports.ethernet && <p>Ethernet: {data.ports.ethernet}</p>}
        </div>

        <div>
          <h2 className="mb-2 border-b pb-2 text-lg font-semibold">Dimensions & Weight</h2>
          <p>
            {data.dimensions.widthMm} x {data.dimensions.heightMm} x {data.dimensions.depthMm} mm
          </p>
          <p>{data.weightKg} kg</p>
        </div>
      </div>
    </div>
  )
}
