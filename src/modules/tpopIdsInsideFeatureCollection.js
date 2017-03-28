// @flow
import within from '@turf/within'

import epsg21781to4326 from './epsg21781to4326notReverse'

export default (store:Object, tpops:Array<Object>) => {
  /**
   * data is passed from map.pop.pops OR a view fetched from the server
   * so need to filter to data with coordinates first...
   */
  let tpopsToUse = tpops.filter((p) => {
    if (!p.TPopId) return false
    if (p.TPopXKoord && p.TPopYKoord) return true
    if (p[`TPop X-Koordinaten`] && p[`TPop Y-Koordinaten`]) return true
    return false
  })
  // ...and account for user friendly field names in views
  tpopsToUse = tpopsToUse.map((p) => {
    if (p[`TPop X-Koordinaten`] && p[`TPop Y-Koordinaten`]) {
      p.TPopXKoord = p[`TPop X-Koordinaten`]
      p.TPopYKoord = p[`TPop Y-Koordinaten`]
    }
    return p
  })
  const points = {
    type: `FeatureCollection`,
    // build an array of geoJson points
    features: tpopsToUse.map(t => ({
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
  const result = within(points, store.node.nodeMapFilter.filter)
  return result.features.map(r => r.properties.TPopId)
}
