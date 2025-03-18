'use client'

export default function MiniPCModelVariants({
  data,
  className = '',
}: {
  data: MiniPcInterface
  className?: string
}) {
  return (
    <div className={`grid grid-cols-1 gap-2 md:grid-cols-2 ${className}`}>
      {data.variants.map((variant) => (
        <div
          key={Math.random().toString(36).substring(2, 15)}
          className="flex flex-col rounded-md bg-gray-100 p-3 shadow-sm dark:bg-gray-800"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold uppercase">RAM</span>
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
              <div className="flex font-semibold text-blue-600 dark:text-blue-400">
                {variant.ram.capacityGB} GB
                <span
                  className="ms-2 max-w-[166px] truncate overflow-hidden text-ellipsis whitespace-nowrap text-gray-700 dark:text-gray-300"
                  title={variant.ram.type}
                >
                  {variant.ram.type}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold uppercase">Storage</span>
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
              <div className="flex font-semibold text-blue-600 dark:text-blue-400">
                {variant.storage.capacityGB} GB
                <span
                  className="ms-2 max-w-[166px] truncate overflow-hidden text-ellipsis whitespace-nowrap text-gray-700 dark:text-gray-300"
                  title={variant.storage.type}
                >
                  {variant.storage.type}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between border-t border-gray-300 pt-2 dark:border-gray-600">
            <span className="text-sm font-semibold uppercase">Best offer</span>
            <span
              className="max-w-[100px] truncate overflow-hidden font-medium text-ellipsis whitespace-nowrap text-gray-700 dark:text-gray-300"
              title={variant.oferts[0].provider}
            >
              {variant.oferts[0].provider}
            </span>
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              ${variant.oferts[0].priceUsd}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
