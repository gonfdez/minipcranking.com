'use client'

export default function MiniPCModelVariants({ data }: { data: MiniPcInterface }) {
  return (
    <div>
      <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
        {data.variants.map((variant) => (
          <div
            key={Math.random().toString(36).substring(2, 15)}
            className="flex flex-col rounded-md bg-gray-100 p-3 shadow-sm dark:bg-gray-800"
          >
            <div className="flex justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase dark:text-gray-400">
                RAM
              </span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                <span className="text-primary-600 font-semibold">
                  {variant.ram.capacityGB} GB{' '}
                  <span className="text-gray-700 dark:text-gray-300">( {variant.ram.type} )</span>
                </span>
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase dark:text-gray-400">
                Storage
              </span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                <span className="text-primary-600 font-semibold">
                  {variant.storage.capacityGB} GB{' '}
                  <span className="text-gray-700 dark:text-gray-300">
                    ( {variant.storage.type} )
                  </span>
                </span>
              </span>
            </div>

            <div className="mt-2 flex justify-between border-t border-gray-300 pt-2 dark:border-gray-600">
              <span className="text-xs font-bold text-gray-500 uppercase dark:text-gray-400">
                Best offert
              </span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {variant.oferts[0].provider}
              </span>
              <span className="text-primary-600 text-sm font-semibold">
                ${variant.oferts[0].priceUsd}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
