import Image from './Image'
import Link from './Link'
import MiniPCModelVariants from './MiniPcModelFeatures'

interface MiniPcCardProps {
  miniPcData: MiniPcInterface
}

const MiniPcCard = ({ miniPcData }: MiniPcCardProps) => {
  return (
    <div className="w-full">
      <Link href={`/minipcs/${miniPcData.id.replaceAll(' ', '')}`} target="_self">
        <div className="flex flex-col items-center overflow-hidden rounded-md border border-gray-300 md:flex-row md:items-start dark:border-gray-700">
          {miniPcData.imgSrc && (
            <div className="h-[80px] w-full flex-shrink-0 overflow-hidden md:h-[150px] md:w-[150px]">
              <Image
                alt={miniPcData.model}
                src={miniPcData.imgSrc}
                className="h-full w-full object-cover"
                width={200}
                height={200}
              />
            </div>
          )}
          <div className="w-full p-4 md:p-6">
            {miniPcData.brand}
            <h2 className="mb-2 text-xl font-bold tracking-tight md:text-2xl">
              {miniPcData.model}
            </h2>
            <p className="text-sm text-gray-600 md:text-base dark:text-gray-400">
              <span className="text-gray-800 dark:text-gray-200">CPU</span> {miniPcData.cpu.brand}{' '}
              {miniPcData.cpu.model}
            </p>
            <p className="text-sm text-gray-600 md:text-base dark:text-gray-400">
              <span className="text-gray-800 dark:text-gray-200">
                {miniPcData.graphics.integrated ? 'Integrated ' : ''} GPU
              </span>{' '}
              {miniPcData.graphics.brand} {miniPcData.graphics.model} (
              {miniPcData.graphics.frequencyMHz} MHz)
            </p>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default MiniPcCard
