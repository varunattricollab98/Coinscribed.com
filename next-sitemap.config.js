/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://coinscribed.com',
  generateRobotsTxt: false,
  generateIndexSitemap: false,
  changefreq: 'daily',
  priority: 0.7,
  exclude: ['/api/*', '/admin/*'],
  transform: async (config, path) => {
    const priorities = {
      '/': 1.0,
      '/calculators': 0.9,
      '/news': 0.9,
      '/bank-routing-numbers': 0.9,
    }

    return {
      loc: path,
      changefreq: config.changefreq,
      priority: priorities[path] || config.priority,
      lastmod: new Date().toISOString(),
    }
  },
}
