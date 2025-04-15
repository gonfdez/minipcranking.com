import Image from './Image'
import Link from './Link'

interface MiniPcCardProps {
  miniPcData: MiniPcInterface
}

const MiniPcListItem = ({ miniPcData }: MiniPcCardProps) => {
  const prices = miniPcData.variants
    .flatMap((variant) => variant.oferts.map((ofert) => ofert.priceUsd))
    .filter((price) => price !== undefined) as number[]
  const minPrice = prices.length > 0 ? Math.min(...prices) : null
  const maxPrice = prices.length > 0 ? Math.max(...prices) : null

  // Determinar cómo mostrar el precio
  const priceDisplay =
    minPrice !== null && maxPrice !== null
      ? minPrice === maxPrice
        ? `$${minPrice.toFixed(0)}`
        : `$${minPrice.toFixed(0)} - $${maxPrice.toFixed(0)}`
      : '$ --'

  return (
    <div className="w-full">
      <Link href={`/minipcs/${miniPcData.id.replaceAll(' ', '')}`} target="_self">
        <div className="flex flex-row items-center overflow-hidden rounded-md border border-gray-300 p-2 dark:border-gray-700">
          {miniPcData.imgSrc && (
            <div className="h-[80px] overflow-hidden md:h-[80px] md:w-[80px]">
              <Image
                alt={miniPcData.model}
                src={miniPcData.imgSrc}
                className="h-full w-full object-cover"
                width={80}
                height={80}
              />
            </div>
          )}
          <div className="w-full self-center px-2">
            <div className="flex w-full items-center justify-between">
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {miniPcData.brand}
              </span>
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                {priceDisplay}
              </span>
            </div>
            <h2 className="font-bold tracking-tight text-gray-900 md:text-lg dark:text-gray-100">
              {miniPcData.model}
            </h2>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default MiniPcListItem
