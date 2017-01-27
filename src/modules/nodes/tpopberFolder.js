import tpopberNodes from './tpopber'

export default ({ store, projId, apArtId, popId, tpopId }) => {
  const { activeUrlElements } = store
  const myTpopberNodes = tpopberNodes({ store, projId, apArtId, popId, tpopId })
  let message = myTpopberNodes.length
  if (store.table.tpopberLoading) {
    message = `...`
  }
  if (store.node.nodeLabelFilter.get(`tpopber`)) {
    message = `${myTpopberNodes.length} gefiltert`
  }

  return {
    nodeType: `folder`,
    menuType: `tpopberFolder`,
    id: tpopId,
    label: `Kontroll-Berichte (${message})`,
    expanded: activeUrlElements.tpopberFolder,
    url: [`Projekte`, projId, `Arten`, apArtId, `Populationen`, popId, `Teil-Populationen`, tpopId, `Kontroll-Berichte`],
    children: myTpopberNodes,
  }
}
