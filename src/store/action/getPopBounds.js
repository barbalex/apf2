// @flow
import 'leaflet'

import epsg2056to4326 from '../../modules/epsg2056to4326'

export default (os: Array<Object>): Array<Array<number>> => {
  if (os.length === 0) return []
  const xKoords = os.map(p => epsg2056to4326(p.x, p.y)[0])
  const yKoords = os.map(p => epsg2056to4326(p.x, p.y)[1])
  const maxX = Math.max(...xKoords)
  const minX = Math.min(...xKoords)
  const maxY = Math.max(...yKoords)
  const minY = Math.min(...yKoords)
  return [[minX, minY], [maxX, maxY]]
}
