// @flow
import within from '@turf/within'

import epsg21781to4326 from './epsg21781to4326notReverse'

export default (store:Object) => {
  const filter = store.node.nodeMapFilter.filter
  const points = {
    type: `FeatureCollection`,
    // build an array of geoJson points
    features: store.map.tpop.tpops.map(t => ({
      type: `Feature`,
      properties: {
        TPopId: t.TPopId,
      },
      geometry: {
        type: `Point`,
        // convert koordinates to wgs84
        coordinates: epsg21781to4326(t.TPopXKoord, t.TPopYKoord),
      },
    }))
  }

  // let turf check what points are within filter
  const result = within(points, filter)
  return result.features.map(r => r.properties.TPopId)
}
