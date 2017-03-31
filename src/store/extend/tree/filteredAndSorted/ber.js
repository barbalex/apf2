import sortBy from 'lodash/sortBy'

export default (store) => {
  const { activeUrlElements, table, tree } = store
  // grab ber as array and sort them by year
  let ber = Array.from(table.ber.values())
  // show only nodes of active ap
  ber = ber.filter(a => a.ApArtId === activeUrlElements.ap)
  // add label
  ber.forEach((el) => {
    el.label = `${el.BerJahr || `(kein Jahr)`}: ${el.BerTitel || `(kein Titel)`}`
  })
  // filter by tree.nodeLabelFilter
  const filterString = tree.nodeLabelFilter.get(`ber`)
  if (filterString) {
    ber = ber.filter((p) => {
      return p.label.toLowerCase().includes(filterString)
    })
  }
  // sort
  ber = sortBy(ber, `label`)
  return ber
}
