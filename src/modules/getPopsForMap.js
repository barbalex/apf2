// @flow
import epsg21781to4326 from './epsg21781to4326'

export default (store:Object) => {
  const { table, activeUrlElements, node } = store
  // get pops of this ap
  let pops = Array.from(table.pop.values())
    .filter(p => p.ApArtId === activeUrlElements.ap)
    // omit pops without coordinates
    .filter(p => p.PopXKoord && p.PopYKoord)
  // filter them by nodeLabelFilter
  const popFilterString = node.nodeLabelFilter.get(`pop`)
  if (popFilterString) {
    pops = pops.filter((p) => {
      const label = `${p.PopNr || `(keine Nr)`}: ${p.PopName || `(kein Name)`}`
      return label.toLowerCase().includes(popFilterString.toLowerCase())
    })
  }
  pops = pops.map((p) => {
    p.PopKoordWgs84 = epsg21781to4326(p.PopXKoord, p.PopYKoord)
    return p
  })
  return pops
}
