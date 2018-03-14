// @flow
import within from '@turf/within'
import isFinite from 'lodash/isFinite'
import { toJS } from 'mobx'

import epsg2056to4326 from './epsg2056to4326notReverse'

export default (
  store: Object,
  beobs: Array<Object>
): Array<string | number> => {
  /**
   * data is passed from view fetched from the server
   * so need to filter to data with coordinates first...
   */
  // make sure all beobs used have id and coordinates
  const beobsToUse = beobs.filter(
    b => b.id && b.X && isFinite(b.X) && b.Y && isFinite(b.Y)
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
        coordinates: epsg2056to4326(b.X, b.Y),
      },
    })),
  }

  // let turf check what points are within filter
  const result = within(toJS(points), toJS(store.map.mapFilter.filter))
  return result.features.map(r => r.properties.id)
}
