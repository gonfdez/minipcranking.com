import Image from './Image'
import Link from './Link'
import MiniPCModelFeatures from './MiniPcModelFeatures'

const MiniPcCard = ({ miniPcData }: { miniPcData: MiniPcInterface }) => {
  const href = '/'
  return (
    <div className="w-full">
      <div className="flex flex-col items-center overflow-hidden rounded-md border border-gray-300 md:flex-row md:items-start dark:border-gray-700">
        {miniPcData.imgSrc && (
          <div className="h-[180px] w-full flex-shrink-0 overflow-hidden md:h-[200px] md:w-[200px]">
            {href ? (
              <Link href={href} aria-label={`Link to ${miniPcData.model}`}>
                <Image
                  alt={miniPcData.model}
                  src={miniPcData.imgSrc}
                  className="h-full w-full object-cover"
                  width={200}
                  height={200}
                />
              </Link>
            ) : (
              <Image
                alt={miniPcData.model}
                src={miniPcData.imgSrc}
                className="h-full w-full object-cover"
                width={200}
                height={200}
              />
            )}
          </div>
        )}
        <div className="w-full p-4 md:p-6">
          {miniPcData.brand}
          <h2 className="mb-2 text-xl font-bold tracking-tight md:text-2xl">
            {href ? (
              <Link href={href} aria-label={`Link to ${miniPcData.model}`}>
                {miniPcData.model}
              </Link>
            ) : (
              miniPcData.model
            )}
          </h2>
          <MiniPCModelFeatures data={miniPcData} />
        </div>
      </div>
    </div>
  )
}

export default MiniPcCard
