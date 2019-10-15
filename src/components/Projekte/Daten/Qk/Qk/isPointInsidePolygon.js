import booleanPointInPolygon from '@turf/boolean-point-in-polygon'

export default (polygon, lat, long) => {
  // build a geoJson point
  const koordPt = {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [long, lat],
    },
  }
  // let turf check if the point is in zh
  return booleanPointInPolygon(koordPt, polygon)
}
