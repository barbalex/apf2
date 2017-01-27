import sortBy from 'lodash/sortBy'

export default (store, apArtId) => {
  const { activeUrlElements } = store
  // grab beobNichtZuzuordnen as array and sort them by year
  const beobNichtZuzuordnen = Array
    .from(store.table.beobzuordnung.values())
    .filter(b => b.BeobNichtZuordnen === 1)
    // show only nodes of active ap
    .filter(a => (
      a.beobBereitgestellt &&
      a.beobBereitgestellt.NO_ISFS &&
      a.beobBereitgestellt.NO_ISFS === apArtId
    ))
  // map through all and create array of nodes
  let nodes = beobNichtZuzuordnen.map((el) => {
    let datum = ``
    let autor = ``
    if (el.beobBereitgestellt) {
      if (el.beobBereitgestellt.Datum) {
        datum = el.beobBereitgestellt.Datum
      }
      if (el.beobBereitgestellt.Autor) {
        autor = el.beobBereitgestellt.Autor
      }
    }
    const quelle = store.table.beob_quelle.get(el.QuelleId)
    const quelleName = quelle && quelle.name ? quelle.name : ``
    const label = `${datum || `(kein Datum)`}: ${autor || `(kein Autor)`} (${quelleName})`
    const projId = store.table.ap.get(apArtId).ProjId
    const beobId = isNaN(el.NO_NOTE) ? el.NO_NOTE : parseInt(el.NO_NOTE, 10)
    return {
      nodeType: `table`,
      menuType: `beobNichtZuzuordnen`,
      id: beobId,
      parentId: apArtId,
      label,
      expanded: beobId === activeUrlElements.beobNichtZuzuordnen,
      url: [`Projekte`, projId, `Arten`, apArtId, `nicht-zuzuordnende-Beobachtungen`, beobId],
    }
  })
  // filter by node.nodeLabelFilter
  const filterString = store.node.nodeLabelFilter.get(`beobNichtZuzuordnen`)
  if (filterString) {
    nodes = nodes.filter(p =>
      p.label.toLowerCase().includes(filterString.toLowerCase())
    )
  }
  // sort by label and return
  return sortBy(nodes, `label`)
}
