import sortBy from 'lodash/sortBy'
import format from 'date-fns/format'

export default (store: Object, tree: Object): Array<Object> => {
  const { table } = store
  const { nodeLabelFilter, apFilter } = tree
  // grab beobNichtZuzuordnen as array and sort them by year
  const aps = Array.from(table.ap.values())
  const beob = Array.from(table.beob.values())
  let beobNichtZuzuordnen = beob
    .filter(b => b.nicht_zuordnen)
    // filter by apFilter
    .filter(b => {
      if (!apFilter) return true
      let ap
      if (b) {
        ap = aps.find(v => v.art === b.art_id)
      }
      if (ap && ap.bearbeitung) {
        return [1, 2, 3].includes(ap.bearbeitung)
      }
      return true
    })

  // add label
  beobNichtZuzuordnen.forEach(el => {
    let datum = ''
    let autor = ''
    let quelle
    if (el.datum) {
      datum = format(el.datum, 'YYYY.MM.DD')
    }
    if (el.autor) {
      autor = el.autor
    }
    quelle = table.beob_quelle.get(el.quelle_id)
    const quelleName = quelle && quelle.name ? quelle.name : ''
    el.label = `${datum || '(kein Datum)'}: ${autor ||
      '(kein Autor)'} (${quelleName})`
  })
  // filter by nodeLabelFilter
  const filterString = nodeLabelFilter.get('beobNichtZuzuordnen')
  if (filterString) {
    beobNichtZuzuordnen = beobNichtZuzuordnen.filter(p =>
      p.label.toLowerCase().includes(filterString.toLowerCase())
    )
  }
  // sort by label
  beobNichtZuzuordnen = sortBy(beobNichtZuzuordnen, 'label').reverse()
  return beobNichtZuzuordnen
}
