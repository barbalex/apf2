// @flow
import within from '@turf/within'

import epsg21781to4326 from './epsg21781to4326notReverse'

export default (store:Object, pops:Array<Object>) => {
  /**
   * data is passed from map.pop.pops OR a view fetched from the server
   * so need to filter to data with coordinates first...
   */
  let popsToUse = pops.filter((p) => {
    if (!p.PopId) return false
    if (p.PopXKoord && p.PopYKoord) return true
    if (p[`Pop X-Koordinaten`] && p[`Pop Y-Koordinaten`]) return true
    return false
  })
  // ...and account for user friendly field names in views
  popsToUse = popsToUse.map((p) => {
    if (p[`Pop X-Koordinaten`] && p[`Pop Y-Koordinaten`]) {
      p.PopXKoord = p[`Pop X-Koordinaten`]
      p.PopYKoord = p[`Pop Y-Koordinaten`]
    }
    return p
  })
  const points = {
    type: `FeatureCollection`,
    // build an array of geoJson points
    features: popsToUse.map(p => ({
      type: `Feature`,
      properties: {
        PopId: p.PopId,
      },
      geometry: {
        type: `Point`,
        // convert koordinates to wgs84
        coordinates: epsg21781to4326(p.PopXKoord, p.PopYKoord),
      },
    }))
  }

  // let turf check what points are within filter
  const result = within(points, store.node.nodeMapFilter.filter)
  return result.features.map(r => r.properties.PopId)
}
