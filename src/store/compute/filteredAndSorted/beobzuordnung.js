import sortBy from 'lodash/sortBy'
import format from 'date-fns/format'

export default (store: Object, tree: Object): Array<Object> => {
  const { table } = store
  const { nodeLabelFilter, apFilter } = tree
  const tpopbeobs = Array.from(store.table.tpopbeob.values())
  const beobs = Array.from(table.beob.values())
  const aps = Array.from(table.ap.values())
  // grab beob as array and sort them by year
  let beobNichtBeurteilt = beobs
    // filter by apFilter if exists
    .filter(beob => {
      if (!apFilter) return true
      const ap = aps.filter(ap => ap.art === beob.art_id)
      if (ap) return [1, 2, 3].includes(ap.bearbeitung)
      return false
    })
    // fetch only those without tpopbeob
    .filter(beob => {
      // we dont want beob that have tpopbeob that are
      // nicht_zuordnen or zugeordnet
      const tpopbeob = tpopbeobs.filter(
        v => v.beob_id === beob.id && (v.nicht_zuordnen || v.tpop_id)
      )
      return tpopbeob.length === 0
    })

  beobNichtBeurteilt.forEach(el => {
    const quelle = table.beob_quelle.get(el.quelle_id)
    const quelleName = quelle && quelle.name ? quelle.name : ''
    const datum = el.datum ? format(el.datum, 'YYYY.MM.DD') : '(kein Datum)'
    el.label = `${datum}: ${el.autor || '(kein Autor)'} (${quelleName})`
  })
  // filter by nodeLabelFilter
  const filterString = nodeLabelFilter.get('beobzuordnung')
  if (filterString) {
    beobNichtBeurteilt = beobNichtBeurteilt.filter(p =>
      p.label.toLowerCase().includes(filterString.toLowerCase())
    )
  }
  // sort by label and return
  return sortBy(beobNichtBeurteilt, 'label').reverse()
}
