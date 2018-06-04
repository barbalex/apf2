// @flow
import 'leaflet'

import epsg2056to4326 from '../../modules/epsg2056to4326'

export default (tpopsPassed: Array<Object>): Array<Array<number>> => {
  const tpops = tpopsPassed.filter(t => !!t.x && !!t.y)
  if (tpops.length === 0) return []
  const xKoords = tpops.map(t => epsg2056to4326(t.x, t.y)[0])
  const yKoords = tpops.map(t => epsg2056to4326(t.x, t.y)[1])
  const maxX = Math.max(...xKoords)
  const minX = Math.min(...xKoords)
  const maxY = Math.max(...yKoords)
  const minY = Math.min(...yKoords)
  return [[minX, minY], [maxX, maxY]]
}
