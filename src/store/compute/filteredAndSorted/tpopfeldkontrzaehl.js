export default (store: Object, tree: Object): Array<Object> => {
  const { table } = store
  const { nodeLabelFilter } = tree
  // grab tpopkontrzaehl as array
  let tpopkontrzaehl = Array.from(table.tpopkontrzaehl.values())

  // get zaehleinheitWerte
  const zaehleinheitWerte = Array.from(
    table.tpopkontrzaehl_einheit_werte.values()
  )
  const methodeWerte = Array.from(table.tpopkontrzaehl_methode_werte.values())

  tpopkontrzaehl.forEach(el => {
    const zaehleinheitWert = zaehleinheitWerte.find(
      e => e.ZaehleinheitCode === el.einheit
    )
    const zaehleinheitTxt = zaehleinheitWert
      ? zaehleinheitWert.ZaehleinheitTxt
      : null
    const methodeWert = methodeWerte.find(e => e.BeurteilCode === el.methode)
    const methodeTxt = methodeWert ? methodeWert.BeurteilTxt : null
    const anzahl = el.anzahl || el.anzahl === 0 ? el.anzahl : '(keine Anzahl)'
    el.label = `${zaehleinheitTxt ||
      '(keine Einheit)'}: ${anzahl} ${methodeTxt || '(keine Methode)'}`
  })
  // filter by nodeLabelFilter
  const filterString = nodeLabelFilter.get('tpopkontrzaehl')
  if (filterString) {
    tpopkontrzaehl = tpopkontrzaehl.filter(p =>
      p.label.toLowerCase().includes(filterString.toLowerCase())
    )
  }
  // sort by label and return
  // DO NOT sort, shall be sorted as inserted
  // return sortBy(tpopkontrzaehl, 'label')
  return tpopkontrzaehl
}
