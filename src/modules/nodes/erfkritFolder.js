import erfkritNodes from './erfkrit'

export default (store, projId, apArtId) => {
  const { activeUrlElements } = store
  const myErfkritNodes = erfkritNodes(store, apArtId)
  let message = myErfkritNodes.length
  if (store.table.erfkritLoading) {
    message = `...`
  }
  if (store.node.nodeLabelFilter.get(`erfkrit`)) {
    message = `${myErfkritNodes.length} gefiltert`
  }

  return {
    nodeType: `folder`,
    menuType: `erfkritFolder`,
    id: apArtId,
    label: `AP-Erfolgskriterien (${message})`,
    expanded: activeUrlElements.erfkritFolder,
    url: [`Projekte`, projId, `Arten`, apArtId, `AP-Erfolgskriterien`],
    children: myErfkritNodes,
  }
}
