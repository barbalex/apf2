// @flow
import within from '@turf/within'
import isFinite from 'lodash/isFinite'
import { toJS } from 'mobx'

import epsg2056to4326 from './epsg2056to4326notReverse'

export default (store: Object, pops: Array<Object>): Array<number> => {
  /**
   * data is passed from map.pop.pops OR a view fetched from the server
   * so need to filter to data with coordinates first...
   */
  // make sure all pops used have coordinates
  let popsToUse = pops.filter(p => {
    if (!p.id) return false
    if (p.x && isFinite(p.x) && p.y && isFinite(p.y)) return true
    if (
      p['Pop X-Koordinaten'] &&
      isFinite(p['Pop X-Koordinaten']) &&
      p['Pop Y-Koordinaten'] &&
      isFinite(p['Pop Y-Koordinaten'])
    )
      return true
    return false
  })
  // ...and account for user friendly field names in views
  popsToUse = popsToUse.map(p => {
    if (p['Pop X-Koordinaten'] && p['Pop Y-Koordinaten']) {
      p.x = p['Pop X-Koordinaten']
      p.y = p['Pop Y-Koordinaten']
    }
    return p
  })
  const points = {
    type: 'FeatureCollection',
    // build an array of geoJson points
    features: popsToUse.map(p => ({
      type: 'Feature',
      properties: {
        id: p.id,
      },
      geometry: {
        type: 'Point',
        // convert koordinates to wgs84
        coordinates: epsg2056to4326(p.x, p.y),
      },
    })),
  }
  /**
   * within creates error
   * Uncaught Error: coordinates must only contain numbers
   * checked everything and it all seems correct :-(
   */
  /*
  const checkCoordinates = points.features.map(x => x.geometry.coordinates)
  console.log('coordinates:', checkCoordinates)
  const isNumberCoordinates = checkCoordinates.map(x => [
    x.length > 1,
    typeof x[0] === 'number',
    typeof x[1] === 'number',
  ])*/
  //console.log('isNumberCoordinates:', isNumberCoordinates)
  //console.log('filter:', filter)

  // let turf check what points are within filter
  const result = within(toJS(points), toJS(store.map.mapFilter.filter))

  return result.features.map(r => r.properties.id)
}
