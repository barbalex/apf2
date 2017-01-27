import assozartNodes from './assozart'

export default (store, projId, apArtId) => {
  const { activeUrlElements } = store
  const myAssozartNodes = assozartNodes(store, apArtId)
  let message = myAssozartNodes.length
  if (store.table.assozartLoading) {
    message = `...`
  }
  if (store.node.nodeLabelFilter.get(`assozart`)) {
    message = `${myAssozartNodes.length} gefiltert`
  }

  return {
    nodeType: `folder`,
    menuType: `assozartFolder`,
    id: apArtId,
    label: `assoziierte Arten (${message})`,
    expanded: activeUrlElements.assozartFolder,
    url: [`Projekte`, projId, `Arten`, apArtId, `assoziierte-Arten`],
    children: myAssozartNodes,
  }
}
