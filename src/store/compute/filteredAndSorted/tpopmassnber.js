import sortBy from 'lodash/sortBy'

export default (store: Object, tree: Object): Object => {
  const { table } = store
  const { nodeLabelFilter } = tree
  // grab tpopmassnber as array and sort them by year
  let tpopmassnber = Array.from(table.tpopmassnber.values())
  // get erfkritWerte
  const tpopmassnErfbeurtWerte = Array.from(
    table.tpopmassn_erfbeurt_werte.values(),
  )
  // map through all projekt and create array of nodes
  tpopmassnber.forEach(el => {
    const tpopmassnErfbeurtWert = tpopmassnErfbeurtWerte.find(
      e => e.BeurteilId === el.TPopMassnBerErfolgsbeurteilung,
    )
    const beurteilTxt = tpopmassnErfbeurtWert
      ? tpopmassnErfbeurtWert.BeurteilTxt
      : null
    el.label = `${el.TPopMassnBerJahr || '(kein Jahr)'}: ${beurteilTxt || '(nicht beurteilt)'}`
  })
  // filter by nodeLabelFilter
  const filterString = nodeLabelFilter.get('tpopmassnber')
  if (filterString) {
    tpopmassnber = tpopmassnber.filter(p =>
      p.label.toLowerCase().includes(filterString.toLowerCase()),
    )
  }
  // sort by label and return
  return sortBy(tpopmassnber, 'label')
}
