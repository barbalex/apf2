import inside from '@turf/inside'
import proj4 from 'proj4'
proj4.defs(`EPSG:21781`, `+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 +x_0=600000 +y_0=200000 +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs`)
proj4.defs(`EPSG:2056`, `+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 +x_0=2600000 +y_0=1200000 +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs`)
proj4.defs(`EPSG:4326`, `+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs`)

export default (polygon, x, y) => {
  const koordLv03 = [x, y]

  // convert koordinates to wgs84
  const koordWgs84 = proj4(
    `EPSG:21781`,
    `EPSG:4326`,
    koordLv03
  )
  // const koordWgs84 = `nothing`

  // convert coordinates into a geoJson point
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
