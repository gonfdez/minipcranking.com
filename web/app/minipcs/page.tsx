import { genPageMetadata } from 'app/seo'
import { CARDS_PER_PAGE, getAllMiniPcs } from 'lib/minipcs'
import { MiniPcsLayout } from '@/layouts/MiniPcsLayout'

export const metadata = genPageMetadata({ title: "Mini Pc's" })

export default async function MiniPcsPage() {
  const miniPcsData = await getAllMiniPcs()
  const pageNumber = 1
  const totalPages = Math.ceil(miniPcsData.length / CARDS_PER_PAGE)
  const pagination = {
    currentPage: pageNumber,
    totalPages: totalPages,
  }

  return <MiniPcsLayout pagination={pagination} initialData={miniPcsData} />
}
