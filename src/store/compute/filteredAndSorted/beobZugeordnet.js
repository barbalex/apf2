import sortBy from 'lodash/sortBy'
import format from 'date-fns/format'

export default (store: Object, tree: Object): Array<Object> => {
  const { table } = store
  const { nodeLabelFilter } = tree
  // grab beob as array and sort them by year
  let beob = Array.from(table.beob.values()).filter(
    b => !b.nicht_zuordnen && b.tpop_id
  )
  // map through all and create array of nodes
  beob.forEach(el => {
    let datum = ''
    let autor = ''
    let quelle = ''
    let quelleName = ''
    if (el.datum) {
      datum = format(el.datum, 'YYYY.MM.DD')
    }
    if (el.autor) {
      autor = el.autor
    }
    if (el.quelle_id) {
      quelle = table.beob_quelle.get(el.quelle_id)
      quelleName = quelle && quelle.name ? quelle.name : ''
    }
    el.label = `${datum || '(kein Datum)'}: ${autor ||
      '(kein Autor)'} (${quelleName})`
  })
  // filter by nodeLabelFilter
  const filterString = nodeLabelFilter.get('beobZugeordnet')
  if (filterString) {
    beob = beob.filter(p =>
      p.label.toLowerCase().includes(filterString.toLowerCase())
    )
  }
  // sort by label and return
  return sortBy(beob, 'label').reverse()
}
