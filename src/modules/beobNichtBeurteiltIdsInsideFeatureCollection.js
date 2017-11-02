// @flow
import within from '@turf/points-within-polygon'
import isFinite from 'lodash/isFinite'
import { toJS } from 'mobx'

import epsg21781to4326 from './epsg21781to4326notReverse'

export default (
  store: Object,
  beobs: Array<Object>
): Array<number | string> => {
  // make sure all beobs used have coordinates
  const beobsToUse = beobs.filter(
    b => b.X && isFinite(b.X) && b.Y && isFinite(b.Y)
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
        coordinates: epsg21781to4326(b.X, b.Y),
      },
    })),
  }

  // let turf check what points are within filter
  const result = within(toJS(points), toJS(store.map.mapFilter.filter))
  return result.features.map(r => r.properties.id)
}
