import sortBy from 'lodash/sortBy'

export default (store: Object, tree: Object): Array<Object> => {
  const { table } = store
  const { nodeLabelFilter, apFilter } = tree
  // grab apber as array and sort them by year
  let apber = Array.from(table.apber.values())

  // filter by apFilter
  if (apFilter) {
    // ApStatus between 3 and 5
    apber = apber.filter(a => {
      const ap = table.ap.get(a.ap_id)
      return [1, 2, 3].includes(ap.ApStatus)
    })
  }
  // filter by nodeLabelFilter
  const filterString = nodeLabelFilter.get('apber')
  if (filterString) {
    apber = apber.filter(p => {
      if (p.jahr !== undefined && p.jahr !== null) {
        return p.jahr.toString().includes(filterString)
      }
      return false
    })
  }
  // add label
  apber.forEach(el => {
    el.label = el.jahr || '(kein Jahr)'
  })
  // sort
  apber = sortBy(apber, 'jahr')
  return apber
}
