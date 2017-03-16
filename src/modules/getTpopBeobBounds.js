export default (store) => {
  const { beobs } = store.map.tpopBeob
  if (beobs.length === 0) return null
  const xKoords = beobs.map(p => p.KoordWgs84[0])
  const yKoords = beobs.map(p => p.KoordWgs84[1])
  const maxX = Math.max(...xKoords)
  const minX = Math.min(...xKoords)
  const maxY = Math.max(...yKoords)
  const minY = Math.min(...yKoords)
  return [[minX, minY], [maxX, maxY]]
}
