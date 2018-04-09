import sortBy from 'lodash/sortBy'

export default (store: Object, tree: Object): Array<Object> => {
  const { table } = store
  const { nodeLabelFilter } = tree
  // grab tpopmassn as array and sort them by year
  let tpopmassn = Array.from(table.tpopmassn.values())
  // get erfkritWerte
  const tpopmassntypWerte = Array.from(table.tpopmassn_typ_werte.values())
  // map through all projekt and create array of nodes
  tpopmassn.forEach(el => {
    const tpopmassntypWert = tpopmassntypWerte.find(e => e.code === el.typ)
    const massnTypTxt = tpopmassntypWert ? tpopmassntypWert.text : null
    el.label = `${el.jahr || '(kein Jahr)'}: ${massnTypTxt || '(kein Typ)'}`
  })
  // filter by nodeLabelFilter
  const filterString = nodeLabelFilter.get('tpopmassn')
  if (filterString) {
    tpopmassn = tpopmassn.filter(p =>
      p.label.toLowerCase().includes(filterString.toLowerCase())
    )
  }
  // sort by label and return
  return sortBy(tpopmassn, 'label')
}
