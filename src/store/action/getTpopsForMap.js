// @flow
import epsg2056to4326 from '../../modules/epsg2056to4326'

export default (store: Object): Array<Object> => {
  const { table, tree } = store
  const myApArtId = tree.activeNodes.ap || store.map.pop.apId
  // get pops of this ap
  const popsOfActiveAp = Array.from(table.pop.values()).filter(
    p => p.ap_id === myApArtId
  )
  const popIdsOfActiveAp = popsOfActiveAp.map(p => p.id)
  // get tpops of this ap
  let tpops = Array.from(table.tpop.values())
    .filter(p => popIdsOfActiveAp.includes(p.pop_id))
    // omit tpops without coordinates
    .filter(p => p.x && p.y)
  // filter them by nodeLabelFilter
  const tpopFilterString = tree.nodeLabelFilter.get('tpop')
  if (tpopFilterString) {
    tpops = tpops.filter(p => {
      const label = `${p.nr || '(keine Nr)'}: ${p.flurname ||
        '(kein Flurname)'}`
      return label.toLowerCase().includes(tpopFilterString.toLowerCase())
    })
  }
  tpops = tpops.map(p => {
    p.TPopKoordWgs84 = epsg2056to4326(p.x, p.y)
    return p
  })
  return tpops
}
