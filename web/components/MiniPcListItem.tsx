import Image from './Image'
import Link from './Link'
import MiniPcWithBrand from '@/data/minipcs/miniPcWithBrand'

interface MiniPcCardProps {
  miniPc: MiniPcWithBrand
}

const MiniPcListItem = ({ miniPc }: MiniPcCardProps) => {
  // Generar slug para la URL desde el modelo
  const slug = miniPc.model.replaceAll(' ', '').toLowerCase()

  // Extraer precios de las variantes
  const prices = miniPc.variants
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

  // Obtener la imagen principal si existe
  const imgSrc = miniPc.mainImgUrl && miniPc.mainImgUrl.length > 0 ? miniPc.mainImgUrl[0] : null

  return (
    <div className="w-full">
      <Link href={`/minipcs/${slug}`} target="_self">
        <div className="flex flex-row items-center overflow-hidden rounded-md border border-gray-300 p-2 dark:border-gray-700">
          {imgSrc && (
            <div className="h-[80px] overflow-hidden md:h-[80px] md:w-[80px]">
              <Image
                alt={miniPc.model}
                src={imgSrc}
                className="h-full w-full object-cover"
                width={80}
                height={80}
              />
            </div>
          )}
          <div className="w-full self-center px-2">
            <div className="flex w-full items-center justify-between">
              <span className="font-medium text-gray-700 dark:text-gray-300">{miniPc.brand}</span>
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                {priceDisplay}
              </span>
            </div>
            <h2 className="font-bold tracking-tight text-gray-900 md:text-lg dark:text-gray-100">
              {miniPc.model}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {miniPc.cpu?.brand} {miniPc.cpu?.model}
            </p>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default MiniPcListItem
