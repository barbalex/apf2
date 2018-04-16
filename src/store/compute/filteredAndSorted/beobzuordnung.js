import sortBy from 'lodash/sortBy'
import format from 'date-fns/format'

export default (store: Object, tree: Object): Array<Object> => {
  const { table } = store
  const { nodeLabelFilter, apFilter } = tree
  // grab beob as array and sort them by year
  let beobNichtBeurteilt = Array.from(table.beob.values())
    // filter by apFilter
    .filter(beob => {
      if (!apFilter) return true
      const ap = table.ap.get(beob.art_id)
      if (ap) return [1, 2, 3].includes(ap.bearbeitung)
      return false
    })
    // fetch only those without tpopbeob
    .filter(beob => {
      const tpopbeob = Array.from(store.table.tpopbeob.values()).filter(
        v => v.beob_id === beob.id
      )
      return !tpopbeob || (!tpopbeob.nicht_zuordnen && !tpopbeob.beob_id)
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
