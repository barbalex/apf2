// @flow
import within from '@turf/within'
import isFinite from 'lodash/isFinite'
//import { toJS } from 'mobx'

import epsg21781to4326 from './epsg21781to4326notReverse'
/*
;(function(console) {
  console.save = function(data, filename) {
    if (!data) {
      console.error('Console.save: No data')
      return
    }

    if (!filename) filename = 'console.json'

    if (typeof data === 'object') {
      data = JSON.stringify(data, undefined, 4)
    }

    var blob = new Blob([data], { type: 'text/json' }),
      e = document.createEvent('MouseEvents'),
      a = document.createElement('a')

    a.download = filename
    a.href = window.URL.createObjectURL(blob)
    a.dataset.downloadurl = ['text/json', a.download, a.href].join(':')
    e.initMouseEvent(
      'click',
      true,
      false,
      window,
      0,
      0,
      0,
      0,
      0,
      false,
      false,
      false,
      false,
      0,
      null
    )
    a.dispatchEvent(e)
  }
})(console)
*/
export default (store: Object, tpops: Array<Object>): Array<number> => {
  /**
   * data is passed from map.pop.pops OR a view fetched from the server
   * so need to filter to data with coordinates first...
   */
  let tpopsToUse = tpops.filter(p => {
    if (!p.TPopId) return false
    if (
      p.TPopXKoord &&
      isFinite(p.TPopXKoord) &&
      p.TPopYKoord &&
      isFinite(p.TPopYKoord)
    )
      return true
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
      p.TPopXKoord = p['TPop X-Koordinaten']
      p.TPopYKoord = p['TPop Y-Koordinaten']
    }
    return p
  })
  // build an array of geoJson points
  const features = tpopsToUse.map(t => ({
    type: 'Feature',
    properties: {
      TPopId: t.TPopId,
    },
    geometry: {
      type: 'Point',
      // convert koordinates to wgs84
      coordinates: epsg21781to4326(t.TPopXKoord, t.TPopYKoord),
    },
  }))
  const points = {
    type: 'FeatureCollection',
    features,
  }

  //console.save(toJS(points), 'points.json')
  //console.save(toJS(store.map.mapFilter.filter), 'filter.json')

  // let turf check what points are within filter
  const result = within(points, store.map.mapFilter.filter)

  return result.features.map(r => r.properties.TPopId)
}
