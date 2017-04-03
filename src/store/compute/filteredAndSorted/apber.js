import sortBy from 'lodash/sortBy'

export default (store, tree) => {
  const { table } = store
  const { activeNodes, nodeLabelFilter, apFilter } = tree
  // grab apber as array and sort them by year
  let apber = Array.from(table.apber.values())
  // show only nodes of active ap
  apber = apber.filter(a => a.ApArtId === activeNodes.ap)
  // filter by apFilter
  if (apFilter) {
    // ApStatus between 3 and 5
    apber = apber.filter((a) => {
      const ap = table.ap.get(a.ApArtId)
      return [1, 2, 3].includes(ap.ApStatus)
    })
  }
  // filter by nodeLabelFilter
  const filterString = nodeLabelFilter.get(`apber`)
  if (filterString) {
    apber = apber.filter((p) => {
      if (p.JBerJahr !== undefined && p.JBerJahr !== null) {
        return p.JBerJahr.toString().includes(filterString)
      }
      return false
    })
  }
  // add label
  apber.forEach((el) => {
    el.label = el.JBerJahr || `(kein Jahr)`
  })
  // sort
  apber = sortBy(apber, `JBerJahr`)
  return apber
}
