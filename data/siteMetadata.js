/** @type {import("pliny/config").PlinyConfig } */
const siteMetadata = {
  title: 'Mini Pc Ranking',
  author: 'gfs-studio',
  headerTitle: 'Mini Pc Ranking',
  description: "Blog and compare of Mini Pc's",
  language: 'en-us',
  theme: 'system', // system, dark or light
  siteUrl: 'https://minipcranking.com',
  siteLogo: `${process.env.BASE_PATH || ''}/static/images/logo.png`,
  socialBanner: `${process.env.BASE_PATH || ''}/static/images/twitter-card.png`,
  email: 'contact@minipcranking.com',
  github: 'https://github.com/gfs-studio',
  locale: 'en-US',
  // set to true if you want a navbar fixed to the top
  stickyNav: false,
  search: {
    provider: 'kbar', // kbar or algolia
    kbarConfig: {
      searchDocumentsPath: `${process.env.BASE_PATH || ''}/search.json`, // path to load documents to search
    },
    // provider: 'algolia',
    // algoliaConfig: {
    //   // The application ID provided by Algolia
    //   appId: 'R2IYF7ETH7',
    //   // Public API key: it is safe to commit it
    //   apiKey: '599cec31baffa4868cae4e79f180729b',
    //   indexName: 'docsearch',
    // },
  },
}

module.exports = siteMetadata
