export default (store) => {
  const { idOfTpopBeingLocalized, tpops: tpopsOnMap } = store.map.tpop
  if (idOfTpopBeingLocalized) {
    const tpopBeingLocalized = store.table.tpop.get(idOfTpopBeingLocalized)
    if (tpopBeingLocalized.TPopKoordWgs84) {
      const x = tpopBeingLocalized.TPopKoordWgs84[0]
      const y = tpopBeingLocalized.TPopKoordWgs84[1]
      return [[x - 0.001, y - 0.001], [x + 0.001, y + 0.001]]
    }
  }
  const tpops = tpopsOnMap.filter(t => !!t.TPopKoordWgs84)
  if (tpops.length === 0) return null
  const xKoords = tpops.map(p => p.TPopKoordWgs84[0])
  const yKoords = tpops.map(p => p.TPopKoordWgs84[1])
  const maxX = Math.max(...xKoords)
  const minX = Math.min(...xKoords)
  const maxY = Math.max(...yKoords)
  const minY = Math.min(...yKoords)
  return [[minX, minY], [maxX, maxY]]
}
