// @flow
import within from '@turf/within'

import epsg21781to4326 from './epsg21781to4326notReverse'

export default (
  store: Object,
  beobs: Array<Object>,
): Array<number | string> => {
  const points = {
    type: 'FeatureCollection',
    // build an array of geoJson points
    features: beobs.map(b => ({
      type: 'Feature',
      properties: {
        BeobId: b.BeobId,
      },
      geometry: {
        type: 'Point',
        coordinates: epsg21781to4326(b.X, b.Y),
      },
    })),
  }

  // let turf check what points are within filter
  const result = within(points, store.map.mapFilter.filter)
  return result.features.map(r => r.properties.BeobId)
}
