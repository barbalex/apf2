// @flow
/**
 * gets a latLng wgs 84
 * returns tpopId of nearest tpop
 */
import nearest from '@turf/nearest'
import gql from 'graphql-tag'
import get from 'lodash/get'
import flatten from 'lodash/flatten'
import isFinite from 'lodash/isFinite'
import app from 'ampersand-app'

import epsg2056to4326 from './epsg2056to4326'

export default async ({
  activeNodes,
  tree,
  latLng
}:{
  activeNodes: Array<Object>,
  tree: Object,
  latLng: Object
}): String => {
  const { client } = app
  const { lat, lng } = latLng
  const point = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Point',
      coordinates: [lat, lng],
    },
  }
  const { data } = await client.query({
    query: gql`
      query Query($apId: UUID!) {
        apById(id: $apId) {
          id
          popsByApId {
            nodes {
              id
              tpopsByPopId(filter: {x: {isNull: false}, y: {isNull: false}}) {
                nodes {
                  id
                  popId
                  x
                  y
                }
              }
            }
          }
        }
      }
    `,
    variables: { apId: activeNodes.ap }
  })
  const pops = get(data, 'apById.popsByApId.nodes')
  const tpops = flatten(
    pops.map(p =>
      get(p, 'tpopsByPopId.nodes')
        .filter(t => isFinite(t.x) && isFinite(t.y))
    )
  )
  const tpopFeatures = tpops
    .map(t => {
      return ({
        type: 'Feature',
        properties: {
          id: t.id,
          popId: t.popId
        },
        geometry: {
          type: 'Point',
          coordinates: epsg2056to4326(+t.x, +t.y)
        },
      })
    })
  const against = {
    type: 'FeatureCollection',
    features: tpopFeatures,
  }
  const nearestTpopFeature = nearest(point, against)
  return nearestTpopFeature.properties
}
