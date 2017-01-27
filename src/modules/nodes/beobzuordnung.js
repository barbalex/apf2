import sortBy from 'lodash/sortBy'

export default (store, apArtId) => {
  const { activeUrlElements, table } = store
  // grab beob_bereitgestellt as array and sort them by year
  let beobBereitgestellt = Array.from(table.beob_bereitgestellt.values())
  // show only nodes of active ap
  beobBereitgestellt = beobBereitgestellt.filter(a =>
    a.NO_ISFS === apArtId &&
    (
      (a.beobzuordnung &&
      a.beobzuordnung.type &&
      a.beobzuordnung.type === `nichtBeurteilt`) ||
      !a.beobzuordnung
    )
  )
  // map through all and create array of nodes
  let nodes = beobBereitgestellt.map((el) => {
    const quelle = table.beob_quelle.get(el.QuelleId)
    const quelleName = quelle && quelle.name ? quelle.name : ``
    const label = `${el.Datum || `(kein Datum)`}: ${el.Autor || `(kein Autor)`} (${quelleName})`
    const projId = table.ap.get(apArtId).ProjId
    const beobId = isNaN(el.BeobId) ? el.BeobId : parseInt(el.BeobId, 10)
    return {
      nodeType: `table`,
      menuType: `beobzuordnung`,
      id: beobId,
      parentId: apArtId,
      label,
      expanded: beobId === activeUrlElements.beobzuordnung,
      url: [`Projekte`, projId, `Arten`, apArtId, `nicht-beurteilte-Beobachtungen`, beobId],
    }
  })
  // filter by node.nodeLabelFilter
  const filterString = store.node.nodeLabelFilter.get(`beobzuordnung`)
  if (filterString) {
    nodes = nodes.filter(p =>
      p.label.toLowerCase().includes(filterString.toLowerCase())
    )
  }
  // sort by label and return
  return sortBy(nodes, `label`).reverse()
}
