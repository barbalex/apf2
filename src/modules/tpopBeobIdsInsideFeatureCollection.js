// @flow
import within from '@turf/within'

import epsg21781to4326 from './epsg21781to4326notReverse'

export default (
  store: Object,
  beobs: Array<Object>
): Array<number | string> => {
  const points = {
    type: `FeatureCollection`,
    // build an array of geoJson points
    features: beobs.map(b => {
      const coordinates = b.QuelleId === 1
        ? // convert koordinates to wgs84
          epsg21781to4326(b.beob.COORDONNEE_FED_E, b.beob.COORDONNEE_FED_N)
        : epsg21781to4326(b.beob.FNS_XGIS, b.beob.FNS_YGIS)
      return {
        type: `Feature`,
        properties: {
          BeobId: b.BeobId
        },
        geometry: {
          type: `Point`,
          coordinates
        }
      }
    })
  }

  // let turf check what points are within filter
  const result = within(points, store.map.mapFilter.filter)
  return result.features.map(r => r.properties.BeobId)
}
