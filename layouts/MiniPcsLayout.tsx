'use client'

import { JSX } from 'react'
import { Pagination, PaginationProps } from '@/components/Pagination'

interface MiniPcsLayoutProps {
  initialCards?: JSX.Element[]
  pagination?: PaginationProps
}

export default function MiniPcsLayout({ initialCards, pagination }: MiniPcsLayoutProps) {
  return (
    <div className="divide-y divide-gray-300 dark:divide-gray-700">
      <div className="space-y-2 pt-6 pb-8 md:space-y-5">
        <div className="relative">
          <label>
            <span className="sr-only">Search Mini Pc's</span>
            <input
              aria-label="Search articles"
              type="text"
              onChange={() => null}
              placeholder="Search Mini Pc's"
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
        <div className="w-full space-y-4">{initialCards}</div>
        {pagination && pagination.totalPages > 1 && (
          <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
        )}
      </div>
    </div>
  )
}
