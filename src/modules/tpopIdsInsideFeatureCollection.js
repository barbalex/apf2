// @flow
import within from '@turf/within'
import isFinite from 'lodash/isFinite'

import epsg2056to4326 from './epsg2056to4326notReverse'

export default ({
  mapFilter,
  data,
}:{
  mapFilter: Object, 
  data: Array<Object>,
}): Array<String> => {
  /**
   * data is passed from pops OR a view fetched from the server
   * so need to filter to data with coordinates first...
   */
  // make sure all tpops used have coordinates
  let tpopsToUse = data.filter(p => {
    if (!p.id && !p.tpopId && !p.tpop_id) return false
    if (p.x && isFinite(p.x) && p.y && isFinite(p.y)) return true
    if (
      p.tpopX && isFinite(p.tpopX) &&
      p.tpopY && isFinite(p.tpopY)
    )
      return true
    if (
      p.tpop_x && isFinite(p.tpop_x) &&
      p.tpop_y && isFinite(p.tpop_y)
    )
      return true
    return false
  })
  // ...and account for user friendly field names in views
  tpopsToUse = tpopsToUse.map(p => {
    if (p.tpopX && p.tpopY) {
      p.x = p.tpopX
      p.y = p.tpopY
    }
    if (p.tpop_x && p.tpop_y) {
      p.x = p.tpop_x
      p.y = p.tpop_y
    }
    return p
  })
  // build an array of geoJson points
  const features = tpopsToUse.map(t => ({
    type: 'Feature',
    properties: {
      id: t.id || t.tpopId || t.tpop_id,
    },
    geometry: {
      type: 'Point',
      // convert koordinates to wgs84
      coordinates: epsg2056to4326(t.x, t.y),
    },
  }))
  const points = {
    type: 'FeatureCollection',
    features,
  }

  // let turf check what points are within filter
  const result = within(points, mapFilter)

  return result.features.map(r => r.properties.id)
}
