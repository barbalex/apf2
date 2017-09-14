import sortBy from 'lodash/sortBy'
import format from 'date-fns/format'

export default (store: Object, tree: Object): Array<Object> => {
  const { table } = store
  const { nodeLabelFilter } = tree
  // grab tpopbeob as array and sort them by year
  let tpopbeob = Array.from(table.beobzuordnung.values()).filter(
    b => !b.BeobNichtZuordnen && b.TPopId
  )
  // map through all and create array of nodes
  tpopbeob.forEach(el => {
    let datum = ''
    let autor = ''
    const beob = table.beob.get(el.BeobId)
    if (beob) {
      if (beob.Datum) {
        datum = format(beob.Datum, 'YYYY.MM.DD')
      }
      if (beob.Autor) {
        autor = beob.Autor
      }
    }
    const quelle = table.beob_quelle.get(el.QuelleId)
    const quelleName = quelle && quelle.name ? quelle.name : ''
    el.label = `${datum || '(kein Datum)'}: ${autor ||
      '(kein Autor)'} (${quelleName})`
  })
  // filter by nodeLabelFilter
  const filterString = nodeLabelFilter.get('tpopbeob')
  if (filterString) {
    tpopbeob = tpopbeob.filter(p =>
      p.label.toLowerCase().includes(filterString.toLowerCase())
    )
  }
  // sort by label and return
  return sortBy(tpopbeob, 'label').reverse()
}
