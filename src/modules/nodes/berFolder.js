import berNodes from './ber'

export default (store, projId, apArtId) => {
  const { activeUrlElements } = store
  const myBerNodes = berNodes(store, apArtId)
  let message = myBerNodes.length
  if (store.table.berLoading) {
    message = `...`
  }
  if (store.node.nodeLabelFilter.get(`ber`)) {
    message = `${myBerNodes.length} gefiltert`
  }

  return {
    nodeType: `folder`,
    menuType: `berFolder`,
    id: apArtId,
    label: `Berichte (${message})`,
    expanded: activeUrlElements.berFolder,
    url: [`Projekte`, projId, `Arten`, apArtId, `Berichte`],
    children: myBerNodes,
  }
}
