// @flow
import proj4 from 'proj4'
proj4.defs(`EPSG:21781`, `+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 +x_0=600000 +y_0=200000 +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs`)
proj4.defs(`EPSG:4326`, `+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs`)

export default (x: number, y: number) => {
  if (x && y) {
    // no idea why but values have to be reversed
    return proj4(
      `EPSG:21781`,
      `EPSG:4326`,
      [x, y]
    ).reverse()
  }
  return null
}
