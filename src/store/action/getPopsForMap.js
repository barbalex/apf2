// @flow
import epsg2056to4326 from '../../modules/epsg2056to4326'

export default (store: Object): Array<Object> => {
  const { table, tree } = store
  const myApArtId = tree.activeNodes.ap || store.map.pop.apId
  // get pops of this ap
  let pops = Array.from(table.pop.values())
    .filter(p => p.ap_id === myApArtId)
    // omit pops without coordinates
    .filter(p => p.PopXKoord && p.PopYKoord)
  // filter them by nodeLabelFilter
  const popFilterString = tree.nodeLabelFilter.get('pop')
  if (popFilterString) {
    pops = pops.filter(p => {
      const label = `${p.nr || '(keine Nr)'}: ${p.name || '(kein Name)'}`
      return label.toLowerCase().includes(popFilterString.toLowerCase())
    })
  }

  pops = pops.map(p => {
    p.PopKoordWgs84 = epsg2056to4326(p.PopXKoord, p.PopYKoord)
    return p
  })
  return pops
}
