import tpopNodes from './tpop'

export default (store, projId, apArtId, popId) => {
  const { activeUrlElements } = store
  const myTpopNodes = tpopNodes({ store, apArtId, projId, popId })
  let message = myTpopNodes.length
  if (store.table.tpopLoading) {
    message = `...`
  }
  if (store.node.nodeLabelFilter.get(`tpop`)) {
    message = `${myTpopNodes.length} gefiltert`
  }

  return {
    nodeType: `folder`,
    menuType: `tpopFolder`,
    id: popId,
    label: `Teil-Populationen (${message})`,
    expanded: activeUrlElements.tpopFolder,
    url: [`Projekte`, projId, `Arten`, apArtId, `Populationen`, popId, `Teil-Populationen`],
    children: myTpopNodes,
  }
}
