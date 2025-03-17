import { genPageMetadata } from 'app/seo'
import miniPcsData from '@/data/minipcs/data'
import { MiniPcsLayout } from '@/layouts/MiniPcsLayout'

export const metadata = genPageMetadata({ title: "Mini Pc's" })

export const CARDS_PER_PAGE = 6

export default function MiniPcsPage() {
  const pageNumber = 1
  const totalPages = Math.ceil(miniPcsData.length / CARDS_PER_PAGE)
  const pagination = {
    currentPage: pageNumber,
    totalPages: totalPages,
  }
  return <MiniPcsLayout pagination={pagination} />
}
