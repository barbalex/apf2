import pointsWithinPolygon from '@turf/points-within-polygon'
import { featureCollection, point, polygon } from '@turf/helpers'
import bboxPolygon from '@turf/bbox-polygon'

export default ({ map, data, idKey = 'id', xKey = 'x', yKey = 'y' }) => {
  const bounds = map.getBounds()
  /**
   * data is passed from map.pop.pops OR a view fetched from the server
   * so need to filter to data with coordinates first...
   * data arrives only if idKey, xKey and yKey exist
   */
  let dataToUse = data
    // make sure all rows used have id...
    .filter(p => !!p[idKey])
    // ...and coordinates
    .filter(p => p.wgs84Lat)

  const dataPoints = featureCollection(
    dataToUse.map(t =>
      point([t.wgs84Lat, t.wgs84Long], {
        id: t[idKey],
      }),
    ),
  )

  const boundsArray = [
    bounds.getWest(),
    bounds.getSouth(),
    bounds.getEast(),
    bounds.getNorth(),
  ]
  const myBboxPolygon = bboxPolygon(boundsArray)
  const polygonArray = myBboxPolygon.geometry.coordinates
  const searchWithin = polygon(polygonArray)

  // let turf check what points are within filter
  const result = pointsWithinPolygon(dataPoints, searchWithin)
  const idsWithinPolygon = result.features.map(r => r.properties.id)

  return data.filter(d => idsWithinPolygon.includes(d.id))
}
