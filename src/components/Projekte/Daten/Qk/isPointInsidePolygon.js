// @flow
import booleanPointInPolygon from '@turf/boolean-point-in-polygon'

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
  // let turf check if the point is in zh
  return booleanPointInPolygon(koordPt, polygon)
}
