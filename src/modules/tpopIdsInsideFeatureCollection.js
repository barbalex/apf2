// @flow
import within from '@turf/within'
import isFinite from 'lodash/isFinite'
import { toJS } from 'mobx'

import epsg2056to4326 from './epsg2056to4326notReverse'

export default (store: Object, tpops: Array<Object>): Array<number> => {
  /**
   * data is passed from pops OR a view fetched from the server
   * so need to filter to data with coordinates first...
   */
  // make sure all tpops used have coordinates
  let tpopsToUse = tpops.filter(p => {
    if (!p.id) return false
    if (p.x && isFinite(p.x) && p.y && isFinite(p.y)) return true
    if (
      p['TPop X-Koordinaten'] &&
      isFinite(p['TPop X-Koordinaten']) &&
      p['TPop Y-Koordinaten'] &&
      isFinite(p['TPop Y-Koordinaten'])
    )
      return true
    return false
  })
  // ...and account for user friendly field names in views
  tpopsToUse = tpopsToUse.map(p => {
    if (p['TPop X-Koordinaten'] && p['TPop Y-Koordinaten']) {
      p.x = p['TPop X-Koordinaten']
      p.y = p['TPop Y-Koordinaten']
    }
    return p
  })
  // build an array of geoJson points
  const features = tpopsToUse.map(t => ({
    type: 'Feature',
    properties: {
      id: t.id,
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
  const result = within(toJS(points), toJS(store.map.mapFilter.filter))

  return result.features.map(r => r.properties.id)
}
