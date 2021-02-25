import booleanPointInPolygon from '@turf/boolean-point-in-polygon'

const isPointInsidePolygon = (polygon, lat, long) => {
  // build a geoJson point
  const koordPt = {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [long, lat],
      // need to add crs otherwise PostGIS v2.5 (on server) errors
      crs: {
        type: 'name',
        properties: {
          name: 'urn:ogc:def:crs:EPSG::4326',
        },
      },
    },
  }
  // let turf check if the point is in zh
  return booleanPointInPolygon(koordPt, polygon)
}

export default isPointInsidePolygon
