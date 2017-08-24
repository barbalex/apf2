// @flow
import within from '@turf/within'
import { toJS } from 'mobx'

import epsg21781to4326 from './epsg21781to4326notReverse'

export default (store: Object, pops: Array<Object>): Array<number> => {
  /**
   * data is passed from map.pop.pops OR a view fetched from the server
   * so need to filter to data with coordinates first...
   */
  let popsToUse = pops.filter(p => {
    if (!p.PopId) return false
    if (p.PopXKoord && p.PopYKoord) return true
    if (p['Pop X-Koordinaten'] && p['Pop Y-Koordinaten']) return true
    return false
  })
  // ...and account for user friendly field names in views
  popsToUse = popsToUse.map(p => {
    if (p['Pop X-Koordinaten'] && p['Pop Y-Koordinaten']) {
      p.PopXKoord = p['Pop X-Koordinaten']
      p.PopYKoord = p['Pop Y-Koordinaten']
    }
    return p
  })
  const points = {
    type: 'FeatureCollection',
    // build an array of geoJson points
    features: popsToUse.map(p => ({
      type: 'Feature',
      properties: {
        PopId: p.PopId,
      },
      geometry: {
        type: 'Point',
        // convert koordinates to wgs84
        coordinates: epsg21781to4326(p.PopXKoord, p.PopYKoord),
      },
    })),
  }
  /**
   * within creates error
   * Uncaught Error: coordinates must only contain numbers
   * checked everything and it all seems correct :-(
   */
  const checkCoordinates = points.features.map(x => x.geometry.coordinates)
  console.log('coordinates:', checkCoordinates)
  const isNumberCoordinates = checkCoordinates.map(x => [
    x.length > 1,
    typeof x[0] === 'number',
    typeof x[1] === 'number',
  ])
  console.log('isNumberCoordinates:', isNumberCoordinates)
  const filter = toJS(store.map.mapFilter.filter)
  console.log('filter:', filter)

  // let turf check what points are within filter
  const result = within(points, filter)

  return result.features.map(r => r.properties.PopId)
}
