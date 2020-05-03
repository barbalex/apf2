'use strict'
// see: https://nodejs.org/de/docs/guides/nodejs-docker-webapp/

const Hapi = require('@hapi/hapi')
const axios = require('axios')
const querystring = require('querystring')

const server = new Hapi.Server({
  host: '0.0.0.0',
  port: 7000,
})

const karteMassnahmenBaseUrl = 'https://maps.zh.ch/wfs/FnsAPFloraWFS'
const karteMassnahmenParams = {
  service: 'WFS',
  version: '2.0.0',
  request: 'getFeature',
  typeName: 'ms:massnahmenflaechen',
  srsName: 'EPSG::4326',
  maxFeatures: 3000,
  // weird output format according to https://maps.zh.ch/wfs/FnsAPFloraWFS?SERVICE=WFS&Request=GetCapabilities
  outputFormat: 'application/json; subtype=geojson',
}
const karteMassnahmenUrl = `${karteMassnahmenBaseUrl}?${querystring.stringify(
  karteMassnahmenParams,
)}`

const karteBetreuungsgebieteBaseUrl = 'https://maps.zh.ch/wfs/OGDZHWFS'
const karteBetreuungsgebieteParams = {
  service: 'WFS',
  version: '2.0.0',
  request: 'getFeature',
  typeName: 'ms:ogd-0428_aln_fns_betreuungsgebiete_f',
  srsName: 'EPSG:4326',
  // weird output format according to https://maps.zh.ch/wfs/OGDZHWFS?SERVICE=WFS&Request=GetCapabilities
  outputFormat: 'application/json; subtype=geojson',
}
const karteBetreuungsgebieteUrl = `${karteBetreuungsgebieteBaseUrl}?${querystring.stringify(
  karteBetreuungsgebieteParams,
)}`

async function start() {
  server.route({
    method: 'GET',
    path: '/karte/massnahmen',
    handler: async (req, h) => {
      return axios({
        method: 'get',
        url: karteMassnahmenUrl,
        auth: {
          username: process.env.MAPS_ZH_CH_USER,
          password: process.env.MAPS_ZH_CH_SECRET,
        },
      })
        .then((response) => {
          return h.response(response.data).code(200)
        })
        .catch((error) => {
          console.log('Massnahmen, error:', error)
          return h.response(error.message).code(500)
        })
    },
  })
  server.route({
    method: 'GET',
    path: '/karte/betreuungsgebiete',
    handler: async (req, h) => {
      //console.log('karteBetreuungsgebieteUrl:', karteBetreuungsgebieteUrl)
      return axios({
        method: 'get',
        url: karteBetreuungsgebieteUrl,
        auth: {
          username: process.env.MAPS_ZH_CH_USER,
          password: process.env.MAPS_ZH_CH_SECRET,
        },
      })
        .then((response) => {
          return h.response(response.data).code(200)
        })
        .catch((error) => {
          console.log('Betreuungsgebiete, error:', error)
          return h.response(error.message).code(500)
        })
    },
  })

  await server.start()
  console.log('ss-Server running at:', server.info.uri)
}

process.on('unhandledRejection', (err) => {
  console.log(err)
  process.exit(1)
})

start()
