import epsg2056to4326 from './epsg2056to4326'
import bufferBoundsTo50m from './bufferBoundsTo50m'

export default os => {
  if (os.length === 0) return []
  const xKoords = os.map(p => epsg2056to4326(p.x, p.y)[0])
  const yKoords = os.map(p => epsg2056to4326(p.x, p.y)[1])
  const maxX = Math.max(...xKoords)
  const minX = Math.min(...xKoords)
  const maxY = Math.max(...yKoords)
  const minY = Math.min(...yKoords)
  const bounds = [[minX, minY], [maxX, maxY]]
  // if one single point: buffer
  return bufferBoundsTo50m(bounds)
}
