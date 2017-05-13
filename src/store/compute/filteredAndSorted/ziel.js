import sortBy from 'lodash/sortBy'

export default (store: Object, tree: Object): Object => {
  const { table } = store
  const { nodeLabelFilter } = tree

  // grab ziele as array
  let ziele = Array.from(table.ziel.values())

  // get zielWerte
  const zieltypWerte = Array.from(table.ziel_typ_werte.values())
  // map through all and create array of nodes
  ziele.forEach(el => {
    const zielWert = zieltypWerte.find(e => e.ZieltypId === el.ZielTyp)
    const zieltypTxt = zielWert ? zielWert.ZieltypTxt : 'kein Zieltyp'
    el.label = `${el.ZielBezeichnung || '(kein Ziel)'} (${zieltypTxt})`
  })

  // filter by nodeLabelFilter
  const filterString = nodeLabelFilter.get('ziel')
  if (filterString) {
    ziele = ziele.filter(p =>
      p.label.toLowerCase().includes(filterString.toLowerCase()),
    )
  }
  // sort by label and return
  return sortBy(ziele, 'label')
}
