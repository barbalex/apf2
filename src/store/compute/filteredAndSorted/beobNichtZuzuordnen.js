import sortBy from 'lodash/sortBy'
import format from 'date-fns/format'

export default (store: Object, tree: Object): Array<Object> => {
  const { table } = store
  const { nodeLabelFilter, apFilter } = tree
  // grab beobNichtZuzuordnen as array and sort them by year
  let beobNichtZuzuordnen = Array.from(table.tpopbeob.values())
    .filter(b => b.nicht_zuordnen === 1)
    // filter by apFilter
    .filter(b => {
      if (!apFilter) {
        return true
      }
      let ap
      const beob = table.beob.get(b.beob_id)
      if (beob) {
        ap = table.ap.get(beob.art_id)
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
    const beob = table.beob.get(el.beob_id)
    if (beob) {
      if (beob.datum) {
        datum = format(beob.Datum, 'YYYY.MM.DD')
      }
      if (beob.autor) {
        autor = beob.autor
      }
    }
    const quelle = table.beob_quelle.get(el.QuelleId)
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
