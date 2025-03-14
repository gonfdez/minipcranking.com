import MiniPcCard from '@/components/MiniPcCard'
import { genPageMetadata } from 'app/seo'
import miniPcsData from '@/data/minipcs/data'
import { notFound } from 'next/navigation'
import MiniPcsLayout from '@/layouts/MiniPcsLayout'

export const metadata = genPageMetadata({ title: "Mini Pc's" })

const CARDS_PER_PAGE = 3

export default async function MiniPcsPage(props: { params: Promise<{ page: string }> }) {
  const totalPages = Math.ceil(miniPcsData.length / CARDS_PER_PAGE)
  const params = await props.params
  const pageNumber = parseInt(params.page as string)
  const initialCards = miniPcsData
    .slice(CARDS_PER_PAGE * (pageNumber - 1), CARDS_PER_PAGE * pageNumber)
    .map((d) => <MiniPcCard miniPcData={d} key={d.id} />)

  // Return 404 for invalid page numbers or empty pages
  if (pageNumber <= 0 || pageNumber > totalPages || isNaN(pageNumber)) {
    return notFound()
  }
  const pagination = {
    currentPage: pageNumber,
    totalPages: totalPages,
  }

  return <MiniPcsLayout initialCards={initialCards} pagination={pagination} />
}
