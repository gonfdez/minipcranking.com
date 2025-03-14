'use client'

export default function MiniPCModelFeatures({ data }: { data: MiniPcInterface }) {
  return (
    <div className="mt-2">
      <p className="text-sm text-gray-600 md:text-base dark:text-gray-400">
        <span className="font-semibold text-gray-800 dark:text-gray-200">CPU:</span>{' '}
        {data.cpu.brand} {data.cpu.model}
      </p>

      <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
        {data.variants.map((variant) => (
          <div
            key={`${variant.ramType}-${variant.storage.capacityGB}-${variant.storage.type}-${variant.priceUsd}`}
            className="flex flex-col rounded-md bg-gray-100 p-3 shadow-sm dark:bg-gray-800"
          >
            <div className="flex justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase dark:text-gray-400">
                RAM
              </span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {variant.ramGB} GB ({variant.ramType})
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase dark:text-gray-400">
                Storage
              </span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {variant.storage.capacityGB} GB ({variant.storage.type})
              </span>
            </div>

            <div className="mt-2 border-t border-gray-300 pt-2 dark:border-gray-600">
              <span className="text-primary-600 text-sm font-semibold">${variant.priceUsd}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
