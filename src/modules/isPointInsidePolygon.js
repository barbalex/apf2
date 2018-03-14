// @flow
/**
 * turf between v4.2.0 and v4.7.3 creates an error:
 * 'coordinates must only contain numbers'
 * see: https://github.com/Turfjs/turf/issues/940
 */
import inside from '@turf/inside'

import epsg2056to4326 from './epsg2056to4326notReverse'

export default (
  polygon: {
    type: string,
    properties: Object,
    geometry: { type: string, coordinates: Array<any> },
  },
  x: number,
  y: number
): boolean => {
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

  // let turf check if the point is in zh
  return inside(koordPt, polygon)
}
