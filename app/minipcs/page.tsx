import Card from '@/components/Card'
import { genPageMetadata } from 'app/seo'
import miniPcsData from '@/data/minipcs/data'

export const metadata = genPageMetadata({ title: "Mini Pc's" })

export default function Projects() {
  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
            Search bar and filters
          </p>
        </div>
        <div className="container py-12">
          <div className="-m-4 flex flex-wrap">
            {miniPcsData.map((d) => (
              <Card
                key={d.title}
                title={d.title}
                description={d.description}
                imgSrc={d.imgSrc}
                href={d.href}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
