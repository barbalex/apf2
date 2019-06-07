import bufferBoundsTo50m from './bufferBoundsTo50m'

export default os => {
  if (os.length === 0) return []
  const xKoords = os.map(p => p.wgs84Lat)
  const yKoords = os.map(p => p.wgs84Long)
  const maxX = Math.max(...xKoords)
  const minX = Math.min(...xKoords)
  const maxY = Math.max(...yKoords)
  const minY = Math.min(...yKoords)
  const bounds = [[minX, minY], [maxX, maxY]]
  // if one single point: buffer
  return bufferBoundsTo50m(bounds)
}
