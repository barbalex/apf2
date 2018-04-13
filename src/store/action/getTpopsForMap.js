// @flow
import epsg2056to4326 from '../../modules/epsg2056to4326'

export default (store: Object): Array<Object> => {
  const { table, tree } = store
  const myApArtId = tree.activeNodes.ap || store.map.pop.apArtId
  // get pops of this ap
  const popsOfActiveAp = Array.from(table.pop.values()).filter(
    p => p.ApArtId === myApArtId
  )
  const popIdsOfActiveAp = popsOfActiveAp.map(p => p.PopId)
  // get tpops of this ap
  let tpops = Array.from(table.tpop.values())
    .filter(p => popIdsOfActiveAp.includes(p.pop_id))
    // omit tpops without coordinates
    .filter(p => p.TPopXKoord && p.TPopYKoord)
  // filter them by nodeLabelFilter
  const tpopFilterString = tree.nodeLabelFilter.get('tpop')
  if (tpopFilterString) {
    tpops = tpops.filter(p => {
      const label = `${p.nr || '(keine Nr)'}: ${p.TPopFlurname ||
        '(kein Flurname)'}`
      return label.toLowerCase().includes(tpopFilterString.toLowerCase())
    })
  }
  tpops = tpops.map(p => {
    p.TPopKoordWgs84 = epsg2056to4326(p.TPopXKoord, p.TPopYKoord)
    return p
  })
  return tpops
}
