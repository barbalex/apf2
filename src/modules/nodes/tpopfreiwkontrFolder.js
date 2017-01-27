import tpopfreiwkontrNodes from './tpopfreiwkontr'

export default ({ store, projId, apArtId, popId, tpopId }) => {
  const { activeUrlElements } = store
  const myTpopfreiwkontrNodes = tpopfreiwkontrNodes({ store, projId, apArtId, popId, tpopId })
  let message = myTpopfreiwkontrNodes.length
  if (store.table.tpopkontrLoading) {
    message = `...`
  }
  if (store.node.nodeLabelFilter.get(`tpopfreiwkontr`)) {
    message = `${myTpopfreiwkontrNodes.length} gefiltert`
  }

  return {
    nodeType: `folder`,
    menuType: `tpopfreiwkontrFolder`,
    id: tpopId,
    label: `Freiwilligen-Kontrollen (${message})`,
    expanded: activeUrlElements.tpopfreiwkontrFolder,
    url: [`Projekte`, projId, `Arten`, apArtId, `Populationen`, popId, `Teil-Populationen`, tpopId, `Freiwilligen-Kontrollen`],
    children: myTpopfreiwkontrNodes,
  }
}
