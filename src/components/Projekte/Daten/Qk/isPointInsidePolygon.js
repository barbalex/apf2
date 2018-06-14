// @flow
/**
 * turf between v4.2.0 and v4.7.3 creates an error:
 * 'coordinates must only contain numbers'
 * see: https://github.com/Turfjs/turf/issues/940
 */
import inside from '@turf/inside'

import epsg2056to4326 from '../../../../modules/epsg2056to4326notReverse'

export default (
  polygon: {
    type: string,
    properties: Object,
    geometry: { type: String, coordinates: Array<Any> },
  },
  x: Number,
  y: Number,
): Boolean => {
  // convert koordinates to wgs84
  const koordWgs84 = epsg2056to4326(x, y)

  // build a geoJson point
  const koordPt = {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: koordWgs84,
    },
  }
  //console.log('isPointInsidePolygon:', {koordPt,polygon})
  // let turf check if the point is in zh
  return inside(koordPt, polygon)
}
