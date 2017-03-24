// @flow
import within from '@turf/within'

import epsg21781to4326 from './epsg21781to4326notReverse'

export default (store:Object, featureCollectionToSearchWithin:Object) => {
  const { table } = store
  const pop = Array.from(table.pop.values())
    .filter(t => t.PopXKoord && t.PopYKoord)

  const points = {
    type: `FeatureCollection`,
    // build an array of geoJson points
    features: pop.map(t => ({
      type: `Feature`,
      properties: {
        PopId: t.PopId,
      },
      geometry: {
        type: `Point`,
        // convert koordinates to wgs84
        coordinates: epsg21781to4326(t.PopXKoord, t.PopYKoord),
      },
    }))
  }

  // let turf check what points are within featureCollectionToSearchWithin
  const result = within(points, featureCollectionToSearchWithin)
  return result.features.map(r => r.properties.PopId)
}
