import pointsWithinPolygon from '@turf/points-within-polygon'

export default ({
  mapFilter,
  data,
  idKey = 'id',
  xKey = 'wgs84Lat',
  yKey = 'wgs84Long',
}) => {
  /**
   * data is passed from map.pop.pops OR a view fetched from the server
   * so need to filter to data with coordinates first...
   * data arrives only if idKey, xKey and yKey exist
   */
  let dataToUse = data
    // make sure all rows used have id...
    .filter(p => !!p[idKey])
    // ...and coordinates
    .filter(p => p[xKey])
  const points = {
    type: 'FeatureCollection',
    // build an array of geoJson points
    features: dataToUse.map(p => ({
      type: 'Feature',
      properties: {
        id: p[idKey],
      },
      geometry: {
        type: 'Point',
        // convert koordinates to wgs84
        coordinates: [p[xKey], p[yKey]],
        crs: {
          type: 'name',
          properties: {
            name: 'urn:ogc:def:crs:EPSG::4326',
          },
        },
      },
    })),
  }

  // let turf check what points are within filter
  const result = pointsWithinPolygon(points, mapFilter)

  return result.features.map(r => r.properties.id)
}
