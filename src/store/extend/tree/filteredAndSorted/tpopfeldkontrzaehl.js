import sortBy from 'lodash/sortBy'

export default (store) => {
  const { table, tree } = store
  const { activeNodes, nodeLabelFilter } = tree
  // grab tpopkontrzaehl as array
  let tpopkontrzaehl = Array.from(table.tpopkontrzaehl.values())
  // show only nodes of active tpopkontr
  tpopkontrzaehl = tpopkontrzaehl.filter(a => a.TPopKontrId === activeNodes.tpopfeldkontr)

  // get zaehleinheitWerte
  const zaehleinheitWerte = Array.from(table.tpopkontrzaehl_einheit_werte.values())
  const methodeWerte = Array.from(table.tpopkontrzaehl_methode_werte.values())

  tpopkontrzaehl.forEach((el) => {
    const zaehleinheitWert = zaehleinheitWerte.find(e => e.ZaehleinheitCode === el.Zaehleinheit)
    const zaehleinheitTxt = zaehleinheitWert ? zaehleinheitWert.ZaehleinheitTxt : null
    const methodeWert = methodeWerte.find(e => e.BeurteilCode === el.Methode)
    const methodeTxt = methodeWert ? methodeWert.BeurteilTxt : null
    el.label = `${el.Anzahl || `(keine Anzahl)`} ${zaehleinheitTxt || `(keine Einheit)`} (${methodeTxt || `keine Methode`})`
  })
  // filter by nodeLabelFilter
  const filterString = nodeLabelFilter.get(`tpopkontrzaehl`)
  if (filterString) {
    tpopkontrzaehl = tpopkontrzaehl.filter(p =>
      p.label.toLowerCase().includes(filterString.toLowerCase())
    )
  }
  // sort by label and return
  return sortBy(tpopkontrzaehl, `label`)
}
