// @flow
import within from '@turf/within'

import epsg21781to4326 from './epsg21781to4326notReverse'

export default (store:Object, featureCollectionToSearchWithin:Object) => {
  const points = {
    type: `FeatureCollection`,
    // build an array of geoJson points
    features: store.map.beobNichtBeurteilt.beobs.map((b) => {
      const coordinates = (
        b.QuelleId === 1 ?
        // convert koordinates to wgs84
        epsg21781to4326(b.beob.COORDONNEE_FED_E, b.beob.COORDONNEE_FED_N) :
        epsg21781to4326(b.beob.FNS_XGIS, b.beob.FNS_YGIS)
      )
      return {
        type: `Feature`,
        properties: {
          BeobId: b.BeobId,
        },
        geometry: {
          type: `Point`,
          coordinates,
        },
      }
    })
  }

  // let turf check what points are within featureCollectionToSearchWithin
  const result = within(points, featureCollectionToSearchWithin)
  return result.features.map(r => r.properties.BeobId)
}
