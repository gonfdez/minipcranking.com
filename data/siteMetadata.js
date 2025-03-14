/** @type {import("pliny/config").PlinyConfig } */
const siteMetadata = {
  title: 'Mini PC Ranking - Best Mini PCs Reviewed and Compared',
  author: 'gfs-studio',
  headerTitle: 'Mini Pc Ranking',
  description:
    'Expert reviews, comparisons, buying guides, and rankings of the best Mini PCs for all budgets and use cases. Discover which Mini PC fits your needs perfectly.',
  language: 'en-us',
  theme: 'system', // system, dark or light
  siteUrl: 'https://minipcranking.com',
  siteLogo: `${process.env.BASE_PATH || ''}/static/images/logo.png`,
  socialBanner: `${process.env.BASE_PATH || ''}/static/images/twitter-card.png`,
  email: 'contact@minipcranking.com',
  locale: 'en-US',
  // set to true if you want a navbar fixed to the top
  stickyNav: false,
  search: {
    provider: 'kbar',
    kbarConfig: {
      searchDocumentsPath: `${process.env.BASE_PATH || ''}/search.json`, // path to load documents to search
    },
  },
  keywords: [
    'Mini PC',
    'best Mini PCs',
    'Mini PC reviews',
    'Mini PC comparisons',
    'Mini PC buying guide',
    'compact computers',
    'mini computers',
    'desktop alternatives',
    'budget Mini PCs',
    'Mini PC deals',
    'small form factor PC',
  ],
}

module.exports = siteMetadata
