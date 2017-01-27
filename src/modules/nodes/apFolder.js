import apNodes from './ap'

export default (store, projId) => {
  const { activeUrlElements } = store
  const myApNodes = apNodes(store, projId)
  let message = myApNodes.length
  if (store.table.apLoading) {
    message = `...`
  }
  if (store.node.nodeLabelFilter.get(`ap`)) {
    message = `${myApNodes.length} gefiltert`
  }

  return {
    nodeType: `folder`,
    menuType: `apFolder`,
    id: projId,
    label: `Arten (${message})`,
    expanded: activeUrlElements.apFolder,
    url: [`Projekte`, projId, `Arten`],
    children: myApNodes,
  }
}
