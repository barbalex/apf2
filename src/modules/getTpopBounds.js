export default (tpops) => {
  const xKoords = tpops.map(p => p.TPopKoordWgs84[0])
  const yKoords = tpops.map(p => p.TPopKoordWgs84[1])
  const maxX = Math.max(...xKoords)
  const minX = Math.min(...xKoords)
  const maxY = Math.max(...yKoords)
  const minY = Math.min(...yKoords)
  return [[minX, minY], [maxX, maxY]]
}
