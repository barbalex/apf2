// @flow
import within from '@turf/within'
import isFinite from 'lodash/isFinite'

import epsg2056to4326 from './epsg2056to4326notReverse'

export default (
  mapFilter: Object,
  beobs: Array<Object>
): Array<number | string> => {
  // make sure all beobs used have id and coordinates
  const beobsToUse = beobs.filter(
    b => b.id && b.x && isFinite(b.x) && b.y && isFinite(b.y)
  )
  const points = {
    type: 'FeatureCollection',
    // build an array of geoJson points
    features: beobsToUse.map(b => ({
      type: 'Feature',
      properties: {
        id: b.id,
      },
      geometry: {
        type: 'Point',
        coordinates: epsg2056to4326(b.x, b.y),
      },
    })),
  }

  // let turf check what points are within filter
  const result = within(points, mapFilter)
  return result.features.map(r => r.properties.id)
}
