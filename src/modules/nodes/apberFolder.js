import apberNodes from './apber'

export default (store, projId, apArtId) => {
  const { activeUrlElements } = store
  const myApberNodes = apberNodes(store, apArtId)
  let message = myApberNodes.length
  if (store.table.apberLoading) {
    message = `...`
  }
  if (store.node.nodeLabelFilter.get(`apber`)) {
    message = `${myApberNodes.length} gefiltert`
  }

  return {
    nodeType: `folder`,
    menuType: `apberFolder`,
    id: apArtId,
    label: `AP-Berichte (${message})`,
    expanded: activeUrlElements.apberFolder,
    url: [`Projekte`, projId, `Arten`, apArtId, `AP-Berichte`],
    children: myApberNodes,
  }
}
