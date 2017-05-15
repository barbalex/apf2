import sortBy from 'lodash/sortBy'

export default (store: Object, tree: Object): Array<Object> => {
  const { table } = store
  const { nodeLabelFilter } = tree
  // grab popmassnber as array and sort them by year
  let popmassnber = Array.from(table.popmassnber.values())
  // get erfkritWerte
  const tpopmassnErfbeurtWerte = Array.from(
    table.tpopmassn_erfbeurt_werte.values(),
  )
  // map through all projekt and create array of nodes
  popmassnber.forEach(el => {
    const tpopmassnErfbeurtWert = tpopmassnErfbeurtWerte.find(
      e => e.BeurteilId === el.PopMassnBerErfolgsbeurteilung,
    )
    const beurteilTxt = tpopmassnErfbeurtWert
      ? tpopmassnErfbeurtWert.BeurteilTxt
      : null
    el.label = `${el.PopMassnBerJahr || '(kein Jahr)'}: ${beurteilTxt || '(nicht beurteilt)'}`
  })
  // filter by nodeLabelFilter
  const filterString = nodeLabelFilter.get('popmassnber')
  if (filterString) {
    popmassnber = popmassnber.filter(p =>
      p.label.toLowerCase().includes(filterString.toLowerCase()),
    )
  }
  // sort by label and return
  return sortBy(popmassnber, 'label')
}
