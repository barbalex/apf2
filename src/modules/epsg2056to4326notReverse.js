import proj4 from 'proj4'
proj4.defs(
  'EPSG:2056',
  '+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 +x_0=2600000 +y_0=1200000 +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs',
)
proj4.defs('EPSG:4326', '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs')

const epsg2056to4326notReverse = (x, y) =>
  proj4('EPSG:2056', 'EPSG:4326', [+x, +y])

export default epsg2056to4326notReverse
