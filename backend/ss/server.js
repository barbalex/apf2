'use strict'
// see: https://nodejs.org/de/docs/guides/nodejs-docker-webapp/

const Hapi = require('@hapi/hapi')
const axios = require('axios')

const server = new Hapi.Server({
  host: '0.0.0.0',
  port: 7000,
})

async function start() {
  server.route({
    method: 'GET',
    path: '/karte/massnahmen',
    handler: async (req, h) => {
      const baseUrl = 'https://maps.zh.ch/wfs/FnsAPFloraWFS'
      const params = {
        service: 'WFS',
        version: '1.0.0',
        request: 'getFeature',
        typeName: 'ms:massnahmenflaechen',
        maxFeatures: 3000,
        outputFormat: 'application/json',
      }
      const url = `${baseUrl}${window.L.Util.getParamString(params)}`
      axios({
        method: 'get',
        url,
        auth: {
          username: process.env.MAPS_ZH_CH_USER,
          password: process.env.MAPS_ZH_CH_SECRET,
        },
      })
        .then((response) => {
          console.log('Massnahmen, response:', response)
          h.response(response).code(200)
        })
        .catch((error) => {
          console.log('Massnahmen, error:', error)
          return h.response(error.message).code(500)
        })
    },
  })

  await server.start()
  console.log('JSON-API-Server running at:', server.info.uri)
}

process.on('unhandledRejection', (err) => {
  console.log(err)
  process.exit(1)
})

start()
