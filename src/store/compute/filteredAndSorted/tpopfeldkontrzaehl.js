import sortBy from 'lodash/sortBy'

export default (store: Object, tree: Object): Object => {
  const { table } = store
  const { nodeLabelFilter } = tree
  // grab tpopkontrzaehl as array
  let tpopkontrzaehl = Array.from(table.tpopkontrzaehl.values())

  // get zaehleinheitWerte
  const zaehleinheitWerte = Array.from(
    table.tpopkontrzaehl_einheit_werte.values(),
  )
  const methodeWerte = Array.from(table.tpopkontrzaehl_methode_werte.values())

  tpopkontrzaehl.forEach(el => {
    const zaehleinheitWert = zaehleinheitWerte.find(
      e => e.ZaehleinheitCode === el.Zaehleinheit,
    )
    const zaehleinheitTxt = zaehleinheitWert
      ? zaehleinheitWert.ZaehleinheitTxt
      : null
    const methodeWert = methodeWerte.find(e => e.BeurteilCode === el.Methode)
    const methodeTxt = methodeWert ? methodeWert.BeurteilTxt : null
    const anzahl = el.Anzahl || el.Anzahl === 0 ? el.Anzahl : '(keine Anzahl)'
    el.label = `${anzahl} ${zaehleinheitTxt || `(keine Einheit)`} (${methodeTxt || `keine Methode`})`
  })
  // filter by nodeLabelFilter
  const filterString = nodeLabelFilter.get(`tpopkontrzaehl`)
  if (filterString) {
    tpopkontrzaehl = tpopkontrzaehl.filter(p =>
      p.label.toLowerCase().includes(filterString.toLowerCase()),
    )
  }
  // sort by label and return
  return sortBy(tpopkontrzaehl, `label`)
}
