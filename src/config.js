const environment = {
  development: {
    isProduction: false
  },
  production: {
    isProduction: true
  }
}[process.env.NODE_ENV || 'development'];

module.exports = Object.assign(
  {
    host: process.env.HOST || 'localhost',
    port: process.env.PORT || 3000,
    apiHost: process.env.APIHOST || 'localhost',
    apiPort: process.env.APIPORT || 3000,
    app: {
      title: 'ThisGreatApp!',
      description: 'All the modern best practices in one example!!',
      head: {
        titleTemplate: 'ThisGreatApp!: %s',
        meta: [
          { name: 'description', content: 'All the modern best practices in one example.' },
          { charset: 'utf-8' },
          { property: 'og:site_name', content: 'ThisGreatApp!' },
          { property: 'og:image', content: 'https://react-redux.herokuapp.com/logo.jpg' },
          { property: 'og:locale', content: 'en_US' },
          { property: 'og:title', content: 'ThisGreatApp!' },
          { property: 'og:description', content: 'All the modern best practices in one example.' },
          { property: 'og:card', content: 'summary' },
          { property: 'og:site', content: '@dev' },
          { property: 'og:creator', content: '@dev' },
          { property: 'og:image:width', content: '200' },
          { property: 'og:image:height', content: '200' }
        ]
      }
    }
  },
  environment
);
