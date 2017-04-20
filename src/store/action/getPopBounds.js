// @flow
export default (popsPassed: Array<Object>): Array<Array<number>> => {
  const pops = popsPassed.filter(t => !!t.PopKoordWgs84)
  if (pops.length === 0) return []
  const xKoords = pops.map(p => p.PopKoordWgs84[0])
  const yKoords = pops.map(p => p.PopKoordWgs84[1])
  const maxX = Math.max(...xKoords)
  const minX = Math.min(...xKoords)
  const maxY = Math.max(...yKoords)
  const minY = Math.min(...yKoords)
  return [[minX, minY], [maxX, maxY]]
}
