/**
 * starts a hapi server
 * in production
 */

const Hapi = require('hapi')
const Inert = require('inert')

const serverOptionsDevelopment = {
  debug: {
    log: ['error'],
    request: ['error']
  }
}
const server = new Hapi.Server(serverOptionsDevelopment)

server.register(Inert, function () {
  server.connection({
    host: '0.0.0.0',
    port: 5000
  })

  server.start(function (err) {
    if (err) {
      throw err
    }
    console.log('Server running at:', server.info.uri)
  })

  server.route({
    method: 'GET',
    path: '/{path*}',
    handler: {
      file: 'index.html',
    }
  })

  server.route({
    method: 'GET',
    path: '/static/css/{param*}',
    handler: {
      directory: {
        path: 'static/css',
        index: false,
      }
    }
  })

  server.route({
    method: 'GET',
    path: '/static/js/{param*}',
    handler: {
      directory: {
        path: 'static/js',
        index: false,
      }
    }
  })

  server.route({
    method: 'GET',
    path: '/static/media/{param*}',
    handler: {
      directory: {
        path: 'static/media',
        index: false,
      }
    }
  })
})
