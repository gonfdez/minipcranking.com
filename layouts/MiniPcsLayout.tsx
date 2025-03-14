'use client'

import { JSX } from 'react'
import { Pagination, PaginationProps } from '@/components/Pagination'

interface MiniPcsLayoutProps {
  initialCards?: JSX.Element[]
  pagination?: PaginationProps
}

export default function MiniPcsLayout({ initialCards, pagination }: MiniPcsLayoutProps) {
  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      <div className="space-y-2 pt-6 pb-8 md:space-y-5">
        <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">Search bar and filters</p>
      </div>
      <div className="container py-12">
        <div className="w-full space-y-4">{initialCards}</div>
        {pagination && pagination.totalPages > 1 && (
          <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
        )}
      </div>
    </div>
  )
}
