import sortBy from 'lodash/sortBy'
import union from 'lodash/union'

export default (store, tree) => {
  const { table } = store
  const { nodeLabelFilter, apFilter } = tree
  const { adb_eigenschaften } = table
  // grab ap as array and sort them by name
  let ap = Array.from(table.ap.values())
  // show only ap of active projekt
  //ap = ap.filter(a => a.ProjId === activeNodes.projekt)
  // show only open nodes of open projects
  const openProjectUrls = tree.openNodes.filter(
    n => n.length === 2 && n[0] === 'Projekte'
  )
  const openProjects = union(openProjectUrls.map(u => u[1]))
  console.log('openProjects:', openProjects)
  // show only ap of open projekts
  ap = ap.filter(a => openProjects.includes(a.ProjId))

  // filter by apFilter
  if (apFilter) {
    // ApStatus between 3 and 5
    ap = ap.filter(a => [1, 2, 3].includes(a.ApStatus))
  }
  // sort
  // need to add artnameVollständig to sort and filter by nodeLabelFilter
  if (adb_eigenschaften.size > 0) {
    ap.forEach(x => {
      const ae = adb_eigenschaften.get(x.ApArtId)
      return (x.label = ae ? ae.Artname : `(keine Art gewählt)`)
    })
    // filter by nodeLabelFilter
    const filterString = nodeLabelFilter.get(`ap`)
    if (filterString) {
      ap = ap.filter(p =>
        p.label.toLowerCase().includes(filterString.toLowerCase())
      )
    }
    ap = sortBy(ap, `label`)
  }
  return ap
}
