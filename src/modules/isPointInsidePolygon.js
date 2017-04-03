// @flow
import inside from '@turf/inside'

import epsg21781to4326 from './epsg21781to4326'

export default (
  polygon: {type:string,properties:Object,geometry:{type:string,coordinates:Array<any>}},
  x:number,
  y:number
) => {

  // convert koordinates to wgs84
  const koordWgs84 = epsg21781to4326(x, y)

  // build a geoJson point
  const koordPt = {
    type: `Feature`,
    geometry: {
      type: `Point`,
      coordinates: koordWgs84,
    },
  }

  // let turf check if the point is in zh
  return inside(koordPt, polygon)
}
