// @flow
import within from '@turf/within'
import isFinite from 'lodash/isFinite'

import epsg2056to4326 from './epsg2056to4326notReverse'

export default ({
  mapFilter, 
  data: pops,
}:{
  mapFilter: Object, 
  pops: Array<Object>,
}): Array<number> => {
  /**
   * data is passed from map.pop.pops OR a view fetched from the server
   * so need to filter to data with coordinates first...
   */
  // make sure all pops used have coordinates
  let popsToUse = pops.filter(p => {
    if (!p.id && !p.popId && !p.pop_id) return false
    if (p.x && isFinite(p.x) && p.y && isFinite(p.y)) return true
    if (
      p.popX && isFinite(p.popX) &&
      p.popY && isFinite(p.popY)
    )
      return true
    if (
      p.pop_x && isFinite(p.pop_x) &&
      p.pop_y && isFinite(p.pop_y)
    )
      return true
    return false
  })
  // ...and account for user friendly field names in views
  popsToUse = popsToUse.map(p => {
    if (p.popX && p.popY) {
      p.x = p.popX
      p.y = p.popY
    }
    if (p.pop_x && p.pop_y) {
      p.x = p.pop_x
      p.y = p.pop_y
    }
    return p
  })
  const points = {
    type: 'FeatureCollection',
    // build an array of geoJson points
    features: popsToUse.map(p => ({
      type: 'Feature',
      properties: {
        id: p.id || p.popId || p.pop_id,
      },
      geometry: {
        type: 'Point',
        // convert koordinates to wgs84
        coordinates: epsg2056to4326(p.x, p.y),
      },
    })),
  }

  // let turf check what points are within filter
  const result = within(points, mapFilter)

  return result.features.map(r => r.properties.id)
}
