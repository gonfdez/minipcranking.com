import Image from './Image'
import Link from './Link'

interface MiniPcCardProps {
  miniPcData: MiniPcInterface
}

const MiniPcCard = ({ miniPcData }: MiniPcCardProps) => {
  return (
    <div className="w-full">
      <Link href={`/minipcs/${miniPcData.id.replaceAll(' ', '')}`} target="_self">
        <div className="flex flex-row items-center items-start overflow-hidden rounded-md border border-gray-300 p-2 dark:border-gray-700">
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
          <div className="w-full self-center ps-2">
            {miniPcData.brand}
            <h2 className="font-bold tracking-tight md:text-lg">{miniPcData.model}</h2>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default MiniPcCard
