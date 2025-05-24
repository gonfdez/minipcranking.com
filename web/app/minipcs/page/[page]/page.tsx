import { genPageMetadata } from 'app/seo'
import { getAllMiniPcs } from 'lib/minipcs'
import { notFound } from 'next/navigation'
import { MiniPcsLayout } from '@/layouts/MiniPcsLayout'
import { CARDS_PER_PAGE } from 'lib/minipcs'

export const metadata = genPageMetadata({ title: "Mini Pc's" })

export default async function MiniPcsPage(props: { params: Promise<{ page: string }> }) {
  const miniPcsData = await getAllMiniPcs()
  const totalPages = Math.ceil(miniPcsData.length / CARDS_PER_PAGE)
  const params = await props.params
  const pageNumber = parseInt(params.page as string)

  // Return 404 for invalid page numbers or empty pages
  if (pageNumber <= 0 || pageNumber > totalPages || isNaN(pageNumber)) {
    return notFound()
  }

  const pagination = {
    currentPage: pageNumber,
    totalPages: totalPages,
  }

  return <MiniPcsLayout pagination={pagination} initialData={miniPcsData} />
}
