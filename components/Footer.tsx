import Link from './Link'
import siteMetadata from '@/data/siteMetadata'

export default function Footer() {
  return (
    <footer className="pb-2">
      <div className="flex flex-col items-center text-center">
        <div className="flex flex-wrap justify-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <span>{siteMetadata.author}</span>
          <span>{` • `}</span>
          <span>{`© ${new Date().getFullYear()}`}</span>
          <span>{` • `}</span>
          <Link href="/" className="hover:underline">
            {siteMetadata.title}
          </Link>
        </div>
      </div>
    </footer>
  )
}
