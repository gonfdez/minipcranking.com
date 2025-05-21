'use client'

import { useState, useEffect } from 'react'
import MiniPcListItem from 'components/MiniPcListItem'
import { Pagination } from 'components/Pagination'
import MiniPcWithBrand from '@/data/minipcs/miniPcWithBrand'

const CARDS_PER_PAGE = 6

export function MiniPcsLayout({
  pagination,
  initialData,
}: {
  pagination: { currentPage: number; totalPages: number }
  initialData: MiniPcWithBrand[]
}) {
  const [searchValue, setSearchValue] = useState('')
  const [filteredData, setFilteredData] = useState(initialData)

  // Filtrar los datos cuando cambia la búsqueda
  useEffect(() => {
    if (!searchValue.trim()) {
      setFilteredData(initialData)
    } else {
      const lowerSearch = searchValue.toLowerCase()
      setFilteredData(
        initialData.filter((pc) => {
          // Verificar en el modelo y marca
          if (
            (pc.model && pc.model.toLowerCase().includes(lowerSearch)) ||
            (pc.brand && pc.brand.toLowerCase().includes(lowerSearch))
          ) {
            return true
          }

          // Verificar en las descripciones (que son objetos con 'en' y 'es')
          if (pc.description) {
            if (
              (typeof pc.description.en === 'string' &&
                pc.description.en.toLowerCase().includes(lowerSearch)) ||
              (typeof pc.description.es === 'string' &&
                pc.description.es.toLowerCase().includes(lowerSearch))
            ) {
              return true
            }
          }

          // Verificar en CPU
          if (
            pc.cpu &&
            ((pc.cpu.brand && pc.cpu.brand.toLowerCase().includes(lowerSearch)) ||
              (pc.cpu.model && pc.cpu.model.toLowerCase().includes(lowerSearch)))
          ) {
            return true
          }

          return false
        })
      )
    }
  }, [searchValue, initialData])

  // Si hay búsqueda activa, mostrar todos los resultados sin paginación
  const paginatedData = searchValue.trim()
    ? filteredData
    : filteredData.slice(
        CARDS_PER_PAGE * (pagination?.currentPage - 1),
        CARDS_PER_PAGE * pagination?.currentPage
      )

  return (
    <div className="mx-auto max-w-6xl divide-y divide-gray-200 dark:divide-gray-700">
      <div className="space-y-2 pt-6 pb-8 md:space-y-5">
        <div className="relative w-full">
          <input
            aria-label="Search Mini PCs"
            type="text"
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search Mini PCs"
            className="focus:border-primary-500 focus:ring-primary-500 block w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 dark:border-gray-900 dark:bg-gray-800 dark:text-gray-100"
          />
        </div>
      </div>

      <div>
        <div className="grid gap-4 pt-8 md:grid-cols-2 lg:grid-cols-3">
          {paginatedData.length > 0 ? (
            paginatedData.map((data) => <MiniPcListItem key={data.model} miniPc={data} />)
          ) : (
            <div className="col-span-full text-center text-lg text-gray-500 dark:text-gray-400">
              No Mini PCs found.
            </div>
          )}
        </div>

        {!searchValue.trim() && pagination && filteredData.length > CARDS_PER_PAGE && (
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            basePath="./minipcs"
          />
        )}
      </div>
    </div>
  )
}
