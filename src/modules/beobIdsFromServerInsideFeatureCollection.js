// @flow
import within from '@turf/within'

import epsg21781to4326 from './epsg21781to4326notReverse'

export default (store: Object, beobs:Array<Object>) => {
  /**
   * data is passed from view fetched from the server
   * so need to filter to data with coordinates first...
   */
  const beobsToUse = beobs.filter((b) => {
    if (!b.BeobId) return false
    if (b.X && b.Y) return true
    return false
  })
  const points = {
    type: `FeatureCollection`,
    // build an array of geoJson points
    features: beobsToUse.map((b) => ({
      type: `Feature`,
      properties: {
        BeobId: b.BeobId,
      },
      geometry: {
        type: `Point`,
        coordinates: epsg21781to4326(b.X, b.Y),
      },
    }))
  }

  // let turf check what points are within filter
  const result = within(points, store.map.mapFilter.filter)
  return result.features.map(r => r.properties.BeobId)
}
