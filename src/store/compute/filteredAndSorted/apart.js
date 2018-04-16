import sortBy from 'lodash/sortBy'

export default (store: Object, tree: Object): Array<Object> => {
  const { table } = store
  const { nodeLabelFilter } = tree
  const { ae_eigenschaften } = table
  // grab apart as array and sort them by year
  let apart = Array.from(table.apart.values())

  // sort
  // need to add artnameVollständig to sort and filter by nodeLabelFilter
  if (ae_eigenschaften.size > 0) {
    apart.forEach(x => {
      const ae = ae_eigenschaften.get(x.art_id)
      return (x.label = ae ? ae.artname : '(keine Art gewählt)')
    })
    // filter by nodeLabelFilter
    const filterString = nodeLabelFilter.get('apart')
    if (filterString) {
      apart = apart.filter(p =>
        p.label.toLowerCase().includes(filterString.toLowerCase())
      )
    }
    // sort by label
    apart = sortBy(apart, 'label')
  }
  return apart
}
