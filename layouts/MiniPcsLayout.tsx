'use client'

import { useState, useEffect } from 'react'
import MiniPcCard from '@/components/MiniPcCard'
import miniPcsData from '@/data/minipcs/data'
import { Pagination } from '@/components/Pagination'

const CARDS_PER_PAGE = 3

export function MiniPcsLayout({ pagination }) {
  const [searchValue, setSearchValue] = useState('')
  const [filteredData, setFilteredData] = useState(miniPcsData)

  // Filtrar los datos cuando cambia la búsqueda
  useEffect(() => {
    if (!searchValue.trim()) {
      setFilteredData(miniPcsData)
    } else {
      const lowerSearch = searchValue.toLowerCase()
      setFilteredData(
        miniPcsData.filter(({ title, brand, description }) =>
          [title, brand, description].some((field) => field.toLowerCase().includes(lowerSearch))
        )
      )
    }
  }, [searchValue])

  // Si hay búsqueda activa, mostrar todos los resultados sin paginación
  const paginatedData = searchValue.trim()
    ? filteredData
    : filteredData.slice(
        CARDS_PER_PAGE * (pagination?.currentPage - 1),
        CARDS_PER_PAGE * pagination?.currentPage
      )

  return (
    <div className="divide-y divide-gray-300 dark:divide-gray-700">
      <div className="space-y-2 pb-8 md:space-y-5">
        <div className="relative">
          <label>
            <span className="sr-only">Search Mini PCs</span>
            <input
              aria-label="Search Mini PCs"
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search Mini PCs"
              className="focus:border-primary-500 focus:ring-primary-500 block w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 dark:border-gray-900 dark:bg-gray-800 dark:text-gray-100"
            />
          </label>
          <svg
            className="absolute top-3 right-3 h-5 w-5 text-gray-400 dark:text-gray-300"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      <div className="container py-4">
        <div className="w-full space-y-4">
          {paginatedData.length > 0 ? (
            paginatedData.map((data) => <MiniPcCard miniPcData={data} key={data.id} />)
          ) : (
            <p className="text-center text-gray-500">No Mini PCs found.</p>
          )}
        </div>
        {!searchValue.trim() && pagination && filteredData.length > CARDS_PER_PAGE && (
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={Math.ceil(filteredData.length / CARDS_PER_PAGE)}
          />
        )}
      </div>
    </div>
  )
}
