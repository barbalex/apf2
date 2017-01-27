import popNodes from './pop'

export default (store, projId, apArtId) => {
  const { activeUrlElements } = store
  const myPopNodes = popNodes(store, apArtId)
  let message = myPopNodes.length
  if (store.table.popLoading) {
    message = `...`
  }
  if (store.node.nodeLabelFilter.get(`pop`)) {
    message = `${myPopNodes.length} gefiltert`
  }

  return {
    nodeType: `folder`,
    menuType: `popFolder`,
    id: apArtId,
    label: `Populationen (${message})`,
    expanded: activeUrlElements.popFolder,
    url: [`Projekte`, projId, `Arten`, apArtId, `Populationen`],
    children: myPopNodes,
  }
}
